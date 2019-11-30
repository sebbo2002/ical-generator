'use strict';


const moment = require('moment-timezone');
const ICalTools = require('./_tools');


/**
 * @author Sebastian Pekarek
 * @module ical-generator
 * @class ICalAlarm
 */
class ICalAlarm {
    constructor (data, event) {
        this._data = {
            type: null,
            trigger: null,
            repeat: null,
            repeatInterval: null,
            attach: null,
            description: null,
            x: []
        };
        this._attributes = [
            'type',
            'trigger',
            'triggerBefore',
            'triggerAfter',
            'repeat',
            'interval',
            'attach',
            'description'
        ];
        this._vars = {
            types: ['display', 'audio']
        };

        this._event = event;
        if (!event) {
            throw new Error('`event` option required!');
        }

        for (let i in data) {
            if (this._attributes.indexOf(i) > -1) {
                this[i](data[i]);
            }
        }
    }


    /**
     * Set/Get the alarm type
     *
     * @param type Type
     * @since 0.2.1
     * @returns {ICalAlarm|String}
     */
    type (type) {
        if (type === undefined) {
            return this._data.type;
        }
        if (!type) {
            this._data.type = null;
            return this;
        }

        if (this._vars.types.indexOf(type) === -1) {
            throw new Error('`type` is not correct, must be either `display` or `audio`!');
        }

        this._data.type = type;
        return this;
    }


    /**
     * Set/Get seconds before event to trigger alarm
     *
     * @param {Number|moment|Date} [trigger] Seconds before alarm triggeres
     * @since 0.2.1
     * @returns {ICalAlarm|Number|moment}
     */
    trigger (trigger) {
        if (trigger === undefined && moment.isMoment(this._data.trigger)) {
            return this._data.trigger;
        }
        if (trigger === undefined && this._data.trigger) {
            return -1 * this._data.trigger;
        }
        if (trigger === undefined) {
            return null;
        }


        if (!trigger) {
            this._data.trigger = null;
            return this;
        }
        if (trigger instanceof Date) {
            this._data.trigger = moment(trigger);
            return this;
        }
        if (moment.isMoment(trigger)) {
            this._data.trigger = trigger;
            return this;
        }
        if (moment.isDuration(trigger)) {
            this._data.trigger = -1 * trigger.as('seconds');
            return this;
        }
        if (typeof trigger === 'number' && isFinite(trigger)) {
            this._data.trigger = -1 * trigger;
            return this;
        }

        throw new Error('`trigger` is not correct, must be a `Number`, `Date` or `moment` or a `moment.duration`!');
    }


    /**
     * Set/Get seconds after event to trigger alarm
     *
     * @param {Number|moment|Date} [trigger] Seconds after alarm triggeres
     * @since 0.2.1
     * @returns {ICalAlarm|Number|moment}
     */
    triggerAfter (trigger) {
        if (trigger === undefined) {
            return this._data.trigger;
        }
        if (moment.isDuration(trigger)) {
            this._data.trigger = -1 * trigger.as('seconds');
            return this;
        }

        return this.trigger(typeof trigger === 'number' ? -1 * trigger : trigger);
    }


    /**
     * Set/Get seconds before event to trigger alarm
     *
     * @param {Number|moment|Date} [trigger] Seconds before alarm triggeres
     * @since 0.2.1
     * @returns {ICalAlarm|Number|moment}
     */
    triggerBefore (trigger) {
        return this.trigger(trigger);
    }


    /**
     * Set/Get Alarm Repetitions
     *
     * @param {Number} [repeat] Number of repetitions
     * @since 0.2.1
     * @returns {ICalAlarm|Number}
     */
    repeat (repeat) {
        if (repeat === undefined) {
            return this._data.repeat;
        }
        if (!repeat) {
            this._data.repeat = null;
            return this;
        }

        if (typeof repeat !== 'number' || !isFinite(repeat)) {
            throw new Error('`repeat` is not correct, must be numeric!');
        }

        this._data.repeat = repeat;
        return this;
    }


    /**
     * Set/Get Repeat Interval
     *
     * @param {Number} [interval] Interval in seconds
     * @since 0.2.1
     * @returns {ICalAlarm|Number|Null}
     */
    interval (interval) {
        if (interval === undefined) {
            return this._data.interval;
        }
        if (!interval) {
            this._data.interval = null;
            return this;
        }

        if (typeof interval !== 'number' || !isFinite(interval)) {
            throw new Error('`interval` is not correct, must be numeric!');
        }

        this._data.interval = interval;
        return this;
    }


    /**
     * Set/Get Attachment
     *
     * @param {Object|String} [attach] File-URI or Object
     * @param {String} [attach.uri]
     * @param {String} [attach.mime]
     * @since 0.2.1
     * @returns {ICalAlarm|Object}
     */
    attach (attach) {
        if (attach === undefined) {
            return this._data.attach;
        }
        if (!attach) {
            this._data.attach = null;
            return this;
        }

        let _attach = null;
        if (typeof attach === 'string') {
            _attach = {
                uri: attach,
                mime: null
            };
        }
        else if (typeof attach === 'object') {
            _attach = {
                uri: attach.uri,
                mime: attach.mime || null
            };
        }
        else {
            throw new Error(
                '`attach` needs to be a valid formed string or an object. See https://github.com/sebbo2002/ical-' +
                'generator#attachstringobject-attach'
            );
        }

        if (!_attach.uri) {
            throw new Error('`attach.uri` is empty!');
        }

        this._data.attach = {
            uri: _attach.uri,
            mime: _attach.mime
        };
        return this;
    }


    /**
     * Set/Get the alarm description
     *
     * @param {String|null} [description] Description
     * @since 0.2.1
     * @returns {ICalAlarm|String}
     */
    description (description) {
        if (description === undefined) {
            return this._data.description;
        }
        if (!description) {
            this._data.description = null;
            return this;
        }

        this._data.description = description;
        return this;
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
     * @returns {Object}
     */
    toJSON () {
        return ICalTools.toJSON(this, this._attributes, {
            ignoreAttributes: ['triggerAfter', 'triggerBefore']
        });
    }


    /**
     * Export Event to iCal
     *
     * @since 0.2.0
     * @returns {String}
     */
    _generate () {
        let g = 'BEGIN:VALARM\r\n';

        if (!this._data.type) {
            throw new Error('No value for `type` in ICalAlarm given!');
        }
        if (!this._data.trigger) {
            throw new Error('No value for `trigger` in ICalAlarm given!');
        }

        // ACTION
        g += 'ACTION:' + this._data.type.toUpperCase() + '\r\n';

        if (moment.isMoment(this._data.trigger)) {
            g += 'TRIGGER;VALUE=DATE-TIME:' + ICalTools.formatDate(this._event._calendar.timezone(), this._data.trigger) + '\r\n';
        }
        else if (this._data.trigger > 0) {
            g += 'TRIGGER;RELATED=END:' + moment.duration(this._data.trigger, 's').toISOString() + '\r\n';
        }
        else {
            g += 'TRIGGER:' + moment.duration(this._data.trigger, 's').toISOString() + '\r\n';
        }

        // REPEAT
        if (this._data.repeat && !this._data.interval) {
            throw new Error('No value for `interval` in ICalAlarm given, but required for `repeat`!');
        }
        if (this._data.repeat) {
            g += 'REPEAT:' + this._data.repeat + '\r\n';
        }

        // INTERVAL
        if (this._data.interval && !this._data.repeat) {
            throw new Error('No value for `repeat` in ICalAlarm given, but required for `interval`!');
        }
        if (this._data.interval) {
            g += 'DURATION:' + moment.duration(this._data.interval, 's').toISOString() + '\r\n';
        }

        // ATTACH
        if (this._data.type === 'audio' && this._data.attach && this._data.attach.mime) {
            g += 'ATTACH;FMTTYPE=' + this._data.attach.mime + ':' + this._data.attach.uri + '\r\n';
        }
        else if (this._data.type === 'audio' && this._data.attach) {
            g += 'ATTACH;VALUE=URI:' + this._data.attach.uri + '\r\n';
        }
        else if (this._data.type === 'audio') {
            g += 'ATTACH;VALUE=URI:Basso\r\n';
        }

        // DESCRIPTION
        if (this._data.type === 'display' && this._data.description) {
            g += 'DESCRIPTION:' + ICalTools.escape(this._data.description) + '\r\n';
        }
        else if (this._data.type === 'display') {
            g += 'DESCRIPTION:' + ICalTools.escape(this._event.summary()) + '\r\n';
        }

        // CUSTOM X ATTRIBUTES
        g += ICalTools.generateCustomAttributes(this);

        g += 'END:VALARM\r\n';
        return g;
    }
}

module.exports = ICalAlarm;
