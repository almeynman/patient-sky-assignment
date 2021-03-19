import * as joda from "@js-joda/core";
import * as datetime from "./datetime";

describe("datetime", () => {
  it("should parse ISO8601 string", () => {
    const string = "2021-03-17T13:00:00Z";
    expect(datetime.parseDateTime(string)).toEqual(
      joda.ZonedDateTime.parse(string)
    );
  });
  it("should assume UTC zone if no zone info", () => {
    const string = "2021-03-17T13:00:00";
    expect(datetime.parseDateTime(string)).toEqual(
      joda.ZonedDateTime.parse(`${string}Z`)
    );
  });
  it("should throw error if cannot be parsed", () => {
    const string = "this-is-not-a-date-and-would-fail";
    expect(() => datetime.parseDateTime(string)).toThrow(datetime.DateTimeError);
  });
});
