'use strict';

const moment = require('moment-timezone');
const ICalTools = require('./_tools');
const ICalEvent = require('./event');


/**
 * @author Sebastian Pekarek
 * @module ical-generator
 * @class ICalCalendar
 */
class ICalCalendar {
    constructor(data) {
        this._data = {};
        this._attributes = ['domain', 'prodId', 'method', 'name', 'description', 'timezone', 'ttl', 'url', 'scale', 'events'];
        this._vars = {
            allowedMethods: ['PUBLISH', 'REQUEST', 'REPLY', 'ADD', 'CANCEL', 'REFRESH', 'COUNTER', 'DECLINECOUNTER']
        };

        if (typeof data === 'string') {
            data = JSON.parse(data);
        }

        this.clear();

        for (let i in data) {
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
    domain(domain) {
        if (!domain) {
            return this._data.domain;
        }

        this._data.domain = domain.toString();
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
    prodId(prodid) {
        if (!prodid) {
            return this._data.prodid;
        }

        const prodIdRegEx = /^\/\/(.+)\/\/(.+)\/\/([A-Z]{1,4})$/;
        let language;

        if (typeof prodid === 'string' && prodIdRegEx.test(prodid)) {
            this._data.prodid = prodid;
            return this;
        }
        if (typeof prodid === 'string') {
            throw new Error(
                '`prodid` isn\'t formated correctly. See https://github.com/sebbo2002/ical-generator#' +
                'prodidstringobject-prodid'
            );
        }

        if (typeof prodid !== 'object') {
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
    method(method) {
        if (method === undefined) {
            return this._data.method;
        }
        if (!method) {
            this._data.method = null;
            return this;
        }

        if (this._vars.allowedMethods.indexOf(method.toUpperCase()) === -1) {
            throw new Error('`method` must be one of the following: ' + this._vars.allowedMethods.join(', ') + '!');
        }

        this._data.method = method.toUpperCase();
        return this;
    }


    /**
     * Set/Get your feed's name…
     *
     * @param {string} [name] Name
     * @since 0.2.0
     * @returns {ICalCalendar|String}
     */
    name(name) {
        if (name === undefined) {
            return this._data.name;
        }

        this._data.name = name ? name.toString() : null;
        return this;
    }


    /**
     * Set/Get your feed's description…
     *
     * @param [description] Description
     * @since 0.2.7
     * @returns {ICalCalendar|String}
     */
    description(description) {
        if (description === undefined) {
            return this._data.description;
        }

        this._data.description = description ? description.toString() : null;
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
    timezone(timezone) {
        if (timezone === undefined) {
            return this._data.timezone;
        }

        this._data.timezone = timezone ? timezone.toString() : null;
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
    url(url) {
        if (url === undefined) {
            return this._data.url;
        }

        this._data.url = url || null;
        return this;
    }


    /**
     * Set/Get your feed's CALSCALE
     *
     * @param {string} [scale] CALSCALE
     * @example cal.scale('gregorian');
     * @since 1.8.0
     * @returns {ICalCalendar|String}
     */
    scale(scale) {
        if (scale === undefined) {
            return this._data.scale;
        }

        if (scale === null) {
            this._data.scale = null;
        } else {
            this._data.scale = scale.toUpperCase();
        }

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
    ttl(ttl) {
        if (ttl === undefined) {
            return this._data.ttl;
        }

        if (moment.isDuration(ttl)) {
            this._data.ttl = ttl;
        } else if (parseInt(ttl, 10) > 0) {
            this._data.ttl = moment.duration(parseInt(ttl, 10), 'seconds');
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
    createEvent(eventData) {
        const event = new ICalEvent(eventData, this);
        this._data.events.push(event);
        return event;
    }


    /**
     * Get all events or add multiple events…
     *
     * @since 0.2.0
     * @returns {ICalEvent[]|ICalCalendar}
     */
    events(events) {
        if (!events) {
            return this._data.events;
        }

        const calendar = this;
        events.forEach(function (e) {
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
    save(path, cb) {
        require('fs').writeFile(path, this._generate(), cb);
        return this;
    }


    /**
     * Save ical file with `fs.saveSync`. Only works in node.js environments.
     *
     * @param {String} path Filepath
     * @returns {Number} Number of Bytes written
     */
    saveSync(path) {
        return require('fs').writeFileSync(path, this._generate());
    }


    /**
     * Save ical file with `fs.saveSync`
     *
     * @param {http.ServerResponse} response Response
     * @param {String} [filename = 'calendar.ics'] Filename
     * @returns {Number} Number of Bytes written
     */
    serve(response, filename) {
        response.writeHead(200, {
            'Content-Type': 'text/calendar; charset=utf-8',
            'Content-Disposition': 'attachment; filename="' + (filename || 'calendar.ics') + '"'
        });
        response.end(this._generate());

        return this;
    }


    /**
     * Returns a Blob which you can use to download or to create an url
     * so it's only working on modern browsers supporting the Blob API.
     *
     * Unfortunately, because node.js has no Blob implementation (they have Buffer
     * instead), this can't be tested right now. Sorry Dave…
     *
     * @since 1.9.0
     * @returns {Blob}
     */
    toBlob() {
        return new Blob([this._generate()], {type: 'text/calendar'});
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
    toURL() {
        const blob = this.toBlob();
        return URL.createObjectURL(blob);
    }


    /**
     * Return ical as string…
     *
     * @returns String ical
     */
    toString() {
        return this._generate();
    }


    /**
     * Get/Set X-* attributes. Woun't filter double attributes,
     * which are also added by another method (e.g. busystatus),
     * so these attributes may be inserted twice.
     *
     * @param {Array<Object<{key: String, value: String}>>|String} [key]
     * @param {String} [value]
     * @since 1.9.0
     * @returns {ICalEvent|Array<Object<{key: String, value: String}>>}
     */
    x (keyOrArray, value) {
        return ICalTools.addOrGetCustomAttributes (this, keyOrArray, value);
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
     * Get number of events in calendar…
     *
     * @returns {Number} Number of events in calendar
     */
    length() {
        return this._data.events.length;
    }


    /**
     * Reset calendar to default state…
     *
     * @returns {ICalCalendar}
     */
    clear() {
        this._data.prodid = '//sebbo.net//ical-generator//EN';
        this._data.method = null;
        this._data.name = null;
        this._data.description = null;
        this._data.timezone = null;
        this._data.url = null;
        this._data.scale = null;
        this._data.ttl = null;
        this._data.events = [];
        this._data.x = [];
        return this;
    }


    /**
     * Method internally used to generate calendar ical string
     *
     * @returns {string}
     * @private
     */
    _generate() {
        let g = '';

        // VCALENDAR and VERSION
        g = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\n';

        // PRODID
        g += 'PRODID:-' + this._data.prodid + '\r\n';

        // URL
        if (this._data.url) {
            g += 'URL:' + this._data.url + '\r\n';
        }

        // CALSCALE
        if (this._data.scale) {
            g += 'CALSCALE:' + this._data.scale + '\r\n';
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

        // CUSTOM X ATTRIBUTES
        g += ICalTools.generateCustomAttributes(this);

        g += 'END:VCALENDAR';

        g = ICalTools.foldLines(g);
        return g;
    }
}

module.exports = ICalCalendar;
