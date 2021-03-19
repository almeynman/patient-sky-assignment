import * as joda from "@js-joda/core";
import * as datetime from "./datetime";

export type TimeInterval = {
  start: joda.ZonedDateTime;
  end: joda.ZonedDateTime;
};

export const parseTimeInterval = (string: string): TimeInterval => {
  const [startString, endString] = string.split("/");
  const start = datetime.parseDateTime(startString);
  const end = datetime.parseDateTime(endString);
  return { start, end };
};

export const slice = (
  timeInterval: TimeInterval,
  duration: joda.Duration
): TimeInterval[] => {
  const result: TimeInterval[] = [];
  let lastItemStart = timeInterval.start;
  let lastItemEnd = timeInterval.start.plus(duration);
  while (
    lastItemEnd.isBefore(timeInterval.end) ||
    lastItemEnd.isEqual(timeInterval.end)
  ) {
    result.push({
      start: lastItemStart,
      end: lastItemEnd,
    });
    lastItemStart = lastItemEnd;
    lastItemEnd = lastItemEnd.plus(duration);
  }
  return result;
};

export const minus = (
  interval1: TimeInterval,
  interval2: TimeInterval
): TimeInterval[] => {
  if (
    interval1.start.isBefore(interval2.start) &&
    (interval1.end.isBefore(interval2.end) ||
      interval1.end.isEqual(interval2.end))
  ) {
    if (interval1.end.isBefore(interval2.start)) {
      return [interval1];
    }
    return [
      {
        start: interval1.start,
        end: interval2.start,
      },
    ];
  }
  if (
    (interval2.start.isBefore(interval1.start) ||
      interval2.start.isEqual(interval1.start)) &&
    interval2.end.isBefore(interval1.end)
  ) {
    if (interval2.end.isBefore(interval1.start)) {
      return [interval1];
    }
    return [
      {
        start: interval2.end,
        end: interval1.end,
      },
    ];
  }
  if (
    interval1.start.isBefore(interval2.start) &&
    interval1.end.isAfter(interval2.end)
  ) {
    return [
      {
        start: interval1.start,
        end: interval2.start,
      },
      {
        start: interval2.end,
        end: interval1.end,
      },
    ];
  }
  if (
    (interval1.start.isAfter(interval2.start) ||
      interval1.start.isEqual(interval2.start)) &&
    (interval1.end.isBefore(interval2.end) ||
      interval1.end.isEqual(interval2.end))
  ) {
    return [];
  }
  throw new TimeIntervalError(
    "This should never happen, but encountered unexpected case"
  );
};

export const minusMultiple = (
  interval: TimeInterval,
  toMinusIntervals: TimeInterval[]
): TimeInterval[] => {
  let stack = [interval];
  for (const toMinusInterval of toMinusIntervals) {
    const tempStack = [];
    while (stack.length > 0) {
      const subInterval = stack.pop();
      const result = minus(subInterval, toMinusInterval);
      tempStack.push(...result);
    }
    stack.push(...tempStack);
  }
  return stack;
};

export const duration = (interval: TimeInterval): joda.Duration => {
  return joda.Duration.between(interval.start, interval.end);
};

export const stringify = (interval: TimeInterval): string =>
  JSON.stringify({
    start: interval.start.toString(),
    end: interval.end.toString(),
  });

export class TimeIntervalError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
