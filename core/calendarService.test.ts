import * as joda from "@js-joda/core";
import * as timeInterval from "../lib/timeInterval";
import * as calendarService from "./calendarService";
import * as calendarRepository from "./calendarRepository";

jest.mock("./calendarRepository");

describe("calendarService", () => {
  it("should find available time for 1 calendar and 0 appointments", () => {
    const calendarIds = ["first-calendar-id"];
    const duration = joda.Duration.ofMinutes(60);
    const periodToSearch = {
      start: joda.ZonedDateTime.parse("2021-03-17T13:00:00Z"),
      end: joda.ZonedDateTime.parse("2021-03-17T15:30:00Z"),
    };
    (calendarRepository.getAppointmentsByCalendarId as jest.Mock).mockImplementationOnce(
      () => []
    );
    const availableTimes = calendarService.findAvailableTimes(
      calendarIds,
      duration,
      periodToSearch
    );
    expect(availableTimes).toEqual([
      {
        start: periodToSearch.start,
        end: joda.ZonedDateTime.parse("2021-03-17T14:00:00Z"),
      },
      {
        start: joda.ZonedDateTime.parse("2021-03-17T14:00:00Z"),
        end: joda.ZonedDateTime.parse("2021-03-17T15:00:00Z"),
      },
    ]);
  });
  it("should find available time for 1 calendar and 1 appointment", () => {
    const calendarIds = ["48cadf26-975e-11e5-b9c2-c8e0eb18c1e9"];
    const duration = joda.Duration.ofMinutes(60);
    const periodToSearch = timeInterval.parseTimeInterval(
      "2021-03-17T13:00:00Z/2021-03-17T15:30:00Z"
    );
    (calendarRepository.getAppointmentsByCalendarId as jest.Mock).mockImplementationOnce(
      () => [
        {
          start: joda.ZonedDateTime.parse("2021-03-17T13:00:00Z"),
          end: joda.ZonedDateTime.parse("2021-03-17T13:30:00Z"),
        },
      ]
    );
    const availableTimes = calendarService.findAvailableTimes(
      calendarIds,
      duration,
      periodToSearch
    );
    expect(availableTimes).toEqual([
      {
        start: joda.ZonedDateTime.parse("2021-03-17T13:30:00Z"),
        end: joda.ZonedDateTime.parse("2021-03-17T14:30:00Z"),
      },
      {
        start: joda.ZonedDateTime.parse("2021-03-17T14:30:00Z"),
        end: joda.ZonedDateTime.parse("2021-03-17T15:30:00Z"),
      },
    ]);
  });
  it("should find available time for 1 calendar and 2 appointments", () => {
    const calendarIds = ["48cadf26-975e-11e5-b9c2-c8e0eb18c1e9"];
    const duration = joda.Duration.ofMinutes(30);
    const periodToSearch = timeInterval.parseTimeInterval(
      "2021-03-17T13:00:00Z/2021-03-17T15:30:00Z"
    );
    (calendarRepository.getAppointmentsByCalendarId as jest.Mock).mockImplementationOnce(
      () => [
        {
          start: joda.ZonedDateTime.parse("2021-03-17T13:00:00Z"),
          end: joda.ZonedDateTime.parse("2021-03-17T13:30:00Z"),
        },
        {
          start: joda.ZonedDateTime.parse("2021-03-17T14:00:00Z"),
          end: joda.ZonedDateTime.parse("2021-03-17T14:30:00Z"),
        },
      ]
    );
    const availableTimes = calendarService.findAvailableTimes(
      calendarIds,
      duration,
      periodToSearch
    );
    expect(availableTimes).toEqual([
      {
        start: joda.ZonedDateTime.parse("2021-03-17T13:30:00Z"),
        end: joda.ZonedDateTime.parse("2021-03-17T14:00:00Z"),
      },
      {
        start: joda.ZonedDateTime.parse("2021-03-17T14:30:00Z"),
        end: joda.ZonedDateTime.parse("2021-03-17T15:00:00Z"),
      },
      {
        start: joda.ZonedDateTime.parse("2021-03-17T15:00:00Z"),
        end: joda.ZonedDateTime.parse("2021-03-17T15:30:00Z"),
      },
    ]);
  });
  it("should find available time for 2 calendars each with multiple appointments", () => {
    const calendarIds = ["danny-calendar-id", "emma-calendar-id"];
    const duration = joda.Duration.ofMinutes(30);
    const periodToSearch = timeInterval.parseTimeInterval(
      "2021-03-17T13:00:00Z/2021-03-17T17:30:00Z"
    );

    const dannyAppointments = [
      {
        start: joda.ZonedDateTime.parse("2021-03-17T13:00:00Z"),
        end: joda.ZonedDateTime.parse("2021-03-17T13:30:00Z"),
      },
      {
        start: joda.ZonedDateTime.parse("2021-03-17T14:00:00Z"),
        end: joda.ZonedDateTime.parse("2021-03-17T14:30:00Z"),
      },
    ];
    (calendarRepository.getAppointmentsByCalendarId as jest.Mock).mockImplementationOnce(
      () => dannyAppointments
    );
    const emmaAppointments = [
      {
        start: joda.ZonedDateTime.parse("2021-03-17T13:15:00Z"),
        end: joda.ZonedDateTime.parse("2021-03-17T14:00:00Z"),
      },
      {
        start: joda.ZonedDateTime.parse("2021-03-17T15:30:00Z"),
        end: joda.ZonedDateTime.parse("2021-03-17T17:00:00Z"),
      },
    ];
    (calendarRepository.getAppointmentsByCalendarId as jest.Mock).mockImplementationOnce(
      () => emmaAppointments
    );
    const availableTimes = calendarService.findAvailableTimes(
      calendarIds,
      duration,
      periodToSearch
    );
    expect(availableTimes).toEqual([
      {
        start: joda.ZonedDateTime.parse("2021-03-17T14:30:00Z"),
        end: joda.ZonedDateTime.parse("2021-03-17T15:00:00Z"),
      },
      {
        start: joda.ZonedDateTime.parse("2021-03-17T15:00:00Z"),
        end: joda.ZonedDateTime.parse("2021-03-17T15:30:00Z"),
      },
      {
        start: joda.ZonedDateTime.parse("2021-03-17T17:00:00Z"),
        end: joda.ZonedDateTime.parse("2021-03-17T17:30:00Z"),
      },
    ]);
  });
});
