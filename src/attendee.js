'use strict';


const ICalTools = require('./_tools');


/**
 * @author Sebastian Pekarek
 * @module ical-generator
 * @class ICalAttendee
 */
class ICalAttendee {
    constructor (data, event) {
        this._data = {
            name: null,
            email: null,
            mailto: null,
            status: null,
            role: 'REQ-PARTICIPANT',
            rsvp: null,
            type: null,
            delegatedTo: null,
            delegatedFrom: null
        };
        this._attributes = [
            'name',
            'email',
            'mailto',
            'role',
            'rsvp',
            'status',
            'type',
            'delegatedTo',
            'delegatedFrom',
            'delegatesFrom',
            'delegatesTo'
        ];
        this._vars = {
            allowed: {
                role: ['CHAIR', 'REQ-PARTICIPANT', 'OPT-PARTICIPANT', 'NON-PARTICIPANT'],
                rsvp: ['TRUE', 'FALSE'],
                status: ['ACCEPTED', 'TENTATIVE', 'DECLINED', 'DELEGATED', 'NEEDS-ACTION'],
                type: ['INDIVIDUAL', 'GROUP', 'RESOURCE', 'ROOM', 'UNKNOWN'] // ref: https://tools.ietf.org/html/rfc2445#section-4.2.3
            }
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
     * Checks if the given string `str` is a valid one for category `type`
     *
     * @param {String} type
     * @param {String} str
     * @returns {string}
     * @private
     */
    _getAllowedStringFor (type, str) {
        if (!str || typeof (str) !== 'string') {
            throw new Error('Input for `' + type + '` must be a non-empty string. You gave ' + str);
        }

        str = str.toUpperCase();

        if (this._vars.allowed[type].indexOf(str) === -1) {
            throw new Error('`' + type + '` must be one of the following: ' + this._vars.allowed[type].join(', ') + '!');
        }

        return str;
    }


    /**
     * Set/Get the attendee's name
     *
     * @param {String} [name] Name
     * @since 0.2.0
     * @returns {ICalAttendee|String}
     */
    name (name) {
        if (name === undefined) {
            return this._data.name;
        }

        this._data.name = name || null;
        return this;
    }


    /**
     * Set/Get the attendee's email address
     *
     * @param {String} [email] Email address
     * @since 0.2.0
     * @returns {ICalAttendee|String}
     */
    email (email) {
        if (!email) {
            return this._data.email;
        }

        this._data.email = email;
        return this;
    }

    /**
     * Set/Get the attendee's email address
     *
     * @param {String} [mailto] Email address
     * @since 1.3.0 TODO: set correct version number
     * @returns {ICalAttendee|String}
     */
    mailto (mailto) {
        if (mailto === undefined) {
            return this._data.mailto;
        }

        this._data.mailto = mailto || null;
        return this;
    }


    /**
     * Set/Get attendee's role
     *
     * @param {String} role
     * @since 0.2.0
     * @returns {ICalAttendee|String}
     */
    role (role) {
        if (role === undefined) {
            return this._data.role;
        }

        this._data.role = this._getAllowedStringFor('role', role);
        return this;
    }


    /**
     * Set/Get attendee's RSVP expectation
     *
     * @param {String} rsvp
     * @since 0.2.1
     * @returns {ICalAttendee|String}
     */
    rsvp (rsvp) {
        if (rsvp === undefined) {
            return this._data.rsvp;
        }
        if (rsvp === null) {
            this._data.rsvp = null;
            return this;
        }

        if (rsvp === true) {
            rsvp = 'true';
        }
        if (rsvp === false) {
            rsvp = 'false';
        }

        this._data.rsvp = this._getAllowedStringFor('rsvp', rsvp);
        return this;
    }


    /**
     * Set/Get attendee's status
     *
     * @param {String} [status]
     * @since 0.2.0
     * @returns {ICalAttendee|String}
     */
    status (status) {
        if (status === undefined) {
            return this._data.status;
        }
        if (!status) {
            this._data.status = null;
            return this;
        }

        this._data.status = this._getAllowedStringFor('status', status);
        return this;
    }


    /**
     * Set/Get attendee's type (a.k.a. CUTYPE)
     *
     * @param {String} [type]
     * @since 0.2.3
     * @returns {ICalAttendee|String}
     */
    type (type) {
        if (type === undefined) {
            return this._data.type;
        }
        if (!type) {
            this._data.type = null;
            return this;
        }

        this._data.type = this._getAllowedStringFor('type', type);
        return this;
    }


    /**
     * Set/Get the attendee's delegated-to field
     *
     * @param {String} [delegatedTo] Email address
     * @since 0.2.0
     * @returns {ICalAttendee|String}
     */
    delegatedTo (delegatedTo) {
        if (delegatedTo === undefined) {
            return this._data.delegatedTo;
        }
        if (!delegatedTo) {
            this._data.delegatedTo = null;
            if (this._data.status === 'DELEGATED') {
                this._data.status = null;
            }
            return this;
        }

        this._data.delegatedTo = delegatedTo;
        this._data.status = 'DELEGATED';
        return this;
    }


    /**
     * Set/Get the attendee's delegated-from field
     *
     * @param {String} [delegatedFrom] Email address
     * @since 0.2.0
     * @returns {ICalAttendee|String}
     */
    delegatedFrom (delegatedFrom) {
        if (delegatedFrom === undefined) {
            return this._data.delegatedFrom;
        }

        this._data.delegatedFrom = delegatedFrom || null;
        return this;
    }


    /**
     * Create a new attendee this attendee delegates to
     * and returns this new attendee
     *
     * @param {String|Object|ICalAttendee} Attendee options
     * @see ICalEvent.createAttendee
     * @since 0.2.0
     * @returns {ICalAttendee}
     */
    delegatesTo (options) {
        const a = this._event.createAttendee(options);
        this.delegatedTo(a);
        a.delegatedFrom(this);
        return a;
    }


    /**
     * Create a new attendee this attendee delegates from
     * and returns this new attendee
     *
     * @param {String|Object|ICalAttendee} Attendee options
     * @see ICalEvent.createAttendee
     * @since 0.2.0
     * @returns {ICalAttendee}
     */
    delegatesFrom (options) {
        const a = this._event.createAttendee(options);
        this.delegatedFrom(a);
        a.delegatedTo(this);
        return a;
    }


    /**
     * Export calender as JSON Object to use it later…
     *
     * @since 0.2.4
     * @returns {Object} Calendar
     */
    toJSON () {
        return ICalTools.toJSON(this, this._attributes, {
            ignoreAttributes: ['delegatesTo', 'delegatesFrom'],
            hooks: {
                delegatedTo: value => value instanceof ICalAttendee ? value.email() : value,
                delegatedFrom: value => value instanceof ICalAttendee ? value.email() : value
            }
        });
    }


    /**
     * Export Event to iCal
     *
     * @since 0.2.0
     * @returns {String}
     */
    _generate () {
        let g = 'ATTENDEE';

        if (!this._data.email) {
            throw new Error('No value for `email` in ICalAttendee given!');
        }

        // ROLE
        g += ';ROLE=' + this._data.role;

        // TYPE
        if (this._data.type) {
            g += ';CUTYPE=' + this._data.type;
        }

        // PARTSTAT
        if (this._data.status) {
            g += ';PARTSTAT=' + this._data.status;
        }

        // RSVP
        if (this._data.rsvp) {
            g += ';RSVP=' + this._data.rsvp;
        }

        // DELEGATED-TO
        if (this._data.delegatedTo) {
            g += ';DELEGATED-TO="' + (this._data.delegatedTo instanceof ICalAttendee ? this._data.delegatedTo.email() : this._data.delegatedTo) + '"';
        }

        // DELEGATED-FROM
        if (this._data.delegatedFrom) {
            g += ';DELEGATED-FROM="' + (this._data.delegatedFrom instanceof ICalAttendee ? this._data.delegatedFrom.email() : this._data.delegatedFrom) + '"';
        }

        // CN / Name
        if (this._data.name) {
            g += ';CN="' + ICalTools.escape(this._data.name) + '"';
        }

        // EMAIL
        if (this._data.email && this._data.mailto) {
            g += ';EMAIL=' + ICalTools.escape(this._data.email);
        }

        g += ':MAILTO:' + ICalTools.escape(this._data.mailto || this._data.email) + '\r\n';
        return g;
    }
}

module.exports = ICalAttendee;