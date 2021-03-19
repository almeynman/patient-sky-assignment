import * as joda from "@js-joda/core";
import * as timeInterval from "../lib/timeInterval";
import * as calendarRepository from "./calendarRepository";
import { logger } from "../logger";

export const findAvailableTimes = (
  calendarIds: string[],
  duration: joda.Duration,
  periodToSearch: timeInterval.TimeInterval
): timeInterval.TimeInterval[] => {
  let appointments = [];
  for (const id of calendarIds) {
    logger.trace("id start", id);
    const appointmentsForId = calendarRepository.getAppointmentsByCalendarId(
      id,
      periodToSearch
    );
    logger.trace("appointmentsForId", appointmentsForId);
    appointments.push(...appointmentsForId);
    logger.trace("id end", id);
  }
  logger.trace("appointments", appointments);
  const availableSlots = timeInterval.minusMultiple(
    periodToSearch,
    appointments
  );
  logger.trace("availableSlots", availableSlots);
  const availableSlotsThatFitDuration = availableSlots.filter(
    (s) => timeInterval.duration(s).compareTo(duration) >= 0
  );
  logger.trace("availableSlotsThatFitDuration", availableSlotsThatFitDuration);

  let timeIntervals = [];
  for (const slot of availableSlotsThatFitDuration) {
    logger.trace("slot start", slot);
    const availableTimes = timeInterval.slice(slot, duration);
    logger.trace("availableTimes", availableTimes);
    timeIntervals.push(...availableTimes);
    logger.trace("slot end");
  }
  return timeIntervals;
};
