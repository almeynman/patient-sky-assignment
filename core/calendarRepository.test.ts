import * as joda from "@js-joda/core";
import * as db from "./db";
import * as calendarRepository from "./calendarRepository";
import * as datetime from "../lib/datetime";

jest.mock("./db");

describe("calendarRepository", () => {
  it("should get appointments by calendar id", () => {
    const calendarId = "test-id";
    const appointments = [
      { start: "2019-04-23T12:15:00", end: "2019-04-23T12:30:00" },
    ];
    (db.calendars as jest.Mock).mockImplementationOnce(() => ({
      [calendarId]: { appointments },
    }));

    const result = calendarRepository.getAppointmentsByCalendarId(calendarId);
    expect(result).toEqual([
      {
        start: datetime.parseDateTime("2019-04-23T12:15:00"),
        end: datetime.parseDateTime("2019-04-23T12:30:00"),
      },
    ]);
  });

  it("should get appointments within specified period", () => {
    const calendarId = "test-id";
    const appointments = [
      { start: "2019-04-23T12:15:00", end: "2019-04-23T12:30:00" },
      { start: "2021-03-17T13:30:00", end: "2021-03-17T14:30:00" },
    ];
    const periodToSearch = {
      start: joda.ZonedDateTime.parse("2021-03-17T13:00:00Z"),
      end: joda.ZonedDateTime.parse("2021-03-17T15:30:00Z"),
    };

    (db.calendars as jest.Mock).mockImplementationOnce(() => ({
      [calendarId]: { appointments },
    }));

    const result = calendarRepository.getAppointmentsByCalendarId(
      calendarId,
      periodToSearch
    );
    expect(result).toEqual([
      {
        start: datetime.parseDateTime("2021-03-17T13:30:00"),
        end: datetime.parseDateTime("2021-03-17T14:30:00"),
      },
    ]);
  });
});
