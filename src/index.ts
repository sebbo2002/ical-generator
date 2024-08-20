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
    ICalAlarmRelatesTo,
    ICalAlarmType,
    default as ICalAlarm,
    type ICalAlarmBaseData,
    type ICalAlarmData,
    type ICalAlarmJSONData,
    type ICalAlarmRepeatData,
    type ICalAlarmTriggerAfterData,
    type ICalAlarmTriggerBeforeData,
    type ICalAlarmTriggerData,
    type ICalAlarmTypeValue,
    type ICalAttachment
} from './alarm.ts';

export {
    ICalAttendeeRole,
    ICalAttendeeStatus,
    ICalAttendeeType,
    default as ICalAttendee,
    type ICalAttendeeData,
    type ICalAttendeeJSONData
} from './attendee.ts';

export {
    ICalCalendarMethod,
    default as ICalCalendar,
    type ICalCalendarData,
    type ICalCalendarJSONData,
    type ICalCalendarProdIdData
} from './calendar.ts';

export {
    default as ICalCategory,
    type ICalCategoryData,
    type ICalCategoryJSONData
} from './category.ts';

export {
    ICalEventBusyStatus,
    ICalEventClass,
    ICalEventStatus,
    ICalEventTransparency,
    default as ICalEvent,
    type ICalEventData,
    type ICalEventJSONData,
    type ICalEventJSONRepeatingData
} from './event.ts';

export {
    ICalEventRepeatingFreq,
    ICalWeekday,
    type ICalDateTimeValue,
    type ICalDayJsStub,
    type ICalDescription,
    type ICalGeo,
    type ICalLocation,
    type ICalLocationWithTitle,
    type ICalLocationWithoutTitle,
    type ICalLuxonDateTimeStub,
    type ICalMomentDurationStub,
    type ICalMomentStub,
    type ICalMomentTimezoneStub,
    type ICalOrganizer,
    type ICalRRuleStub,
    type ICalRepeatingOptions,
    type ICalTimezone,
} from './types.ts';

export {
    escape,
    foldLines,
    formatDate,
    formatDateTZ
} from './tools.ts';
