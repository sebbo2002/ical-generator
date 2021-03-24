/**
 * ical-generator entrypoint
 */

'use strict';

import ICalCalendar, {ICalCalendarData, ICalCalendarMethod, ICalCalendarProdIdData} from './calendar';


/**
 * Create a new, empty calendar and returns it.
 *
 * ```javascript
 * const ical = require('ical-generator');
 * const cal = ical();
 * ```
 *
 * You can pass options to setup your calendar or use setters to do this.
 *
 * ```javascript
 * const ical = require('ical-generator');
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
export default function (data?: ICalCalendarData): ICalCalendar {
    return new ICalCalendar(data);
}

export {
    default as ICalCalendar,
    ICalCalendarData,
    ICalCalendarProdIdData,
    ICalCalendarMethod
} from './calendar';

export {
    default as ICalEvent,
    ICalEventData
} from './event';

export {
    checkDate,
    formatDate
} from './tools';
