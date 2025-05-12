/**
 * ical-generator entrypoint
 */

'use strict';

import ICalCalendar, { type ICalCalendarData } from './calendar.ts';

/**
 * Create a new, empty calendar and returns it.
 *
 * ```javascript
 * import ical from 'ical-generator';
 *
 * // or use require:
 * // const { default: ical } = require('ical-generator');
 *
 * const cal = ical();
 * ```
 *
 * You can pass options to setup your calendar or use setters to do this.
 *
 * ```javascript
 * import ical from 'ical-generator';
 *
 * // or use require:
 * // const { default: ical } = require('ical-generator');
 * const cal = ical({domain: 'sebbo.net'});
 *
 * // is the same as
 *
 * const cal = ical().domain('sebbo.net');
 *
 * // is the same as
 *
 * const cal = ical();
 * cal.domain('sebbo.net');
 * ```
 *
 * @param data Calendar data
 */
function ical(data?: ICalCalendarData): ICalCalendar {
    return new ICalCalendar(data);
}

export default ical;

export {
    default as ICalAlarm,
    type ICalAlarmBaseData,
    type ICalAlarmData,
    type ICalAlarmJSONData,
    ICalAlarmRelatesTo,
    type ICalAlarmRepeatData,
    type ICalAlarmTriggerAfterData,
    type ICalAlarmTriggerBeforeData,
    type ICalAlarmTriggerData,
    ICalAlarmType,
    type ICalAlarmTypeValue,
    type ICalAttachment,
} from './alarm.ts';

export {
    default as ICalAttendee,
    type ICalAttendeeData,
    type ICalAttendeeJSONData,
    ICalAttendeeRole,
    type ICalAttendeeScheduleAgent,
    ICalAttendeeStatus,
    ICalAttendeeType,
} from './attendee.ts';

export {
    default as ICalCalendar,
    type ICalCalendarData,
    type ICalCalendarJSONData,
    ICalCalendarMethod,
    type ICalCalendarProdIdData,
} from './calendar.ts';

export {
    default as ICalCategory,
    type ICalCategoryData,
    type ICalCategoryJSONData,
} from './category.ts';

export {
    default as ICalEvent,
    ICalEventBusyStatus,
    ICalEventClass,
    type ICalEventData,
    type ICalEventJSONData,
    type ICalEventJSONRepeatingData,
    ICalEventStatus,
    ICalEventTransparency,
} from './event.ts';

export { escape, foldLines, formatDate, formatDateTZ } from './tools.ts';

export {
    type ICalDateTimeValue,
    type ICalDayJsStub,
    type ICalDescription,
    ICalEventRepeatingFreq,
    type ICalGeo,
    type ICalLocation,
    type ICalLocationWithoutTitle,
    type ICalLocationWithTitle,
    type ICalLuxonDateTimeStub,
    type ICalMomentDurationStub,
    type ICalMomentStub,
    type ICalMomentTimezoneStub,
    type ICalOrganizer,
    type ICalRepeatingOptions,
    type ICalRRuleStub,
    type ICalTimezone,
    type ICalTZDateStub,
    ICalWeekday,
} from './types.ts';
