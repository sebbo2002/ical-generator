'use strict';


/**
 * @author Sebastian Pekarek
 * @module event
 * @constructor ICalEvent Event
 */
var ICalEvent = function(_data) {
    var attributes = ['id', 'uid', 'start', 'end', 'stamp', 'timestamp', 'allDay', 'floating', 'repeating', 'summary', 'location', 'description', 'organizer', 'attendees', 'alarms', 'method', 'status', 'url'],
        vars,
        i,
        data;

    vars = {
        allowedMethods: ['PUBLISH', 'REQUEST', 'REPLY', 'ADD', 'CANCEL', 'REFRESH', 'COUNTER', 'DECLINECOUNTER'],
        allowedRepeatingFreq: ['SECONDLY', 'MINUTELY', 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'],
        allowedStatuses: ['CONFIRMED', 'TENATIVE', 'CANCELLED']
    };

    data = {
        id: ('0000' + (Math.random() * Math.pow(36, 4) << 0).toString(36)).substr(-4),
        start: null,
        end: null,
        stamp: new Date(),
        allDay: false,
        floating: false,
        repeating: null,
        summary: '',
        location: null,
        description: null,
        organizer: null,
        attendees: [],
        alarms: [],
        method: null,
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
        if(!(start instanceof Date) || !start.getTime()) {
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
        if(!end) {
            return data.end;
        }

        if(typeof end === 'string') {
            end = new Date(end);
        }
        if(!(end instanceof Date) || !end.getTime()) {
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
        if(!(stamp instanceof Date) || !stamp.getTime()) {
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
        if(!allDay) {
            return data.allDay;
        }

        data.allDay = !!allDay;
        return this;
    };


    /**
     * Set/Get the event's floating flag
     * See https://tools.ietf.org/html/rfc5545#section-3.3.12
     *
     * @param {Boolean} floating
     * @since 0.2.0
     * @returns {ICalEvent|Boolean}
     */
    this.floating = function(floating) {
        if(!floating) {
            return data.floating;
        }

        data.floating = !!floating;
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
        if(!repeating) {
            return data.repeating;
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
            if(!(repeating.until instanceof Date) || !repeating.until.getTime()) {
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
                var s = symbol.toString().toUpperCase();
                if(['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].indexOf(s) === -1) {
                    throw '`repeating.byDay` contains invalid value `' + s + '`!';
                }

                data.repeating.byDay.push(s);
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
        if(!summary) {
            return data.summary;
        }

        data.summary = summary.toString();
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
        if(!location) {
            return data.location;
        }

        data.location = location.toString();
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
        if(!description) {
            return data.description;
        }

        data.description = description.toString();
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
        if(!_organizer) {
            return data.organizer;
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
     * Set/Get the event's method
     *
     * @param {String} method
     * @since 0.2.0
     * @returns {ICalEvent|String}
     */
    this.method = function(method) {
        if(!method) {
            return data.method;
        }

        if(vars.allowedMethods.indexOf(method.toUpperCase()) === -1) {
            throw '`method` must be one of the following: ' + vars.allowedMethods.join(', ') + '!';
        }

        data.method = method.toUpperCase();
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
        if(!status) {
            return data.status;
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
        if(!url) {
            return data.url;
        }

        data.url = url.toString();
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
        if(!data.end) {
            throw 'No value for `end` in ICalEvent #' + data.id + ' given!';
        }

        // DATE & TIME
        g += 'BEGIN:VEVENT\r\n';
        g += 'UID:' + tools.formatDate(data.start) + '-' + data.id + '@' + calendar.domain() + '\r\n';
        g += 'DTSTAMP:' + tools.formatDate(data.stamp) + '\r\n';
        if(data.allDay) {
            g += 'DTSTART;VALUE=DATE:' + tools.formatDate(data.start, true) + '\r\n';
            g += 'DTEND;VALUE=DATE:' + tools.formatDate(data.end, true) + '\r\n';
        } else {
            g += 'DTSTART:' + tools.formatDate(data.start, false, data.floating) + '\r\n';
            g += 'DTEND:' + tools.formatDate(data.end, false, data.floating) + '\r\n';
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

        // METHOD & STATUS
        if(data.method) {
            g += 'METHOD:' + data.method.toUpperCase() + '\r\n';
        }
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
