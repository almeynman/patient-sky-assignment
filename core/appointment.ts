import * as joda from "@js-joda/core";
import * as timeInterval from "../lib/timeInterval";

export type Appointment = timeInterval.TimeInterval & {
  id: string;
};
