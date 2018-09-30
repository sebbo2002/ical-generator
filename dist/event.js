'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var moment = require('moment-timezone');
var ICalTools = require('./_tools');
var ICalAttendee = require('./attendee');
var ICalAlarm = require('./alarm');
var ICalCategory = require('./category');

/**
 * @author Sebastian Pekarek
 * @class ICalEvent
 */

var ICalEvent = function () {
    function ICalEvent(data, _calendar) {
        _classCallCheck(this, ICalEvent);

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
            geo: null,
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
        this._attributes = ['id', 'uid', 'sequence', 'start', 'end', 'timezone', 'stamp', 'timestamp', 'allDay', 'floating', 'repeating', 'summary', 'location', 'geo', 'description', 'htmlDescription', 'organizer', 'attendees', 'alarms', 'categories', 'status', 'url', 'created', 'lastModified'];
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

        for (var i in data) {
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


    _createClass(ICalEvent, [{
        key: 'id',
        value: function id(_id) {
            if (!_id) {
                return this._data.id;
            }

            this._data.id = _id;
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

    }, {
        key: 'uid',
        value: function uid(id) {
            return this.id(id);
        }

        /**
         * Set/Get the event's SEQUENCE number
         *
         * @param {Number} sequence
         * @since 0.2.6
         * @returns {ICalEvent|Number}
         */

    }, {
        key: 'sequence',
        value: function sequence(_sequence) {
            if (_sequence === undefined) {
                return this._data.sequence;
            }

            var s = parseInt(_sequence, 10);
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

    }, {
        key: 'start',
        value: function start(_start) {
            if (_start === undefined) {
                return this._data.start;
            }

            if (typeof _start === 'string') {
                _start = moment(_start).utc();
            } else if (_start instanceof Date) {
                _start = moment(_start).utc();
            } else if (!(_start instanceof moment)) {
                throw new Error('`start` must be a Date or a moment object!');
            }

            if (!_start.isValid()) {
                throw new Error('`start` has to be a valid date!');
            }
            this._data.start = _start;

            if (this._data.start && this._data.end && this._data.start.isAfter(this._data.end)) {
                var t = this._data.start;
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

    }, {
        key: 'end',
        value: function end(_end) {
            if (_end === undefined) {
                return this._data.end;
            }

            if (_end === null) {
                this._data.end = null;
                return this;
            }

            if (typeof _end === 'string') {
                _end = moment(_end);
            } else if (_end instanceof Date) {
                _end = moment(_end);
            } else if (!(_end instanceof moment)) {
                throw new Error('`end` must be a Date or a moment object!');
            }

            if (!_end.isValid()) {
                throw new Error('`end` has to be a valid date!');
            }
            this._data.end = _end;

            if (this._data.start && this._data.end && this._data.start.isAfter(this._data.end)) {
                var t = this._data.start;
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

    }, {
        key: 'timezone',
        value: function timezone(_timezone) {
            if (_timezone === undefined && this._data.timezone !== undefined) {
                return this._data.timezone;
            }
            if (_timezone === undefined) {
                return this._calendar._data.timezone;
            }

            this._data.timezone = _timezone ? _timezone.toString() : null;
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

    }, {
        key: 'stamp',
        value: function stamp(_stamp) {
            if (_stamp === undefined) {
                return this._data.stamp;
            }

            if (typeof _stamp === 'string') {
                _stamp = moment(_stamp);
            } else if (_stamp instanceof Date) {
                _stamp = moment(_stamp);
            } else if (!(_stamp instanceof moment)) {
                throw new Error('`stamp` must be a Date or a moment object!');
            }

            if (!_stamp.isValid()) {
                throw new Error('`stamp` has to be a valid date!');
            }

            this._data.stamp = _stamp;
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

    }, {
        key: 'timestamp',
        value: function timestamp(stamp) {
            return this.stamp(stamp);
        }

        /**
         * Set/Get the event's allDay flag
         *
         * @param {Boolean} [allDay]
         * @since 0.2.0
         * @returns {ICalEvent|Boolean}
         */

    }, {
        key: 'allDay',
        value: function allDay(_allDay) {
            if (_allDay === undefined) {
                return this._data.allDay;
            }

            this._data.allDay = !!_allDay;
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

    }, {
        key: 'floating',
        value: function floating(_floating) {
            if (_floating === undefined) {
                return this._data.floating;
            }

            this._data.floating = !!_floating;
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

    }, {
        key: 'repeating',
        value: function repeating(_repeating) {
            var c = this;

            if (_repeating === undefined) {
                return c._data.repeating;
            }
            if (!_repeating) {
                c._data.repeating = null;
                return c;
            }

            if (!_repeating.freq || c._vars.allowedRepeatingFreq.indexOf(_repeating.freq.toUpperCase()) === -1) {
                throw new Error('`repeating.freq` is a mandatory item, and must be one of the following: ' + c._vars.allowedRepeatingFreq.join(', ') + '!');
            }
            c._data.repeating = {
                freq: _repeating.freq.toUpperCase()
            };

            if (_repeating.count) {
                if (!isFinite(_repeating.count)) {
                    throw new Error('`repeating.count` must be a Number!');
                }

                c._data.repeating.count = _repeating.count;
            }

            if (_repeating.interval) {
                if (!isFinite(_repeating.interval)) {
                    throw new Error('`repeating.interval` must be a Number!');
                }

                c._data.repeating.interval = _repeating.interval;
            }

            if (_repeating.until !== undefined) {
                if (typeof _repeating.until === 'string') {
                    _repeating.until = moment(_repeating.until);
                } else if (_repeating.until instanceof Date) {
                    _repeating.until = moment(_repeating.until);
                } else if (!(_repeating.until instanceof moment)) {
                    throw new Error('`repeating.until` must be a Date or a moment object!');
                }

                if (!_repeating.until.isValid()) {
                    throw new Error('`repeating.until` has to be a valid date!');
                }

                c._data.repeating.until = _repeating.until;
            }

            if (_repeating.byDay) {
                if (!Array.isArray(_repeating.byDay)) {
                    _repeating.byDay = [_repeating.byDay];
                }

                c._data.repeating.byDay = [];
                _repeating.byDay.forEach(function (symbol) {
                    var s = symbol.toString().toUpperCase().match(/^(\d*||-\d+)(\w+)$/);
                    if (['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].indexOf(s[2]) === -1) {
                        throw new Error('`repeating.byDay` contains invalid value `' + s[2] + '`!');
                    }

                    c._data.repeating.byDay.push(s[1] + s[2]);
                });
            }

            if (_repeating.byMonth) {
                if (!Array.isArray(_repeating.byMonth)) {
                    _repeating.byMonth = [_repeating.byMonth];
                }

                c._data.repeating.byMonth = [];
                _repeating.byMonth.forEach(function (month) {
                    if (typeof month !== 'number' || month < 1 || month > 12) {
                        throw new Error('`repeating.byMonth` contains invalid value `' + month + '`!');
                    }

                    c._data.repeating.byMonth.push(month);
                });
            }

            if (_repeating.byMonthDay) {
                if (!Array.isArray(_repeating.byMonthDay)) {
                    _repeating.byMonthDay = [_repeating.byMonthDay];
                }

                c._data.repeating.byMonthDay = [];
                _repeating.byMonthDay.forEach(function (monthDay) {
                    if (typeof monthDay !== 'number' || monthDay < 1 || monthDay > 31) {
                        throw new Error('`repeating.byMonthDay` contains invalid value `' + monthDay + '`!');
                    }

                    c._data.repeating.byMonthDay.push(monthDay);
                });
            }

            if (_repeating.exclude) {
                if (!Array.isArray(_repeating.exclude)) {
                    _repeating.exclude = [_repeating.exclude];
                }

                c._data.repeating.exclude = [];
                _repeating.exclude.forEach(function (excludedDate, i) {
                    if (typeof excludedDate === 'string') {
                        excludedDate = moment(excludedDate);
                    } else if (excludedDate instanceof Date) {
                        excludedDate = moment(excludedDate);
                    } else if (!(excludedDate instanceof moment)) {
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

    }, {
        key: 'summary',
        value: function summary(_summary) {
            if (_summary === undefined) {
                return this._data.summary;
            }

            this._data.summary = _summary ? _summary.toString() : '';
            return this;
        }

        /**
         * Set/Get the event's location
         *
         * @param {String} [location]
         * @since 0.2.0
         * @returns {ICalEvent|String}
         */

    }, {
        key: 'location',
        value: function location(_location) {
            if (_location === undefined) {
                return this._data.location;
            }

            this._data.location = _location ? _location.toString() : null;
            return this;
        }

        /**
         * Set/Get the event's geo
         *
         * @param {String} [geo]
         * @since 1.1.2
         * @returns {ICalEvent|String}
         */

    }, {
        key: 'geo',
        value: function geo(_geo) {
            if (_geo === undefined) {
                if (!this._data.geo) return null;
                return this._data.geo.lat + ';' + this._data.geo.lon;
            }

            var geoStruct = {};
            if (typeof _geo === "string") {
                var geoParts = _geo.split(';');
                geoStruct.lat = parseFloat(geoParts[0]);
                geoStruct.lon = parseFloat(geoParts[1]);
            } else geoStruct = _geo;
            if (!geoStruct || !isFinite(geoStruct.lat) || !isFinite(geoStruct.lon)) {
                //throw "invalid geo";
                this._data.geo = null;
            } else this._data.geo = geoStruct;
            return this;
        }

        /**
         * Set/Get the event's description
         *
         * @param {String} [description]
         * @since 0.2.0
         * @returns {ICalEvent|String}
         */

    }, {
        key: 'description',
        value: function description(_description) {
            if (_description === undefined) {
                return this._data.description;
            }

            this._data.description = _description ? _description.toString() : null;
            return this;
        }

        /**
         * Set/Get the event's HTML description
         *
         * @param {String} [description]
         * @since 0.2.8
         * @returns {ICalEvent|String}
         */

    }, {
        key: 'htmlDescription',
        value: function htmlDescription(_htmlDescription) {
            if (_htmlDescription === undefined) {
                return this._data.htmlDescription;
            }

            this._data.htmlDescription = _htmlDescription ? _htmlDescription.toString() : null;
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

    }, {
        key: 'organizer',
        value: function organizer(_organizer) {
            if (_organizer === undefined) {
                return this._data.organizer;
            }
            if (_organizer === null) {
                this._data.organizer = null;
                return this;
            }

            var organizer = null;
            var organizerRegEx = /^(.+) ?<([^>]+)>$/;

            if (typeof _organizer === 'string') {
                var organizerRegExMatch = _organizer.match(organizerRegEx);
                if (organizerRegExMatch) {
                    organizer = {
                        name: organizerRegExMatch[1].trim(),
                        email: organizerRegExMatch[2]
                    };
                }
            } else if ((typeof _organizer === 'undefined' ? 'undefined' : _typeof(_organizer)) === 'object') {
                organizer = {
                    name: _organizer.name,
                    email: _organizer.email
                };
            }

            if (!organizer && typeof _organizer === 'string') {
                throw new Error('`organizer` isn\'t formated correctly. See https://github.com/sebbo2002/ical-generator#organizer' + 'stringobject-organizer');
            } else if (!organizer) {
                throw new Error('`organizer` needs to be a valid formed string or an object. See https://github.com/sebbo2002/ical-' + 'generator#organizerstringobject-organizer');
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

    }, {
        key: 'createAttendee',
        value: function createAttendee(_attendeeData) {
            var attendeeRegEx = /^(.+) ?<([^>]+)>$/;
            var attendee = void 0;

            if (_attendeeData instanceof ICalAttendee) {
                this._data.attendees.push(_attendeeData);
                return _attendeeData;
            }

            if (typeof _attendeeData === 'string') {
                var attendeeRegexMatch = _attendeeData.match(attendeeRegEx);
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
                throw new Error('`attendee` isn\'t formated correctly. See https://github.com/sebbo2002/ical-generator#create' + 'attendeeobject-options');
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

    }, {
        key: 'attendees',
        value: function attendees(_attendees) {
            if (!_attendees) {
                return this._data.attendees;
            }

            var cal = this;
            _attendees.forEach(function (e) {
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

    }, {
        key: 'createAlarm',
        value: function createAlarm(alarmData) {
            var alarm = new ICalAlarm(alarmData, this);

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

    }, {
        key: 'alarms',
        value: function alarms(_alarms) {
            if (!_alarms) {
                return this._data.alarms;
            }

            var cal = this;
            _alarms.forEach(function (e) {
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

    }, {
        key: 'createCategory',
        value: function createCategory(categoryData) {
            var category = new ICalCategory(categoryData, this);

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

    }, {
        key: 'categories',
        value: function categories(_categories) {
            if (!_categories) {
                return this._data.categories;
            }

            var cal = this;
            _categories.forEach(function (e) {
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

    }, {
        key: 'status',
        value: function status(_status) {
            if (_status === undefined) {
                return this._data.status;
            }
            if (_status === null) {
                this._data.status = null;
                return this;
            }

            if (this._vars.allowedStatuses.indexOf(_status.toString().toUpperCase()) === -1) {
                throw new Error('`status` must be one of the following: ' + this._vars.allowedStatuses.join(', ') + '!');
            }

            this._data.status = _status.toString().toUpperCase();
            return this;
        }

        /**
         * Set/Get the event's URL
         *
         * @param {String} [url] URL
         * @since 0.2.0
         * @returns {ICalEvent|String}
         */

    }, {
        key: 'url',
        value: function url(_url) {
            if (_url === undefined) {
                return this._data.url;
            }

            this._data.url = _url ? _url.toString() : null;
            return this;
        }

        /**
         * Set/Get the event's creation date
         *
         * @param {moment|Date|String|Number} created
         * @since 0.3.0
         * @returns {ICalEvent|moment}
         */

    }, {
        key: 'created',
        value: function created(_created) {
            if (_created === undefined) {
                return this._data.created;
            }

            if (typeof _created === 'string' || typeof _created === 'number' || _created instanceof Date) {
                _created = moment(_created);
            }
            if (!(_created instanceof moment) || !_created.isValid()) {
                throw new Error('Invalid `created` date!');
            }

            this._data.created = _created;
            return this;
        }

        /**
         * Set/Get the event's last modification date
         *
         * @param {moment|Date|String|Number} lastModified
         * @since 0.3.0
         * @returns {ICalEvent|moment}
         */

    }, {
        key: 'lastModified',
        value: function lastModified(_lastModified) {
            if (_lastModified === undefined) {
                return this._data.lastModified;
            }

            if (typeof _lastModified === 'string' || typeof _lastModified === 'number' || _lastModified instanceof Date) {
                _lastModified = moment(_lastModified);
            }
            if (!(_lastModified instanceof moment) || !_lastModified.isValid()) {
                throw new Error('Invalid `lastModified` date!');
            }

            this._data.lastModified = _lastModified;
            return this;
        }

        /**
         * Export calender as JSON Object to use it later…
         *
         * @since 0.2.4
         * @returns {Object} Calendar
         */

    }, {
        key: 'toJSON',
        value: function toJSON() {
            return ICalTools.toJSON(this, this._attributes);
        }

        /**
         * Export Event to iCal
         *
         * @param {ICalCalendar}
         * @since 0.2.0
         * @returns {String}
         */

    }, {
        key: '_generate',
        value: function _generate() {
            var _this = this;

            var g = '';

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
                    g += 'EXDATE:' + this._data.repeating.exclude.map(function (excludedDate) {
                        return ICalTools.formatDate(_this._calendar.timezone(), excludedDate);
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
            if (this._data.categories.length > 0) {
                g += 'CATEGORIES:' + this._data.categories.map(function (category) {
                    return category._generate();
                }).join() + '\r\n';
            }

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
    }]);

    return ICalEvent;
}();

module.exports = ICalEvent;