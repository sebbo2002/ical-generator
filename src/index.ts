/**
 * iCal Generator Entrypoint
 */

'use strict';

import ICalCalendar, {ICalCalendarData} from './calendar';


export default function (data?: ICalCalendarData): ICalCalendar {
    return new ICalCalendar(data);
}
