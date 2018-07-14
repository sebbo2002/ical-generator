'use strict';


const moment = require('moment-timezone');
const ICalTools = require('./_tools');
const ICalAttendee = require('./attendee');
const ICalAlarm = require('./alarm');
const ICalCategory = require('./category');


/**
 * @author Sebastian Pekarek
 * @class ICalEvent
 */
class ICalEvent {
    constructor(data, _calendar) {
        this._data = {
            id: ('0000' + (Math.random() * Math.pow(36, 4) << 0).toString(36)).substr(-4),
            sequence: 0,
            start: null,
            end: null,
            timezone: undefined,
            stamp: moment(),
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
            categories: [],
            status: null,
            url: null,
            created: null,
            lastModified: null
        };
        this._attributes = [
            'id',
            'uid',
            'sequence',
            'start',
            'end',
            'timezone',
            'stamp',
            'timestamp',
            'allDay',
            'floating',
            'repeating',
            'summary',
            'location',
            'description',
            'htmlDescription',
            'organizer',
            'attendees',
            'alarms',
            'categories',
            'status',
            'url',
            'created',
            'lastModified'
        ];
        this._vars = {
            allowedRepeatingFreq: ['SECONDLY', 'MINUTELY', 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'],
            allowedStatuses: ['CONFIRMED', 'TENTATIVE', 'CANCELLED']
        };

        this._calendar = _calendar;
        if (!_calendar) {
            throw new Error('`calendar` option required!');
        }

        if (typeof data === 'string') {
            this._data = JSON.parse(data);
        }

        for (let i in data) {
            if (this._attributes.indexOf(i) > -1) {
                this[i](data[i]);
            }
        }
    }

    /**
     * Set/Get the event's ID
     *
     * @param id ID
     * @since 0.2.0
     * @param {string} [id]
     * @returns {ICalEvent|String}
     */
    id(id) {
        if (!id) {
            return this._data.id;
        }

        this._data.id = id;
        return this;
    }

    /**
     * Set/Get the event's ID
     *
     * @param id ID
     * @since 0.2.0
     * @alias id
     * @param {string} [id]
     * @returns {ICalEvent|String}
     */
    uid(id) {
        return this.id(id);
    }

    /**
     * Set/Get the event's SEQUENCE number
     *
     * @param {Number} sequence
     * @since 0.2.6
     * @returns {ICalEvent|Number}
     */
    sequence(sequence) {
        if (sequence === undefined) {
            return this._data.sequence;
        }

        const s = parseInt(sequence, 10);
        if (isNaN(s)) {
            throw new Error('`sequence` must be a number!');
        }

        this._data.sequence = s;
        return this;
    }

    /**
     * Set/Get the event's start date
     *
     * @since 0.2.0
     * @param {Date|moment|String} [start] Start date as moment.js object
     * @returns {ICalEvent|Date}
     */
    start(start) {
        if (start === undefined) {
            return this._data.start;
        }


        if (typeof start === 'string') {
            start = moment(start).utc();
        }
        else if (start instanceof Date) {
            start = moment(start).utc();
        }
        else if (!(start instanceof moment)) {
            throw new Error('`start` must be a Date or a moment object!');
        }

        if (!start.isValid()) {
            throw new Error('`start` has to be a valid date!');
        }
        this._data.start = start;

        if (this._data.start && this._data.end && this._data.start.isAfter(this._data.end)) {
            const t = this._data.start;
            this._data.start = this._data.end;
            this._data.end = t;
        }

        return this;
    }

    /**
     * Set/Get the event's end date
     *
     * @since 0.2.0
     * @param {Date|moment|String|null} [end] End date as moment.js object
     * @returns {ICalEvent|Date}
     */
    end(end) {
        if (end === undefined) {
            return this._data.end;
        }

        if (end === null) {
            this._data.end = null;
            return this;
        }

        if (typeof end === 'string') {
            end = moment(end);
        }
        else if (end instanceof Date) {
            end = moment(end);
        }
        else if (!(end instanceof moment)) {
            throw new Error('`end` must be a Date or a moment object!');
        }

        if (!end.isValid()) {
            throw new Error('`end` has to be a valid date!');
        }
        this._data.end = end;

        if (this._data.start && this._data.end && this._data.start.isAfter(this._data.end)) {
            const t = this._data.start;
            this._data.start = this._data.end;
            this._data.end = t;
        }

        return this;
    }

    /**
     * Set/Get the event's timezone.  This unsets the event's floating flag.
     * Used on date properties
     *
     * @param {string} [timezone] Timezone
     * @example event.timezone('America/New_York');
     * @since 0.2.6
     * @returns {ICalEvent|String}
     */
    timezone(timezone) {
        if (timezone === undefined && this._data.timezone !== undefined) {
            return this._data.timezone;
        }
        if (timezone === undefined) {
            return this._calendar._data.timezone;
        }

        this._data.timezone = timezone ? timezone.toString() : null;
        if (this._data.timezone) {
            this._data.floating = false;
        }

        return this;
    }

    /**
     * Set/Get the event's timestamp
     *
     * @param {Date|moment|String} [stamp]
     * @since 0.2.0
     * @returns {ICalEvent|moment}
     */
    stamp(stamp) {
        if (stamp === undefined) {
            return this._data.stamp;
        }

        if (typeof stamp === 'string') {
            stamp = moment(stamp);
        }
        else if (stamp instanceof Date) {
            stamp = moment(stamp);
        }
        else if (!(stamp instanceof moment)) {
            throw new Error('`stamp` must be a Date or a moment object!');
        }

        if (!stamp.isValid()) {
            throw new Error('`stamp` has to be a valid date!');
        }

        this._data.stamp = stamp;
        return this;
    }

    /**
     * Set/Get the event's timestamp
     *
     * @param {Date|moment|String} [stamp]
     * @since 0.2.0
     * @alias stamp
     * @returns {ICalEvent|moment}
     */
    timestamp(stamp) {
        return this.stamp(stamp);
    }

    /**
     * Set/Get the event's allDay flag
     *
     * @param {Boolean} [allDay]
     * @since 0.2.0
     * @returns {ICalEvent|Boolean}
     */
    allDay(allDay) {
        if (allDay === undefined) {
            return this._data.allDay;
        }

        this._data.allDay = !!allDay;
        return this;
    }

    /**
     * Set/Get the event's floating flag.  This unsets the event's timezone.
     * See https://tools.ietf.org/html/rfc5545#section-3.3.12
     *
     * @param {Boolean} floating
     * @since 0.2.0
     * @returns {ICalEvent|Boolean}
     */
    floating(floating) {
        if (floating === undefined) {
            return this._data.floating;
        }

        this._data.floating = !!floating;
        if (this._data.floating) {
            this._data.timezone = null;
        }
        return this;
    }

    /**
     * Set/Get the event's repeating stuff
     *
     * @param {object} [repeating]
     * @param {String} [repeating.freq]
     * @param {Number} [repeating.count]
     * @param {Number} [repeating.interval]
     * @param {Date|moment|String} [repeating.until]
     * @param {String} [repeating.byDay]
     * @param {Number} [repeating.byMonth]
     * @param {Number} [repeating.byMonthDay]
     * @param {Array<Date|moment|String>} [repeating.excluded]
     * @since 0.2.0
     * @returns {ICalEvent|Object}
     */
    repeating(repeating) {
        const c = this;

        if (repeating === undefined) {
            return c._data.repeating;
        }
        if (!repeating) {
            c._data.repeating = null;
            return c;
        }

        if (!repeating.freq || c._vars.allowedRepeatingFreq.indexOf(repeating.freq.toUpperCase()) === -1) {
            throw new Error(
                '`repeating.freq` is a mandatory item, and must be one of the following: ' +
                c._vars.allowedRepeatingFreq.join(', ') + '!'
            );
        }
        c._data.repeating = {
            freq: repeating.freq.toUpperCase()
        };

        if (repeating.count) {
            if (!isFinite(repeating.count)) {
                throw new Error('`repeating.count` must be a Number!');
            }

            c._data.repeating.count = repeating.count;
        }

        if (repeating.interval) {
            if (!isFinite(repeating.interval)) {
                throw new Error('`repeating.interval` must be a Number!');
            }

            c._data.repeating.interval = repeating.interval;
        }

        if (repeating.until !== undefined) {
            if (typeof repeating.until === 'string') {
                repeating.until = moment(repeating.until);
            }
            else if (repeating.until instanceof Date) {
                repeating.until = moment(repeating.until);
            }
            else if (!(repeating.until instanceof moment)) {
                throw new Error('`repeating.until` must be a Date or a moment object!');
            }

            if (!repeating.until.isValid()) {
                throw new Error('`repeating.until` has to be a valid date!');
            }

            c._data.repeating.until = repeating.until;
        }

        if (repeating.byDay) {
            if (!Array.isArray(repeating.byDay)) {
                repeating.byDay = [repeating.byDay];
            }

            c._data.repeating.byDay = [];
            repeating.byDay.forEach(function (symbol) {
                const s = symbol.toString().toUpperCase().match(/^(\d*||-\d+)(\w+)$/);
                if (['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].indexOf(s[2]) === -1) {
                    throw new Error('`repeating.byDay` contains invalid value `' + s[2] + '`!');
                }

                c._data.repeating.byDay.push(s[1] + s[2]);
            });
        }

        if (repeating.byMonth) {
            if (!Array.isArray(repeating.byMonth)) {
                repeating.byMonth = [repeating.byMonth];
            }

            c._data.repeating.byMonth = [];
            repeating.byMonth.forEach(function (month) {
                if (typeof month !== 'number' || month < 1 || month > 12) {
                    throw new Error('`repeating.byMonth` contains invalid value `' + month + '`!');
                }

                c._data.repeating.byMonth.push(month);
            });
        }

        if (repeating.byMonthDay) {
            if (!Array.isArray(repeating.byMonthDay)) {
                repeating.byMonthDay = [repeating.byMonthDay];
            }

            c._data.repeating.byMonthDay = [];
            repeating.byMonthDay.forEach(function (monthDay) {
                if (typeof monthDay !== 'number' || monthDay < 1 || monthDay > 31) {
                    throw new Error('`repeating.byMonthDay` contains invalid value `' + monthDay + '`!');
                }

                c._data.repeating.byMonthDay.push(monthDay);
            });
        }

        if (repeating.exclude) {
            if (!Array.isArray(repeating.exclude)) {
                repeating.exclude = [repeating.exclude];
            }

            c._data.repeating.exclude = [];
            repeating.exclude.forEach(function (excludedDate, i) {
                if (typeof excludedDate === 'string') {
                    excludedDate = moment(excludedDate);
                }
                else if (excludedDate instanceof Date) {
                    excludedDate = moment(excludedDate);
                }
                else if (!(excludedDate instanceof moment)) {
                    throw new Error('`repeating.exclude[' + i + ']` must be a Date or a moment object!');
                }

                if (!excludedDate.isValid()) {
                    throw new Error('`repeating.exclude[' + i + ']` has to be a valid date!');
                }

                c._data.repeating.exclude.push(excludedDate);
            });
        }

        return c;
    }

    /**
     * Set/Get the event's summary
     *
     * @param {String} [summary]
     * @since 0.2.0
     * @returns {ICalEvent|String}
     */
    summary(summary) {
        if (summary === undefined) {
            return this._data.summary;
        }

        this._data.summary = summary ? summary.toString() : '';
        return this;
    }


    /**
     * Set/Get the event's location
     *
     * @param {String} [location]
     * @since 0.2.0
     * @returns {ICalEvent|String}
     */
    location(location) {
        if (location === undefined) {
            return this._data.location;
        }

        this._data.location = location ? location.toString() : null;
        return this;
    }


    /**
     * Set/Get the event's description
     *
     * @param {String} [description]
     * @since 0.2.0
     * @returns {ICalEvent|String}
     */
    description(description) {
        if (description === undefined) {
            return this._data.description;
        }

        this._data.description = description ? description.toString() : null;
        return this;
    }

    /**
     * Set/Get the event's HTML description
     *
     * @param {String} [description]
     * @since 0.2.8
     * @returns {ICalEvent|String}
     */
    htmlDescription(htmlDescription) {
        if (htmlDescription === undefined) {
            return this._data.htmlDescription;
        }

        this._data.htmlDescription = htmlDescription ? htmlDescription.toString() : null;
        return this;
    }


    /**
     * Set/Get the event's organizer
     *
     * @param {String|Object} [organizer]
     * @param {String} [organizer.name]
     * @param {String} [organizer.email]
     * @since 0.2.0
     * @returns {ICalEvent|Object}
     */
    organizer(_organizer) {
        if (_organizer === undefined) {
            return this._data.organizer;
        }
        if (_organizer === null) {
            this._data.organizer = null;
            return this;
        }

        let organizer = null;
        const organizerRegEx = /^(.+) ?<([^>]+)>$/;

        if (typeof _organizer === 'string') {
            const organizerRegExMatch = _organizer.match(organizerRegEx);
            if (organizerRegExMatch) {
                organizer = {
                    name: organizerRegExMatch[1].trim(),
                    email: organizerRegExMatch[2]
                };
            }
        }
        else if (typeof _organizer === 'object') {
            organizer = {
                name: _organizer.name,
                email: _organizer.email
            };
        }

        if (!organizer && typeof _organizer === 'string') {
            throw new Error(
                '`organizer` isn\'t formated correctly. See https://github.com/sebbo2002/ical-generator#organizer' +
                'stringobject-organizer'
            );
        }
        else if (!organizer) {
            throw new Error(
                '`organizer` needs to be a valid formed string or an object. See https://github.com/sebbo2002/ical-' +
                'generator#organizerstringobject-organizer'
            );
        }

        if (!organizer.name) {
            throw new Error('`organizer.name` is empty!');
        }
        if (!organizer.email) {
            throw new Error('`organizer.email` is empty!');
        }

        this._data.organizer = {
            name: organizer.name,
            email: organizer.email
        };
        return this;
    }


    /**
     * Create a new Attendee and return the attendee object…
     *
     * @param {String|Object|ICalAttendee} [attendeeData] Attendee options
     * @param {String} [attendeeData.name]
     * @param {String} [attendeeData.email]
     * @since 0.2.0
     * @returns {ICalAttendee}
     */
    createAttendee(_attendeeData) {
        const attendeeRegEx = /^(.+) ?<([^>]+)>$/;
        let attendee;

        if (_attendeeData instanceof ICalAttendee) {
            this._data.attendees.push(_attendeeData);
            return _attendeeData;
        }

        if (typeof _attendeeData === 'string') {
            const attendeeRegexMatch = _attendeeData.match(attendeeRegEx);
            if (attendeeRegexMatch) {
                attendee = new ICalAttendee({
                    name: attendeeRegexMatch[1].trim(),
                    email: attendeeRegexMatch[2]
                }, this);

                this._data.attendees.push(attendee);
                return attendee;
            }
        }
        if (typeof _attendeeData === 'string') {
            throw new Error(
                '`attendee` isn\'t formated correctly. See https://github.com/sebbo2002/ical-generator#create' +
                'attendeeobject-options'
            );
        }

        attendee = new ICalAttendee(_attendeeData, this);
        this._data.attendees.push(attendee);
        return attendee;
    }


    /**
     * Get all attendees or add attendees…
     *
     * @since 0.2.0
     * @param {Array<String|Object>} [attendees]
     * @returns {ICalAttendees[]|ICalEvent}
     */
    attendees(attendees) {
        if (!attendees) {
            return this._data.attendees;
        }

        const cal = this;
        attendees.forEach(function (e) {
            cal.createAttendee(e);
        });

        return cal;
    }


    /**
     * Create a new Alarm and return the alarm object…
     *
     * @param {object} [alarmData] Alarm-Options
     * @since 0.2.1
     * @returns {ICalAlarm}
     */
    createAlarm(alarmData) {
        const alarm = new ICalAlarm(alarmData, this);

        this._data.alarms.push(alarm);
        return alarm;
    }


    /**
     * Get all alarms or add alarms…
     *
     * @param {Array<Object>} [alarms]
     * @since 0.2.0
     * @returns {ICalAlarms[]|ICalEvent}
     */
    alarms(alarms) {
        if (!alarms) {
            return this._data.alarms;
        }

        const cal = this;
        alarms.forEach(function (e) {
            cal.createAlarm(e);
        });

        return cal;
    }


    /**
     * Create a new categorie and return the category object…
     *
     * @param {object} [categoryData] Category-Options
     * @since 0.3.0
     * @returns {ICalCategory}
     */
    createCategory(categoryData) {
        const category = new ICalCategory(categoryData, this);

        this._data.categories.push(category);
        return category;
    }


    /**
     * Get all categories or add categories…
     *
     * @param {Array<Object>} [categorie]
     * @since 0.3.0
     * @returns {ICalCategories[]|ICalEvent}
     */
    categories(categories) {
        if (!categories) {
            return this._data.categories;
        }

        const cal = this;
        categories.forEach(function (e) {
            cal.createCategory(e);
        });

        return cal;
    }


    /**
     * Set/Get the event's status
     *
     * @param {String} [status]
     * @since 0.2.0
     * @returns {ICalEvent|String}
     */
    status(status) {
        if (status === undefined) {
            return this._data.status;
        }
        if (status === null) {
            this._data.status = null;
            return this;
        }

        if (this._vars.allowedStatuses.indexOf(status.toString().toUpperCase()) === -1) {
            throw new Error('`status` must be one of the following: ' + this._vars.allowedStatuses.join(', ') + '!');
        }

        this._data.status = status.toString().toUpperCase();
        return this;
    }


    /**
     * Set/Get the event's URL
     *
     * @param {String} [url] URL
     * @since 0.2.0
     * @returns {ICalEvent|String}
     */
    url(url) {
        if (url === undefined) {
            return this._data.url;
        }

        this._data.url = url ? url.toString() : null;
        return this;
    }


    /**
     * Set/Get the event's creation date
     *
     * @param {moment|Date|String|Number} created
     * @since 0.3.0
     * @returns {ICalEvent|moment}
     */
    created(created) {
        if (created === undefined) {
            return this._data.created;
        }

        if (typeof created === 'string' || typeof created === 'number' || created instanceof Date) {
            created = moment(created);
        }
        if (!(created instanceof moment) || !created.isValid()) {
            throw new Error('Invalid `created` date!');
        }

        this._data.created = created;
        return this;
    }


    /**
     * Set/Get the event's last modification date
     *
     * @param {moment|Date|String|Number} lastModified
     * @since 0.3.0
     * @returns {ICalEvent|moment}
     */
    lastModified(lastModified) {
        if (lastModified === undefined) {
            return this._data.lastModified;
        }

        if (typeof lastModified === 'string' || typeof lastModified === 'number' || lastModified instanceof Date) {
            lastModified = moment(lastModified);
        }
        if (!(lastModified instanceof moment) || !lastModified.isValid()) {
            throw new Error('Invalid `lastModified` date!');
        }

        this._data.lastModified = lastModified;
        return this;
    }


    /**
     * Export calender as JSON Object to use it later…
     *
     * @since 0.2.4
     * @returns {Object} Calendar
     */
    toJSON() {
        return ICalTools.toJSON(this, this._attributes);
    }


    /**
     * Export Event to iCal
     *
     * @param {ICalCalendar}
     * @since 0.2.0
     * @returns {String}
     */
    _generate() {
        let g = '';

        if (!this._data.start) {
            throw new Error('No value for `start` in ICalEvent #' + this._data.id + ' given!');
        }

        // DATE & TIME
        g += 'BEGIN:VEVENT\r\n';
        g += 'UID:' + this._data.id + '@' + this._calendar.domain() + '\r\n';

        // SEQUENCE
        g += 'SEQUENCE:' + this._data.sequence + '\r\n';

        g += 'DTSTAMP:' + ICalTools.formatDate(this._calendar.timezone(), this._data.stamp) + '\r\n';
        if (this._data.allDay) {
            g += 'DTSTART;VALUE=DATE:' + ICalTools.formatDate(this._calendar.timezone(), this._data.start, true) + '\r\n';
            if (this._data.end) {
                g += 'DTEND;VALUE=DATE:' + ICalTools.formatDate(this._calendar.timezone(), this._data.end, true) + '\r\n';
            }

            g += 'X-MICROSOFT-CDO-ALLDAYEVENT:TRUE\r\n';
            g += 'X-MICROSOFT-MSNCALENDAR-ALLDAYEVENT:TRUE\r\n';
        } else {
            g += ICalTools.formatDateTZ(this._calendar.timezone(), 'DTSTART', this._data.start, this._data) + '\r\n';
            if (this._data.end) {
                g += ICalTools.formatDateTZ(this._calendar.timezone(), 'DTEND', this._data.end, this._data) + '\r\n';
            }
        }

        // REPEATING
        if (this._data.repeating) {
            g += 'RRULE:FREQ=' + this._data.repeating.freq;

            if (this._data.repeating.count) {
                g += ';COUNT=' + this._data.repeating.count;
            }

            if (this._data.repeating.interval) {
                g += ';INTERVAL=' + this._data.repeating.interval;
            }

            if (this._data.repeating.until) {
                g += ';UNTIL=' + ICalTools.formatDate(this._calendar.timezone(), this._data.repeating.until);
            }

            if (this._data.repeating.byDay) {
                g += ';BYDAY=' + this._data.repeating.byDay.join(',');
            }

            if (this._data.repeating.byMonth) {
                g += ';BYMONTH=' + this._data.repeating.byMonth.join(',');
            }

            if (this._data.repeating.byMonthDay) {
                g += ';BYMONTHDAY=' + this._data.repeating.byMonthDay.join(',');
            }

            g += '\r\n';

            // REPEATING EXCLUSION
            if (this._data.repeating.exclude) {
                g += 'EXDATE:' + this._data.repeating.exclude.map(excludedDate => {
                    return ICalTools.formatDate(this._calendar.timezone(), excludedDate);
                }).join(',') + '\r\n';
            }
        }

        // SUMMARY
        g += 'SUMMARY:' + ICalTools.escape(this._data.summary) + '\r\n';

        // LOCATION
        if (this._data.location) {
            g += 'LOCATION:' + ICalTools.escape(this._data.location) + '\r\n';
        }

        // DESCRIPTION
        if (this._data.description) {
            g += 'DESCRIPTION:' + ICalTools.escape(this._data.description) + '\r\n';
        }

        // HTML DESCRIPTION
        if (this._data.htmlDescription) {
            g += 'X-ALT-DESC;FMTTYPE=text/html:' + ICalTools.escape(this._data.htmlDescription) + '\r\n';
        }

        // ORGANIZER
        if (this._data.organizer) {
            g += 'ORGANIZER;CN="' + ICalTools.escape(this._data.organizer.name) + '":mailto:' + ICalTools.escape(this._data.organizer.email) + '\r\n';
        }

        // ATTENDEES
        this._data.attendees.forEach(function (attendee) {
            g += attendee._generate();
        });

        // ALARMS
        this._data.alarms.forEach(function (alarm) {
            g += alarm._generate();
        });

        // CATEGORIES
        this._data.categories.forEach(function (category) {
            g += category._generate();
        });

        // URL
        if (this._data.url) {
            g += 'URL;VALUE=URI:' + ICalTools.escape(this._data.url) + '\r\n';
        }

        // STATUS
        if (this._data.status) {
            g += 'STATUS:' + this._data.status.toUpperCase() + '\r\n';
        }

        // CREATED
        if (this._data.created) {
            g += 'CREATED:' + ICalTools.formatDate(this._calendar.timezone(), this._data.created) + '\r\n';
        }

        // LAST-MODIFIED
        if (this._data.lastModified) {
            g += 'LAST-MODIFIED:' + ICalTools.formatDate(this._calendar.timezone(), this._data.lastModified) + '\r\n';
        }

        g += 'END:VEVENT\r\n';
        return g;
    }
}

module.exports = ICalEvent;
