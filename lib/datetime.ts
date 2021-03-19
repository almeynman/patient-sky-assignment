import * as joda from "@js-joda/core";

export const parseDateTime = (string: string): joda.ZonedDateTime => {
  let result;
  try {
    result = joda.ZonedDateTime.parse(string);
  } catch (e) {
    try {
      result = joda.LocalDateTime.parse(string).atZone(joda.ZoneId.UTC);
    } catch (e) {
      throw new DateTimeError(e.message);
    }
  }
  return result;
};

export class DateTimeError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, DateTimeError.prototype);
  }
}
