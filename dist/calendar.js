'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var moment = require('moment-timezone');
var ICalTools = require('./_tools');
var ICalEvent = require('./event');

/**
 * @author Sebastian Pekarek
 * @module ical-generator
 * @class ICalCalendar
 */

var ICalCalendar = function () {
    function ICalCalendar(data) {
        _classCallCheck(this, ICalCalendar);

        this._data = {};
        this._attributes = ['domain', 'prodId', 'method', 'name', 'description', 'timezone', 'ttl', 'url', 'events'];
        this._vars = {
            allowedMethods: ['PUBLISH', 'REQUEST', 'REPLY', 'ADD', 'CANCEL', 'REFRESH', 'COUNTER', 'DECLINECOUNTER']
        };

        if (typeof data === 'string') {
            data = JSON.parse(data);
        }

        this.clear();

        for (var i in data) {
            if (this._attributes.indexOf(i) > -1) {
                this[i](data[i]);
            }
        }
    }

    /**
     * Set/Get your feed's domain…
     *
     * @param {string} [domain] Domain
     * @since 0.2.0
     * @deprecated 0.3.0
     * @returns {ICalCalendar|String}
     */


    _createClass(ICalCalendar, [{
        key: 'domain',
        value: function domain(_domain) {
            if (!_domain) {
                return this._data.domain;
            }

            this._data.domain = _domain.toString();
            return this;
        }

        /**
         * Set/Get your feed's prodid. `prodid` can be either a
         * string like "//sebbo.net//ical-generator//EN" or an
         * object like
         * {
         *   "company": "sebbo.net",
         *   "product": "ical-generator"
         *   "language": "EN"
         * }
         *
         * `language` is optional and defaults to `EN`.
         *
         * @param {string} [prodid] ProdID
         * @since 0.2.0
         * @returns {ICalCalendar}
         */

    }, {
        key: 'prodId',
        value: function prodId(prodid) {
            if (!prodid) {
                return this._data.prodid;
            }

            var prodIdRegEx = /^\/\/(.+)\/\/(.+)\/\/([A-Z]{1,4})$/;
            var language = void 0;

            if (typeof prodid === 'string' && prodIdRegEx.test(prodid)) {
                this._data.prodid = prodid;
                return this;
            }
            if (typeof prodid === 'string') {
                throw new Error('`prodid` isn\'t formated correctly. See https://github.com/sebbo2002/ical-generator#' + 'prodidstringobject-prodid');
            }

            if ((typeof prodid === 'undefined' ? 'undefined' : _typeof(prodid)) !== 'object') {
                throw new Error('`prodid` needs to be a valid formed string or an object!');
            }

            if (!prodid.company) {
                throw new Error('`prodid.company` is a mandatory item!');
            }
            if (!prodid.product) {
                throw new Error('`prodid.product` is a mandatory item!');
            }

            language = (prodid.language || 'EN').toUpperCase();
            this._data.prodid = '//' + prodid.company + '//' + prodid.product + '//' + language;
            return this;
        }

        /**
         * Set/Get your feed's method
         *
         * @param {string} method
         * @since 0.2.8
         * @returns {ICalCalendar|String}
         */

    }, {
        key: 'method',
        value: function method(_method) {
            if (_method === undefined) {
                return this._data.method;
            }
            if (!_method) {
                this._data.method = null;
                return this;
            }

            if (this._vars.allowedMethods.indexOf(_method.toUpperCase()) === -1) {
                throw new Error('`method` must be one of the following: ' + this._vars.allowedMethods.join(', ') + '!');
            }

            this._data.method = _method.toUpperCase();
            return this;
        }

        /**
         * Set/Get your feed's name…
         *
         * @param {string} [name] Name
         * @since 0.2.0
         * @returns {ICalCalendar|String}
         */

    }, {
        key: 'name',
        value: function name(_name) {
            if (_name === undefined) {
                return this._data.name;
            }

            this._data.name = _name ? _name.toString() : null;
            return this;
        }

        /**
         * Set/Get your feed's description…
         *
         * @param [description] Description
         * @since 0.2.7
         * @returns {ICalCalendar|String}
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
         * Set/Get your feed's timezone.
         * Used to set `X-WR-TIMEZONE`.
         *
         * @param {string} [timezone] Timezone
         * @example cal.timezone('America/New_York');
         * @since 0.2.0
         * @returns {ICalCalendar|String}
         */

    }, {
        key: 'timezone',
        value: function timezone(_timezone) {
            if (_timezone === undefined) {
                return this._data.timezone;
            }

            this._data.timezone = _timezone ? _timezone.toString() : null;
            return this;
        }

        /**
         * Set/Get your feed's URL
         *
         * @param {string} [url] URL
         * @example cal.url('http://example.com/my/feed.ical');
         * @since 0.2.5
         * @returns {ICalCalendar|String}
         */

    }, {
        key: 'url',
        value: function url(_url) {
            if (_url === undefined) {
                return this._data.url;
            }

            this._data.url = _url || null;
            return this;
        }

        /**
         * Set/Get your feed's TTL.
         * Used to set `X-PUBLISHED-TTL` and `REFRESH-INTERVAL`.
         *
         * @param {Number} [ttl] TTL
         * @example cal.ttl(60 * 60 * 24); // 1 day
         * @since 0.2.5
         * @returns {ICalCalendar|Number}
         */

    }, {
        key: 'ttl',
        value: function ttl(_ttl) {
            if (_ttl === undefined) {
                return this._data.ttl;
            }

            if (moment.isDuration(_ttl)) {
                this._data.ttl = _ttl;
            } else if (parseInt(_ttl, 10) > 0) {
                this._data.ttl = moment.duration(parseInt(_ttl, 10), 'seconds');
            } else {
                this._data.ttl = null;
            }

            return this;
        }

        /**
         * Create a new Event and return the event object…
         *
         * @param {object} [eventData] Event eventData
         * @since 0.2.0
         * @returns {ICalEvent}
         */

    }, {
        key: 'createEvent',
        value: function createEvent(eventData) {
            var event = new ICalEvent(eventData, this);
            this._data.events.push(event);
            return event;
        }

        /**
         * Get all events or add multiple events…
         *
         * @since 0.2.0
         * @returns {ICalEvent[]|ICalCalendar}
         */

    }, {
        key: 'events',
        value: function events(_events) {
            if (!_events) {
                return this._data.events;
            }

            var calendar = this;
            _events.forEach(function (e) {
                calendar.createEvent(e);
            });

            return calendar;
        }

        /**
         * Save ical file with `fs.save`. Only works in node.js environments.
         *
         * @param {String} path Filepath
         * @param [cb] Callback
         * @returns {ICalCalendar}
         */

    }, {
        key: 'save',
        value: function save(path, cb) {
            require('fs').writeFile(path, this._generate(), cb);
            return this;
        }

        /**
         * Save ical file with `fs.saveSync`. Only works in node.js environments.
         *
         * @param {String} path Filepath
         * @returns {Number{ Number of Bytes written
         */

    }, {
        key: 'saveSync',
        value: function saveSync(path) {
            return require('fs').writeFileSync(path, this._generate());
        }

        /**
         * Save ical file with `fs.saveSync`
         *
         * @param {http.ServerResponse} response Response
         * @param {String} [filename] Filename
         * @returns {Number} Number of Bytes written
         */

    }, {
        key: 'serve',
        value: function serve(response, filename) {
            response.writeHead(200, {
                'Content-Type': 'text/calendar; charset=utf-8',
                'Content-Disposition': 'attachment; filename="' + (filename || 'calendar.ics') + '"'
            });
            response.end(this._generate());

            return this;
        }

        /**
         * Returns a URL to download the ical file. Uses the Blob object internally,
         * so it's only working on modern browsers supporting this API.
         *
         * Unfortunately, because node.js has no Blob implementation (they have Buffer
         * instead), this can't be tested right now. Sorry Dave…
         *
         * @returns {String}
         */

    }, {
        key: 'toURL',
        value: function toURL() {
            var blob = new Blob(this._generate(), { type: 'text/calendar' });
            return URL.createObjectURL(blob);
        }

        /**
         * Return ical as string…
         *
         * @returns String ical
         */

    }, {
        key: 'toString',
        value: function toString() {
            return this._generate();
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
         * Get number of events in calendar…
         *
         * @returns {Number} Number of events in calendar
         */

    }, {
        key: 'length',
        value: function length() {
            return this._data.events.length;
        }

        /**
         * Reset calendar to default state…
         *
         * @returns {ICalCalendar}
         */

    }, {
        key: 'clear',
        value: function clear() {
            this._data.prodid = '//sebbo.net//ical-generator//EN';
            this._data.method = null;
            this._data.name = null;
            this._data.description = null;
            this._data.timezone = null;
            this._data.url = null;
            this._data.ttl = null;
            this._data.events = [];
            return this;
        }

        /**
         * Method internally used to generate calendar ical string
         *
         * @returns {string}
         * @private
         */

    }, {
        key: '_generate',
        value: function _generate() {
            var g = '';

            // VCALENDAR and VERSION
            g = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\n';

            // PRODID
            g += 'PRODID:-' + this._data.prodid + '\r\n';

            // URL
            if (this._data.url) {
                g += 'URL:' + this._data.url + '\r\n';
            }

            // METHOD
            if (this._data.method) {
                g += 'METHOD:' + this._data.method + '\r\n';
            }

            // NAME
            if (this._data.name) {
                g += 'NAME:' + this._data.name + '\r\n';
                g += 'X-WR-CALNAME:' + this._data.name + '\r\n';
            }

            // Description
            if (this._data.description) {
                g += 'X-WR-CALDESC:' + this._data.description + '\r\n';
            }

            // Timezone
            if (this._data.timezone) {
                g += 'TIMEZONE-ID:' + this._data.timezone + '\r\n';
                g += 'X-WR-TIMEZONE:' + this._data.timezone + '\r\n';
            }

            // TTL
            if (this._data.ttl) {
                g += 'REFRESH-INTERVAL;VALUE=DURATION:' + this._data.ttl.toISOString() + '\r\n';
                g += 'X-PUBLISHED-TTL:' + this._data.ttl.toISOString() + '\r\n';
            }

            // Events
            this._data.events.forEach(function (event) {
                g += event._generate();
            });

            g += 'END:VCALENDAR';

            g = ICalTools.foldLines(g);
            return g;
        }
    }]);

    return ICalCalendar;
}();

module.exports = ICalCalendar;