import * as timeInterval from "./timeInterval";
import * as joda from "@js-joda/core";

describe("timeInterval", () => {
  it("should parse time interval", () => {
    const start = "2021-03-17T13:00:00Z";
    const end = "2021-03-17T13:00:00Z";
    expect(timeInterval.parseTimeInterval(`${start}/${end}`)).toEqual({
      start: joda.ZonedDateTime.parse(start),
      end: joda.ZonedDateTime.parse(end),
    });
  });
  it("should slice time interval by specified hours", () => {
    const interval = {
      start: joda.ZonedDateTime.parse("2021-03-17T13:00:00Z"),
      end: joda.ZonedDateTime.parse("2021-03-17T15:30:00Z"),
    };
    const duration = joda.Duration.ofMinutes(60);
    expect(timeInterval.slice(interval, duration)).toEqual([
      {
        start: joda.ZonedDateTime.parse("2021-03-17T13:00:00Z"),
        end: joda.ZonedDateTime.parse("2021-03-17T14:00:00Z"),
      },
      {
        start: joda.ZonedDateTime.parse("2021-03-17T14:00:00Z"),
        end: joda.ZonedDateTime.parse("2021-03-17T15:00:00Z"),
      },
    ]);
  });
  it("should slice correctly if interval is exact multiple of duration", () => {
    const interval = {
      start: joda.ZonedDateTime.parse("2021-03-17T13:00:00Z"),
      end: joda.ZonedDateTime.parse("2021-03-17T15:00:00Z"),
    };
    const duration = joda.Duration.ofMinutes(60);
    expect(timeInterval.slice(interval, duration)).toEqual([
      {
        start: joda.ZonedDateTime.parse("2021-03-17T13:00:00Z"),
        end: joda.ZonedDateTime.parse("2021-03-17T14:00:00Z"),
      },
      {
        start: joda.ZonedDateTime.parse("2021-03-17T14:00:00Z"),
        end: joda.ZonedDateTime.parse("2021-03-17T15:00:00Z"),
      },
    ]);
  });
  it("should return empty array if duration is bigger than time interval", () => {
    const interval = {
      start: joda.ZonedDateTime.parse("2021-03-17T13:00:00Z"),
      end: joda.ZonedDateTime.parse("2021-03-17T15:30:00Z"),
    };
    const duration = joda.Duration.ofMinutes(180);
    expect(timeInterval.slice(interval, duration)).toEqual([]);
  });
  it("should minus one time interval from another if first interval's end overlaps with second interval's start", () => {
    const interval1 = {
      start: joda.ZonedDateTime.parse("2021-03-17T13:00:00Z"),
      end: joda.ZonedDateTime.parse("2021-03-17T15:30:00Z"),
    };
    const interval2 = {
      start: joda.ZonedDateTime.parse("2021-03-17T15:00:00Z"),
      end: joda.ZonedDateTime.parse("2021-03-17T16:00:00Z"),
    };
    expect(timeInterval.minus(interval1, interval2)).toEqual([
      {
        start: joda.ZonedDateTime.parse("2021-03-17T13:00:00Z"),
        end: joda.ZonedDateTime.parse("2021-03-17T15:00:00Z"),
      },
    ]);
  });
  it("should minus one time interval from another if first interval's end overlaps with second interval's start with end values being the same", () => {
    const interval1 = {
      start: joda.ZonedDateTime.parse("2021-03-17T13:00:00Z"),
      end: joda.ZonedDateTime.parse("2021-03-17T15:30:00Z"),
    };
    const interval2 = {
      start: joda.ZonedDateTime.parse("2021-03-17T15:00:00Z"),
      end: joda.ZonedDateTime.parse("2021-03-17T15:30:00Z"),
    };

    expect(timeInterval.minus(interval1, interval2)).toEqual([
      {
        start: interval1.start,
        end: interval2.start,
      },
    ]);
  });
  it("should minus one time interval from another if first interval's start overlaps with second interval's end", () => {
    const interval1 = {
      start: joda.ZonedDateTime.parse("2021-03-17T13:00:00Z"),
      end: joda.ZonedDateTime.parse("2021-03-17T15:30:00Z"),
    };
    const interval2 = {
      start: joda.ZonedDateTime.parse("2021-03-17T12:00:00Z"),
      end: joda.ZonedDateTime.parse("2021-03-17T14:00:00Z"),
    };
    expect(timeInterval.minus(interval1, interval2)).toEqual([
      {
        start: joda.ZonedDateTime.parse("2021-03-17T14:00:00Z"),
        end: joda.ZonedDateTime.parse("2021-03-17T15:30:00Z"),
      },
    ]);
  });
  it("should minus one time interval from another if first interval's start overlaps with second interval's end with start values being the same", () => {
    const interval1 = {
      start: joda.ZonedDateTime.parse("2021-03-17T13:00:00Z"),
      end: joda.ZonedDateTime.parse("2021-03-17T15:30:00Z"),
    };
    const interval2 = {
      start: joda.ZonedDateTime.parse("2021-03-17T13:00:00Z"),
      end: joda.ZonedDateTime.parse("2021-03-17T14:00:00Z"),
    };
    expect(timeInterval.minus(interval1, interval2)).toEqual([
      {
        start: joda.ZonedDateTime.parse("2021-03-17T14:00:00Z"),
        end: joda.ZonedDateTime.parse("2021-03-17T15:30:00Z"),
      },
    ]);
  });
  it("should minus one time interval from another if second interval is a subinterval of the first", () => {
    const interval1 = {
      start: joda.ZonedDateTime.parse("2021-03-17T13:00:00Z"),
      end: joda.ZonedDateTime.parse("2021-03-17T15:30:00Z"),
    };
    const interval2 = {
      start: joda.ZonedDateTime.parse("2021-03-17T14:00:00Z"),
      end: joda.ZonedDateTime.parse("2021-03-17T15:00:00Z"),
    };
    expect(timeInterval.minus(interval1, interval2)).toEqual([
      {
        start: joda.ZonedDateTime.parse("2021-03-17T13:00:00Z"),
        end: joda.ZonedDateTime.parse("2021-03-17T14:00:00Z"),
      },
      {
        start: joda.ZonedDateTime.parse("2021-03-17T15:00:00Z"),
        end: joda.ZonedDateTime.parse("2021-03-17T15:30:00Z"),
      },
    ]);
  });
  it("should minus one time interval from another if second interval is a subinterval of the first with start values being the same", () => {
    const interval1 = {
      start: joda.ZonedDateTime.parse("2021-03-17T13:00:00Z"),
      end: joda.ZonedDateTime.parse("2021-03-17T15:30:00Z"),
    };
    const interval2 = {
      start: joda.ZonedDateTime.parse("2021-03-17T13:00:00Z"),
      end: joda.ZonedDateTime.parse("2021-03-17T15:00:00Z"),
    };
    expect(timeInterval.minus(interval1, interval2)).toEqual([
      {
        start: joda.ZonedDateTime.parse("2021-03-17T15:00:00Z"),
        end: joda.ZonedDateTime.parse("2021-03-17T15:30:00Z"),
      },
    ]);
  });
  it("should minus one time interval from another if second interval is a subinterval of the first with end values being the same", () => {
    const interval1 = {
      start: joda.ZonedDateTime.parse("2021-03-17T13:00:00Z"),
      end: joda.ZonedDateTime.parse("2021-03-17T15:30:00Z"),
    };
    const interval2 = {
      start: joda.ZonedDateTime.parse("2021-03-17T13:30:00Z"),
      end: joda.ZonedDateTime.parse("2021-03-17T15:30:00Z"),
    };
    expect(timeInterval.minus(interval1, interval2)).toEqual([
      {
        start: joda.ZonedDateTime.parse("2021-03-17T13:00:00Z"),
        end: joda.ZonedDateTime.parse("2021-03-17T13:30:00Z"),
      },
    ]);
  });
  it("should return same interval if two intervals do not intersect and second interval is after the first", () => {
    const interval1 = {
      start: joda.ZonedDateTime.parse("2021-03-17T13:00:00Z"),
      end: joda.ZonedDateTime.parse("2021-03-17T15:30:00Z"),
    };
    const interval2 = {
      start: joda.ZonedDateTime.parse("2021-03-17T17:00:00Z"),
      end: joda.ZonedDateTime.parse("2021-03-17T18:00:00Z"),
    };
    expect(timeInterval.minus(interval1, interval2)).toEqual([interval1]);
  });
  it("should return same interval if two intervals do not intersect and second interval is before the first", () => {
    const interval1 = {
      start: joda.ZonedDateTime.parse("2021-03-17T13:00:00Z"),
      end: joda.ZonedDateTime.parse("2021-03-17T15:30:00Z"),
    };
    const interval2 = {
      start: joda.ZonedDateTime.parse("2021-03-17T12:00:00Z"),
      end: joda.ZonedDateTime.parse("2021-03-17T12:30:00Z"),
    };
    expect(timeInterval.minus(interval1, interval2)).toEqual([interval1]);
  });
  it("should return same interval if two intervals do not intersect and second interval's start equals first interval's end", () => {
    const interval1 = {
      start: joda.ZonedDateTime.parse("2021-03-17T13:00:00Z"),
      end: joda.ZonedDateTime.parse("2021-03-17T15:30:00Z"),
    };
    const interval2 = {
      start: joda.ZonedDateTime.parse("2021-03-17T15:30:00Z"),
      end: joda.ZonedDateTime.parse("2021-03-17T18:00:00Z"),
    };
    expect(timeInterval.minus(interval1, interval2)).toEqual([interval1]);
  });
  it("should return same interval if two intervals do not intersect and second interval's end equals first interval's start", () => {
    const interval1 = {
      start: joda.ZonedDateTime.parse("2021-03-17T13:00:00Z"),
      end: joda.ZonedDateTime.parse("2021-03-17T15:30:00Z"),
    };
    const interval2 = {
      start: joda.ZonedDateTime.parse("2021-03-17T12:30:00Z"),
      end: joda.ZonedDateTime.parse("2021-03-17T13:00:00Z"),
    };
    expect(timeInterval.minus(interval1, interval2)).toEqual([interval1]);
  });
  it("should return empty array if first interval is a subinterval of the second interval", () => {
    const interval1 = {
      start: joda.ZonedDateTime.parse("2021-03-17T13:00:00Z"),
      end: joda.ZonedDateTime.parse("2021-03-17T15:30:00Z"),
    };
    const interval2 = {
      start: joda.ZonedDateTime.parse("2021-03-17T12:00:00Z"),
      end: joda.ZonedDateTime.parse("2021-03-17T16:00:00Z"),
    };
    expect(timeInterval.minus(interval1, interval2)).toEqual([]);
  });
  it("should return empty array if first interval is a subinterval of the second interval and end values are the same", () => {
    const interval1 = {
      start: joda.ZonedDateTime.parse("2021-03-17T13:30:00Z"),
      end: joda.ZonedDateTime.parse("2021-03-17T14:00:00Z"),
    };
    const interval2 = {
      start: joda.ZonedDateTime.parse("2021-03-17T13:15:00Z"),
      end: joda.ZonedDateTime.parse("2021-03-17T14:00:00Z"),
    };
    expect(timeInterval.minus(interval1, interval2)).toEqual([]);
  });
  it("should return empty array if first interval is a subinterval of the second interval and start values are the same", () => {
    const interval1 = {
      start: joda.ZonedDateTime.parse("2021-03-17T13:30:00Z"),
      end: joda.ZonedDateTime.parse("2021-03-17T14:00:00Z"),
    };
    const interval2 = {
      start: joda.ZonedDateTime.parse("2021-03-17T13:30:00Z"),
      end: joda.ZonedDateTime.parse("2021-03-17T14:30:00Z"),
    };
    expect(timeInterval.minus(interval1, interval2)).toEqual([]);
  });
  it("should minus multiple non-overlapping intervals", () => {
    const interval = {
      start: joda.ZonedDateTime.parse("2021-03-17T13:00:00Z"),
      end: joda.ZonedDateTime.parse("2021-03-17T15:30:00Z"),
    };
    const toMinus = [
      {
        start: joda.ZonedDateTime.parse("2021-03-17T12:00:00Z"),
        end: joda.ZonedDateTime.parse("2021-03-17T13:30:00Z"),
      },
      {
        start: joda.ZonedDateTime.parse("2021-03-17T14:00:00Z"),
        end: joda.ZonedDateTime.parse("2021-03-17T14:30:00Z"),
      },
      {
        start: joda.ZonedDateTime.parse("2021-03-17T15:00:00Z"),
        end: joda.ZonedDateTime.parse("2021-03-17T16:00:00Z"),
      },
    ];
    expect(timeInterval.minusMultiple(interval, toMinus)).toEqual([
      {
        start: joda.ZonedDateTime.parse("2021-03-17T14:30:00Z"),
        end: joda.ZonedDateTime.parse("2021-03-17T15:00:00Z"),
      },
      {
        start: joda.ZonedDateTime.parse("2021-03-17T13:30:00Z"),
        end: joda.ZonedDateTime.parse("2021-03-17T14:00:00Z"),
      },
    ]);
  });
  it("should minus multiple overlapping intervals", () => {
    const interval = {
      start: joda.ZonedDateTime.parse("2021-03-17T13:00:00Z"),
      end: joda.ZonedDateTime.parse("2021-03-17T15:30:00Z"),
    };
    const toMinus = [
      {
        start: joda.ZonedDateTime.parse("2021-03-17T12:00:00Z"),
        end: joda.ZonedDateTime.parse("2021-03-17T13:30:00Z"),
      },
      {
        start: joda.ZonedDateTime.parse("2021-03-17T13:00:00Z"),
        end: joda.ZonedDateTime.parse("2021-03-17T14:00:00Z"),
      },
      {
        start: joda.ZonedDateTime.parse("2021-03-17T13:30:00Z"),
        end: joda.ZonedDateTime.parse("2021-03-17T14:30:00Z"),
      },
    ];
    expect(timeInterval.minusMultiple(interval, toMinus)).toEqual([
      {
        start: joda.ZonedDateTime.parse("2021-03-17T14:30:00Z"),
        end: joda.ZonedDateTime.parse("2021-03-17T15:30:00Z"),
      },
    ]);
  });
  it("should minus multiple overlapping intervals without error", () => {
    const interval = {
      start: joda.ZonedDateTime.parse("2021-03-17T13:00:00Z"),
      end: joda.ZonedDateTime.parse("2021-03-17T17:30:00Z"),
    };
    const toMinus = [
      {
        start: joda.ZonedDateTime.parse("2021-03-17T13:00:00Z"),
        end: joda.ZonedDateTime.parse("2021-03-17T13:30:00Z"),
      },
      {
        start: joda.ZonedDateTime.parse("2021-03-17T14:00:00Z"),
        end: joda.ZonedDateTime.parse("2021-03-17T14:30:00Z"),
      },
      {
        start: joda.ZonedDateTime.parse("2021-03-17T13:15:00Z"),
        end: joda.ZonedDateTime.parse("2021-03-17T14:00:00Z"),
      },
      {
        start: joda.ZonedDateTime.parse("2021-03-17T15:30:00Z"),
        end: joda.ZonedDateTime.parse("2021-03-17T17:00:00Z"),
      },
    ];
    expect(timeInterval.minusMultiple(interval, toMinus)).toEqual([
      {
        start: joda.ZonedDateTime.parse("2021-03-17T14:30:00Z"),
        end: joda.ZonedDateTime.parse("2021-03-17T15:30:00Z"),
      },
      {
        start: joda.ZonedDateTime.parse("2021-03-17T17:00:00Z"),
        end: joda.ZonedDateTime.parse("2021-03-17T17:30:00Z"),
      },
    ]);
  });
  it("should handle empty array in minus multiple", () => {
    const interval = {
      start: joda.ZonedDateTime.parse("2021-03-17T13:00:00Z"),
      end: joda.ZonedDateTime.parse("2021-03-17T17:30:00Z"),
    };
    const toMinus = [];
    expect(timeInterval.minusMultiple(interval, toMinus)).toEqual([interval]);
  });
  it("should calculate duration", () => {
    const interval = {
      start: joda.ZonedDateTime.parse("2021-03-17T13:00:00Z"),
      end: joda.ZonedDateTime.parse("2021-03-17T15:30:00Z"),
    };
    expect(timeInterval.duration(interval)).toEqual(
      joda.Duration.ofMinutes(150)
    );
  });
  it("should calculate duration in days", () => {
    const interval = {
      start: joda.ZonedDateTime.parse("2021-03-17T13:00:00Z"),
      end: joda.ZonedDateTime.parse("2021-03-18T13:00:00Z"),
    };
    expect(timeInterval.duration(interval)).toEqual(joda.Duration.ofDays(1));
  });
});
