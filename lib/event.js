'use strict';


/**
 * @author Sebastian Pekarek
 * @module event
 * @constructor ICalEvent Event
 */
var ICalEvent = function(_data, calendar) {
    var attributes = ['id', 'uid', 'sequence', 'start', 'end', 'timezone', 'stamp', 'timestamp', 'allDay', 'floating', 'repeating', 'summary', 'location', 'description', 'htmlDescription', 'organizer', 'attendees', 'alarms', 'method', 'status', 'url'],
        vars,
        i,
        data;

    if(!calendar) {
        throw '`calendar` option required!';
    }

    vars = {
        allowedRepeatingFreq: ['SECONDLY', 'MINUTELY', 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'],
        allowedStatuses: ['CONFIRMED', 'TENTATIVE', 'CANCELLED']
    };

    data = {
        id: ('0000' + (Math.random() * Math.pow(36, 4) << 0).toString(36)).substr(-4),
        sequence: 0,
        start: null,
        end: null,
        timezone: undefined,
        stamp: new Date(),
        allDay: false,
        floating: false,
        repeating: null,
        summary: '',
        location: null,
        description: null,
        htmlDescription: null,
        organizer: null,
        attendees: [],
        alarms: [],
        status: null,
        url: null
    };

    /**
     * Set/Get the event's ID
     *
     * @param id ID
     * @since 0.2.0
     * @returns {ICalEvent|String}
     */
    this.id = function(id) {
        if(!id) {
            return data.id;
        }

        data.id = id;
        return this;
    };


    /**
     * Set/Get the event's ID
     *
     * @param id ID
     * @since 0.2.0
     * @alias id
     * @returns {ICalEvent|String}
     */
    this.uid = this.id;


    /**
     * Set/Get the event's SEQUENCE number
     *
     * @param {Number} sequence
     * @since 0.2.6
     * @returns {ICalEvent|Number}
     */
    this.sequence = function(sequence) {
        if(sequence === undefined) {
            return data.sequence;
        }

        var s = parseInt(sequence, 10);
        if(isNaN(s)) {
            throw '`sequence` must be a number!';
        }

        data.sequence = s;
        return this;
    };

    /**
     * Set/Get the event's start date
     *
     * @param {Date} start
     * @since 0.2.0
     * @returns {ICalEvent|Date}
     */
    this.start = function(start) {
        if(!start) {
            return data.start;
        }


        if(typeof start === 'string') {
            start = new Date(start);
        }
        if(!(start instanceof Date) || isNaN(start.getTime())) {
            throw '`start` must be a Date Object!';
        }
        data.start = start;

        if(data.start && data.end && data.start > data.end) {
            var t = data.start;
            data.start = data.end;
            data.end = t;
        }
        return this;
    };


    /**
     * Set/Get the event's end date
     *
     * @param {Date} end
     * @since 0.2.0
     * @returns {ICalEvent|Date}
     */
    this.end = function(end) {
        if(end === undefined) {
            return data.end;
        }

        if(!end) {
            data.end = null;
            return this;
        }
        if(typeof end === 'string') {
            end = new Date(end);
        }
        if(!(end instanceof Date) || isNaN(end.getTime())) {
            throw '`end` must be a Date Object!';
        }
        data.end = end;

        if(data.start && data.end && data.start > data.end) {
            var t = data.start;
            data.start = data.end;
            data.end = t;
        }
        return this;
    };


    /**
     * Set/Get the event's timezone.  This unsets the event's floating flag.
     * Used on date properties
     *
     * @param [timezone] Timezone
     * @example event.timezone('America/New_York');
     * @since 0.2.6
     * @returns {ICalEvent|String}
     */
    this.timezone = function(timezone) {
        if(timezone === undefined && data.timezone !== undefined) {
            return data.timezone;
        }
        if(timezone === undefined) {
            return calendar.timezone();
        }

        data.timezone = timezone ? timezone.toString() : null;
        if(data.timezone) {
            data.floating = false;
        }
        return this;
    };


    /**
     * Set/Get the event's timestamp
     *
     * @param {Date} stamp
     * @since 0.2.0
     * @returns {ICalEvent|Date}
     */
    this.stamp = function(stamp) {
        if(!stamp) {
            return data.stamp;
        }

        if(typeof stamp === 'string') {
            stamp = new Date(stamp);
        }
        if(!(stamp instanceof Date) || isNaN(stamp.getTime())) {
            throw '`stamp` must be a Date Object!';
        }
        data.stamp = stamp;
        return this;
    };


    /**
     * SetGet the event's timestamp
     *
     * @param {Date} stamp
     * @since 0.2.0
     * @alias stamp
     * @returns {ICalEvent|Date}
     */
    this.timestamp = this.stamp;


    /**
     * Set/Get the event's allDay flag
     *
     * @param {Boolean} allDay
     * @since 0.2.0
     * @returns {ICalEvent|Boolean}
     */
    this.allDay = function(allDay) {
        if(allDay === undefined) {
            return data.allDay;
        }

        data.allDay = !!allDay;
        return this;
    };


    /**
     * Set/Get the event's floating flag.  This unsets the event's timezone.
     * See https://tools.ietf.org/html/rfc5545#section-3.3.12
     *
     * @param {Boolean} floating
     * @since 0.2.0
     * @returns {ICalEvent|Boolean}
     */
    this.floating = function(floating) {
        if(floating === undefined) {
            return data.floating;
        }

        data.floating = !!floating;
        if(data.floating) {
            data.timezone = null;
        }
        return this;
    };


    /**
     * Set/Get the event's repeating stuff
     *
     * @param repeating
     * @since 0.2.0
     * @returns {ICalEvent|Object}
     */
    this.repeating = function(repeating) {
        if(repeating === undefined) {
            return data.repeating;
        }
        if(!repeating) {
            data.repeating = null;
            return this;
        }

        if(!repeating.freq || vars.allowedRepeatingFreq.indexOf(repeating.freq.toUpperCase()) === -1) {
            throw '`repeating.freq` is a mandatory item, and must be one of the following: ' + vars.allowedRepeatingFreq.join(', ') + '!';
        }
        data.repeating = {
            freq: repeating.freq.toUpperCase()
        };

        if(repeating.count) {
            if(!isFinite(repeating.count)) {
                throw '`repeating.count` must be a Number!';
            }

            data.repeating.count = repeating.count;
        }

        if(repeating.interval) {
            if(!isFinite(repeating.interval)) {
                throw '`repeating.interval` must be a Number!';
            }

            data.repeating.interval = repeating.interval;
        }

        if(repeating.until) {
            if(typeof repeating.until === 'string') {
                repeating.until = new Date(repeating.until);
            }
            if(!(repeating.until instanceof Date) || isNaN(repeating.until.getTime())) {
                throw '`repeating.until` must be a Date Object!';
            }

            data.repeating.until = repeating.until;
        }

        if(repeating.byDay) {
            if(!Array.isArray(repeating.byDay)) {
                repeating.byDay = [repeating.byDay];
            }

            data.repeating.byDay = [];
            repeating.byDay.forEach(function(symbol) {
                var s = symbol.toString().toUpperCase().match(/^(\d*||-\d+)(\w+)$/);
                if(['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].indexOf(s[2]) === -1) {
                    throw '`repeating.byDay` contains invalid value `' + s[2] + '`!';
                }

                data.repeating.byDay.push(s[1] + s[2]);
            });
        }

        if(repeating.byMonth) {
            if(!Array.isArray(repeating.byMonth)) {
                repeating.byMonth = [repeating.byMonth];
            }

            data.repeating.byMonth = [];
            repeating.byMonth.forEach(function(month) {
                if(typeof month !== 'number' || month < 1 || month > 12) {
                    throw '`repeating.byMonth` contains invalid value `' + month + '`!';
                }

                data.repeating.byMonth.push(month);
            });
        }

        if(repeating.byMonthDay) {
            if(!Array.isArray(repeating.byMonthDay)) {
                repeating.byMonthDay = [repeating.byMonthDay];
            }

            data.repeating.byMonthDay = [];
            repeating.byMonthDay.forEach(function(monthDay) {
                if(typeof monthDay !== 'number' || monthDay < 1 || monthDay > 31) {
                    throw '`repeating.byMonthDay` contains invalid value `' + monthDay + '`!';
                }

                data.repeating.byMonthDay.push(monthDay);
            });
        }

        if(repeating.exclude) {
            if(!Array.isArray(repeating.exclude)) {
                repeating.exclude = [repeating.exclude];
            }

            data.repeating.exclude = [];
            repeating.exclude.forEach(function(excludedDate) {
                var originalDate = excludedDate;
                if(typeof excludedDate === 'string') {
                    excludedDate = new Date(excludedDate);
                }

                if(Object.prototype.toString.call(excludedDate) !== '[object Date]' || isNaN(excludedDate.getTime())) {
                    throw '`repeating.exclude` contains invalid value `' + originalDate + '`!';
                }

                data.repeating.exclude.push(excludedDate);
            });
        }

        return this;
    };


    /**
     * Set/Get the event's summary
     *
     * @param {String} summary
     * @since 0.2.0
     * @returns {ICalEvent|String}
     */
    this.summary = function(summary) {
        if(summary === undefined) {
            return data.summary;
        }

        data.summary = summary ? summary.toString() : '';
        return this;
    };


    /**
     * Set/Get the event's location
     *
     * @param {String} location
     * @since 0.2.0
     * @returns {ICalEvent|String}
     */
    this.location = function(location) {
        if(location === undefined) {
            return data.location;
        }

        data.location = location ? location.toString() : null;
        return this;
    };


    /**
     * Set/Get the event's description
     *
     * @param {String} description
     * @since 0.2.0
     * @returns {ICalEvent|String}
     */
    this.description = function(description) {
        if(description === undefined) {
            return data.description;
        }

        data.description = description ? description.toString() : null;
        return this;
    };


    /**
     * Set/Get the event's HTML description
     *
     * @param {String} description
     * @since 0.2.8
     * @returns {ICalEvent|String}
     */
    this.htmlDescription = function(htmlDescription) {
        if(htmlDescription === undefined) {
            return data.htmlDescription;
        }

        data.htmlDescription = htmlDescription ? htmlDescription.toString() : null;
        return this;
    };


    /**
     * Set/Get the event's organizer
     *
     * @param {Object} organizer
     * @since 0.2.0
     * @returns {ICalEvent|String}
     */
    this.organizer = function(_organizer) {
        if(_organizer === undefined) {
            return data.organizer;
        }
        if(!_organizer) {
            data.organizer = null;
            return this;
        }

        var organizer = null,
            organizerRegEx = /^(.+) ?<([^>]+)>$/;

        if(typeof _organizer === 'string' && organizerRegEx.test(_organizer)) {
            organizer = {
                name: RegExp.$1.trim(),
                email: RegExp.$2
            };
        }
        else if(typeof _organizer === 'object') {
            organizer = {
                name: _organizer.name,
                email: _organizer.email
            };
        }
        else if(typeof _organizer === 'string') {
            throw '`organizer` isn\'t formated correctly. See https://github.com/sebbo2002/ical-generator#organizerstringobject-organizer';
        }
        else {
            throw '`organizer` needs to be a valid formed string or an object. See https://github.com/sebbo2002/ical-generator#organizerstringobject-organizer';
        }

        if(!organizer.name) {
            throw '`organizer.name` is empty!';
        }
        if(!organizer.email) {
            throw '`organizer.email` is empty!';
        }

        data.organizer = {
            name: organizer.name,
            email: organizer.email
        };
        return this;
    };


    /**
     * Create a new Attendee and return the attendee object…
     *
     * @param [attendeeData] Attendee-Options
     * @since 0.2.0
     * @returns {ICalAttendee}
     */
    this.createAttendee = function(_attendeeData) {
        var ICalAttendee = require('./attendee.js'),
            attendeeRegEx = /^(.+) ?<([^>]+)>$/,
            attendee;

        if(typeof _attendeeData === 'string' && attendeeRegEx.test(_attendeeData)) {
            attendee = new ICalAttendee({
                name: RegExp.$1.trim(),
                email: RegExp.$2
            }, this);

            data.attendees.push(attendee);
            return attendee;
        }
        if(typeof _attendeeData === 'string') {
            throw '`attendee` isn\'t formated correctly. See https://github.com/sebbo2002/ical-generator#createattendeeobject-options';
        }

        attendee = new ICalAttendee(_attendeeData, this);
        data.attendees.push(attendee);
        return attendee;
    };


    /**
     * Get all attendees or add attendees…
     *
     * @since 0.2.0
     * @returns {ICalAttendees[]|ICalEvent}
     */
    this.attendees = function(attendees) {
        if(!attendees) {
            return data.attendees;
        }

        var cal = this;
        attendees.forEach(function(e) {
            cal.createAttendee(e);
        });
        return cal;
    };


    /**
     * Create a new Alarm and return the alarm object…
     *
     * @param [alarmData] Alarm-Options
     * @since 0.2.1
     * @returns {ICalAlarm}
     */
    this.createAlarm = function(alarmData) {
        var ICalAlarm = require('./alarm.js'),
            alarm = new ICalAlarm(alarmData, this);

        data.alarms.push(alarm);
        return alarm;
    };


    /**
     * Get all alarms or add alarms…
     *
     * @since 0.2.0
     * @returns {ICalAlarms[]|ICalEvent}
     */
    this.alarms = function(alarms) {
        if(!alarms) {
            return data.alarms;
        }

        var cal = this;
        alarms.forEach(function(e) {
            cal.createAlarm(e);
        });
        return cal;
    };


    /**
     * Set/Get your feed's method
     *
     * @param {String} method
     * @since 0.2.0
     * @deprecated since 0.2.8
     * @returns {ICalEvent|String}
     */
    this.method = function(method) {
        if(method === undefined) {
            return calendar.method();
        }
        if(!method) {
            calendar.method(null);
            return this;
        }

        calendar.method(method);
        return this;
    };


    /**
     * Set/Get the event's status
     *
     * @param {String} status
     * @since 0.2.0
     * @returns {ICalEvent|String}
     */
    this.status = function(status) {
        if(status === undefined) {
            return data.status;
        }
        if(!status) {
            data.status = null;
            return this;
        }

        // https://github.com/sebbo2002/ical-generator/issues/45
        if(status === 'TENATIVE') {
            status = 'TENTATIVE';
        }
        if(vars.allowedStatuses.indexOf(status.toUpperCase()) === -1) {
            throw '`status` must be one of the following: ' + vars.allowedStatuses.join(', ') + '!';
        }

        data.status = status.toUpperCase();
        return this;
    };


    /**
     * Set/Get the event's URL
     *
     * @param {String} url URL
     * @since 0.2.0
     * @returns {ICalEvent|String}
     */
    this.url = function(url) {
        if(url === undefined) {
            return data.url;
        }

        data.url = url ? url.toString() : null;
        return this;
    };


    /**
     * Export calender as JSON Object to use it later…
     *
     * @since 0.2.4
     * @returns Object Calendar
     */
    this.toJSON = function() {
        var tools = require('./_tools.js');
        return tools.toJSON(this, attributes);
    };


    /**
     * Export Event to iCal
     *
     * @param {ICalCalendar}
     * @since 0.2.0
     * @returns {String}
     */
    this.generate = function(calendar) {
        var tools = require('./_tools.js'),
            g = '';

        if(!calendar) {
            throw '`calendar` option required!';
        }
        if(!data.start) {
            throw 'No value for `start` in ICalEvent #' + data.id + ' given!';
        }
        if(data.timezone) {
            data.floating = false;
        }

        // DATE & TIME
        g += 'BEGIN:VEVENT\r\n';
        g += 'UID:' + data.id + '@' + calendar.domain() + '\r\n';

        // SEQUENCE
        g += 'SEQUENCE:' + data.sequence + '\r\n';

        g += 'DTSTAMP:' + tools.formatDate(data.stamp) + '\r\n';
        if(data.allDay) {
            g += 'DTSTART;VALUE=DATE:' + tools.formatDate(data.start, true) + '\r\n';
            if(data.end) {
                g += 'DTEND;VALUE=DATE:' + tools.formatDate(data.end, true) + '\r\n';
            }

            g += 'X-MICROSOFT-CDO-ALLDAYEVENT:TRUE\r\n';
            g += 'X-MICROSOFT-MSNCALENDAR-ALLDAYEVENT:TRUE\r\n';
        } else {
            g += tools.formatDateTZ('DTSTART', data.start, data) + '\r\n';
            if(data.end) {
                g += tools.formatDateTZ('DTEND', data.end, data) + '\r\n';
            }
        }

        // REPEATING
        if(data.repeating) {
            g += 'RRULE:FREQ=' + data.repeating.freq;

            if(data.repeating.count) {
                g += ';COUNT=' + data.repeating.count;
            }

            if(data.repeating.interval) {
                g += ';INTERVAL=' + data.repeating.interval;
            }

            if(data.repeating.until) {
                g += ';UNTIL=' + tools.formatDate(data.repeating.until);
            }

            if(data.repeating.byDay) {
                g += ';BYDAY=' + data.repeating.byDay.join(',');
            }

            if(data.repeating.byMonth) {
                g += ';BYMONTH=' + data.repeating.byMonth.join(',');
            }

            if(data.repeating.byMonthDay) {
                g += ';BYMONTHDAY=' + data.repeating.byMonthDay.join(',');
            }

            g += '\r\n';

            // REPEATING EXCLUSION
            if(data.repeating.exclude) {
                g += 'EXDATE:';
                var sArr = [];
                data.repeating.exclude.forEach(function(excludedDate) {
                    sArr.push(tools.formatDate(excludedDate));
                });
                g += sArr.join(',');

                g += '\r\n';
            }
        }

        // SUMMARY
        g += 'SUMMARY:' + tools.escape(data.summary) + '\r\n';

        // LOCATION
        if(data.location) {
            g += 'LOCATION:' + tools.escape(data.location) + '\r\n';
        }

        // DESCRIPTION
        if(data.description) {
            g += 'DESCRIPTION:' + tools.escape(data.description) + '\r\n';
        }

        // HTML DESCRIPTION
        if(data.htmlDescription) {
            g += 'X-ALT-DESC;FMTTYPE=text/html:' + tools.escape(data.htmlDescription) + '\r\n';
        }

        // ORGANIZER
        if(data.organizer) {
            g += 'ORGANIZER;CN="' + tools.escape(data.organizer.name) + '":mailto:' + tools.escape(data.organizer.email) + '\r\n';
        }

        // ATTENDEES
        data.attendees.forEach(function(attendee) {
            g += attendee.generate();
        });

        // ALARMS
        data.alarms.forEach(function(alarm) {
            g += alarm.generate();
        });

        // URL
        if(data.url) {
            g += 'URL;VALUE=URI:' + tools.escape(data.url) + '\r\n';
        }

        // STATUS
        if(data.status) {
            g += 'STATUS:' + data.status.toUpperCase() + '\r\n';
        }

        g += 'END:VEVENT\r\n';
        return g;
    };


    for(i in _data) {
        if(_data.hasOwnProperty(i) && attributes.indexOf(i) > -1) {
            this[i](_data[i]);
        }
    }
};

module.exports = ICalEvent;
