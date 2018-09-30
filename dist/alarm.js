'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var moment = require('moment-timezone');
var ICalTools = require('./_tools');

/**
 * @author Sebastian Pekarek
 * @module ical-generator
 * @class ICalAlarm
 */

var ICalAlarm = function () {
    function ICalAlarm(data, event) {
        _classCallCheck(this, ICalAlarm);

        this._data = {
            type: null,
            trigger: null,
            repeat: null,
            repeatInterval: null,
            attach: null,
            description: null
        };
        this._attributes = ['type', 'trigger', 'triggerBefore', 'triggerAfter', 'repeat', 'interval', 'attach', 'description'];
        this._vars = {
            types: ['display', 'audio']
        };

        this._event = event;
        if (!event) {
            throw new Error('`event` option required!');
        }

        for (var i in data) {
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


    _createClass(ICalAlarm, [{
        key: 'type',
        value: function type(_type) {
            if (_type === undefined) {
                return this._data.type;
            }
            if (!_type) {
                this._data.type = null;
                return this;
            }

            if (this._vars.types.indexOf(_type) === -1) {
                throw new Error('`type` is not correct, must be either `display` or `audio`!');
            }

            this._data.type = _type;
            return this;
        }

        /**
         * Set/Get seconds before event to trigger alarm
         *
         * @param {Number|moment|Date} [trigger] Seconds before alarm triggeres
         * @since 0.2.1
         * @returns {ICalAlarm|Number|moment}
         */

    }, {
        key: 'trigger',
        value: function trigger(_trigger) {
            if (_trigger === undefined && this._data.trigger instanceof moment) {
                return this._data.trigger;
            }
            if (_trigger === undefined && this._data.trigger) {
                return -1 * this._data.trigger;
            }
            if (_trigger === undefined) {
                return null;
            }

            if (!_trigger) {
                this._data.trigger = null;
                return this;
            }
            if (_trigger instanceof Date) {
                this._data.trigger = moment(_trigger);
                return this;
            }
            if (moment.isMoment(_trigger)) {
                this._data.trigger = _trigger;
                return this;
            }
            if (moment.isDuration(_trigger)) {
                this._data.trigger = -1 * _trigger.as('seconds');
                return this;
            }
            if (typeof _trigger === 'number' && isFinite(_trigger)) {
                this._data.trigger = -1 * _trigger;
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

    }, {
        key: 'triggerAfter',
        value: function triggerAfter(trigger) {
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

    }, {
        key: 'triggerBefore',
        value: function triggerBefore(trigger) {
            return this.trigger(trigger);
        }

        /**
         * Set/Get Alarm Repetitions
         *
         * @param {Number} [repeat] Number of repetitions
         * @since 0.2.1
         * @returns {ICalAlarm|Number}
         */

    }, {
        key: 'repeat',
        value: function repeat(_repeat) {
            if (_repeat === undefined) {
                return this._data.repeat;
            }
            if (!_repeat) {
                this._data.repeat = null;
                return this;
            }

            if (typeof _repeat !== 'number' || !isFinite(_repeat)) {
                throw new Error('`repeat` is not correct, must be numeric!');
            }

            this._data.repeat = _repeat;
            return this;
        }

        /**
         * Set/Get Repeat Interval
         *
         * @param {Number} [interval] Interval in seconds
         * @since 0.2.1
         * @returns {ICalAlarm|Number|Null}
         */

    }, {
        key: 'interval',
        value: function interval(_interval) {
            if (_interval === undefined) {
                return this._data.interval;
            }
            if (!_interval) {
                this._data.interval = null;
                return this;
            }

            if (typeof _interval !== 'number' || !isFinite(_interval)) {
                throw new Error('`interval` is not correct, must be numeric!');
            }

            this._data.interval = _interval;
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

    }, {
        key: 'attach',
        value: function attach(_attach2) {
            if (_attach2 === undefined) {
                return this._data.attach;
            }
            if (!_attach2) {
                this._data.attach = null;
                return this;
            }

            var _attach = null;
            if (typeof _attach2 === 'string') {
                _attach = {
                    uri: _attach2,
                    mime: null
                };
            } else if ((typeof _attach2 === 'undefined' ? 'undefined' : _typeof(_attach2)) === 'object') {
                _attach = {
                    uri: _attach2.uri,
                    mime: _attach2.mime || null
                };
            } else {
                throw new Error('`attach` needs to be a valid formed string or an object. See https://github.com/sebbo2002/ical-' + 'generator#attachstringobject-attach');
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

    }, {
        key: 'description',
        value: function description(_description) {
            if (_description === undefined) {
                return this._data.description;
            }
            if (!_description) {
                this._data.description = null;
                return this;
            }

            this._data.description = _description;
            return this;
        }

        /**
         * Export calender as JSON Object to use it later…
         *
         * @since 0.2.4
         * @returns {Object}
         */

    }, {
        key: 'toJSON',
        value: function toJSON() {
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

    }, {
        key: '_generate',
        value: function _generate() {
            var g = 'BEGIN:VALARM\r\n';

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
            } else if (this._data.trigger > 0) {
                g += 'TRIGGER;RELATED=END:' + moment.duration(this._data.trigger, 's').toISOString() + '\r\n';
            } else {
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
            } else if (this._data.type === 'audio' && this._data.attach) {
                g += 'ATTACH;VALUE=URI:' + this._data.attach.uri + '\r\n';
            } else if (this._data.type === 'audio') {
                g += 'ATTACH;VALUE=URI:Basso\r\n';
            }

            // DESCRIPTION
            if (this._data.type === 'display' && this._data.description) {
                g += 'DESCRIPTION:' + ICalTools.escape(this._data.description) + '\r\n';
            } else if (this._data.type === 'display') {
                g += 'DESCRIPTION:' + ICalTools.escape(this._event.summary()) + '\r\n';
            }

            g += 'END:VALARM\r\n';
            return g;
        }
    }]);

    return ICalAlarm;
}();

module.exports = ICalAlarm;