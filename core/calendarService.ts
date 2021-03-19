import * as joda from "@js-joda/core";
import * as timeInterval from "../lib/timeInterval";
import * as calendarRepository from "./calendarRepository";

export const findAvailableTimes = (
  calendarIds: string[],
  duration: joda.Duration,
  periodToSearch: timeInterval.TimeInterval
): timeInterval.TimeInterval[] => {
  let appointments = [];
  for (const id of calendarIds) {
    const appointmentsForId = calendarRepository.getAppointmentsByCalendarId(
      id,
      periodToSearch
    );
    appointments.push(...appointmentsForId);
  }
  const availableSlots = timeInterval.minusMultiple(
    periodToSearch,
    appointments
  );
  const availableSlotsThatFitDuration = availableSlots.filter(
    (s) => timeInterval.duration(s).compareTo(duration) >= 0
  );

  let timeIntervals = [];
  for (const slot of availableSlotsThatFitDuration) {
    const availableTimes = timeInterval.slice(slot, duration);
    timeIntervals.push(...availableTimes);
  }
  return timeIntervals;
};
