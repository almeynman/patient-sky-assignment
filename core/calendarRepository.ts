import * as appointment from "./appointment";
import * as db from "./db";
import * as timeInterval from "../lib/timeInterval";
import * as datetime from "../lib/datetime";

export const getAppointmentsByCalendarId = (
  calendarId: string,
  periodToSearch?: timeInterval.TimeInterval
): appointment.Appointment[] => {
  const allAppointments = db.calendars()[calendarId].appointments.map((a) => ({
    ...a,
    start: datetime.parseDateTime(a.start),
    end: datetime.parseDateTime(a.end),
  }));
  if (!periodToSearch) {
    return allAppointments;
  }

  const appointments = allAppointments.filter(
    ({ start, end }) =>
      start.isAfter(periodToSearch.start) && end.isBefore(periodToSearch.end)
  );
  return appointments;
};
