'use strict';


const ICalTools = require('./_tools');


/**
 * @author Sebastian Pekarek
 * @module ical-generator
 * @class ICalCategory
 */
class ICalCategory {
    constructor (data, event) {
        this._data = {
            name: null
        };
        this._attributes = [
            'name'
        ];

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
     * Set/Get the category name
     *
     * @param name Name
     * @since 0.3.0
     * @returns {ICalCategory|String}
     */
    name (name) {
        if (name === undefined) {
            return this._data.name;
        }
        if (!name) {
            this._data.name = null;
            return this;
        }

        this._data.name = name;
        return this;
    }


    /**
     * Export calender as JSON Object to use it later…
     *
     * @since 0.2.4
     * @returns {Object}
     */
    toJSON () {
        return ICalTools.toJSON(this, this._attributes);
    }


    /**
     * Export Event to iCal
     *
     * @since 0.2.0
     * @returns {String}
     */
    _generate () {

        // CN / Name
        if (!this._data.name) {
            throw new Error('No value for `name` in ICalCategory given!');
        }

        return ICalTools.escape(this._data.name);
    }
}

module.exports = ICalCategory;
