/**
 * ical-generator entrypoint
 */

'use strict';

import ICalCalendar, {ICalCalendarData} from './calendar.ts';


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
    ICalAlarmData,
    ICalAlarmBaseData,
    ICalAlarmJSONData,
    ICalAlarmRelatesTo,
    ICalAlarmRepeatData,
    ICalAlarmTriggerData,
    ICalAlarmTriggerAfterData,
    ICalAlarmTriggerBeforeData,
    ICalAlarmType,
    ICalAlarmTypeValue,
    ICalAttachment,
} from './alarm.ts';

export {
    default as ICalAttendee,
    ICalAttendeeData,
    ICalAttendeeType,
    ICalAttendeeRole,
    ICalAttendeeStatus,
    ICalAttendeeJSONData
} from './attendee.ts';

export {
    default as ICalCalendar,
    ICalCalendarData,
    ICalCalendarProdIdData,
    ICalCalendarMethod,
    ICalCalendarJSONData
} from './calendar.ts';

export {
    default as ICalCategory,
    ICalCategoryData,
    ICalCategoryJSONData
} from './category.ts';

export {
    default as ICalEvent,
    ICalEventStatus,
    ICalEventBusyStatus,
    ICalEventTransparency,
    ICalEventData,
    ICalEventJSONData,
    ICalEventJSONRepeatingData,
    ICalEventClass,
} from './event.ts';

export {
    ICalDateTimeValue,
    ICalRepeatingOptions,
    ICalLocation,
    ICalLocationWithTitle,
    ICalLocationWithoutTitle,
    ICalGeo,
    ICalOrganizer,
    ICalDescription,
    ICalEventRepeatingFreq,
    ICalWeekday,
    ICalTimezone,
    ICalMomentStub,
    ICalMomentTimezoneStub,
    ICalMomentDurationStub,
    ICalLuxonDateTimeStub,
    ICalDayJsStub,
    ICalRRuleStub
} from './types.ts';

export {
    formatDate,
    formatDateTZ,
    escape,
    foldLines
} from './tools.ts';
