/**
 * ical-generator entrypoint
 */

'use strict';

import ICalCalendar, {ICalCalendarData} from './calendar.js';


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
    ICalAlarmType,
    ICalAlarmTypeValue,
    ICalAlarmJSONData,
    ICalAttachment
} from './alarm.js';

export {
    default as ICalAttendee,
    ICalAttendeeData,
    ICalAttendeeType,
    ICalAttendeeRole,
    ICalAttendeeStatus,
    ICalAttendeeJSONData
} from './attendee.js';

export {
    default as ICalCalendar,
    ICalCalendarData,
    ICalCalendarProdIdData,
    ICalCalendarMethod,
    ICalCalendarJSONData
} from './calendar.js';

export {
    default as ICalCategory,
    ICalCategoryData
} from './category.js';

export {
    default as ICalEvent,
    ICalEventStatus,
    ICalEventBusyStatus,
    ICalEventTransparency,
    ICalEventData,
    ICalEventJSONData,
    ICalEventClass,
} from './event.js';

export {
    ICalDateTimeValue,
    ICalRepeatingOptions,
    ICalLocation,
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
} from './types.js';

export {
    formatDate,
    formatDateTZ,
    escape,
    foldLines
} from './tools.js';
