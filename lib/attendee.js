'use strict';


/**
 * @author Sebastian Pekarek
 * @module attendee
 * @constructor ICalAttendee Attendee
 */
var ICalAttendee = function(_data, event) {
    var attributes = ['name', 'email', 'role', 'status', 'type', 'delegatedTo', 'delegatedFrom', 'delegatesFrom', 'delegatesTo'],
        vars,
        i,
        data;

    if(!event) {
        throw '`event` option required!';
    }

    vars = {
        allowed: {
            role: ['REQ-PARTICIPANT', 'NON-PARTICIPANT'],
            status: ['ACCEPTED', 'TENTATIVE', 'DECLINED', 'DELEGATED'],
            type: ['INDIVIDUAL', 'GROUP', 'RESOURCE', 'ROOM', 'UNKNOWN'] // ref: https://tools.ietf.org/html/rfc2445#section-4.2.3
        }
    };

    data = {
        name: null,
        email: null,
        status: null,
        role: 'REQ-PARTICIPANT',
        type: null,
        delegatedTo: null,
        delegatedFrom: null
    };


    function getAllowedRole(str) {
        return getAllowedStringFor('role', str);
    }

    function getAllowedStatus(str) {
        return getAllowedStringFor('status', str);
    }

    function getAllowedType(str) {
        return getAllowedStringFor('type', str);
    }

    function getAllowedStringFor(type, str) {
        if(!str || typeof(str) !== 'string') {
            throw new Error('Input for `' + type + '` must be a non-empty string. You gave ' + str);
        }

        str = str.toUpperCase();

        if(vars.allowed[type].indexOf(str) === -1) {
            throw new Error('`' + type + '` must be one of the following: ' + vars.allowed[type].join(', ') + '!');
        }

        return str;
    }


    /**
     * Set/Get the attendee's name
     *
     * @param name Name
     * @since 0.2.0
     * @returns {ICalAttendee|String}
     */
    this.name = function(name) {
        if(!name) {
            return data.name;
        }

        data.name = name;
        return this;
    };


    /**
     * Set/Get the attendee's email address
     *
     * @param email Email address
     * @since 0.2.0
     * @returns {ICalAttendee|String}
     */
    this.email = function(email) {
        if(!email) {
            return data.email;
        }

        data.email = email;
        return this;
    };


    /**
     * Set/Get attendee's role
     *
     * @param {String} role
     * @since 0.2.0
     * @returns {ICalAttendee|String}
     */
    this.role = function(role) {
        if(role === undefined) {
            return data.role;
        }

        data.role = getAllowedRole(role);
        return this;
    };


    /**
     * Set/Get attendee's status
     *
     * @param {String} status
     * @since 0.2.0
     * @returns {ICalAttendee|String}
     */
    this.status = function(status) {
        if(status === undefined) {
            return data.status;
        }

        data.status = getAllowedStatus(status);
        return this;
    };


    /**
     * Set/Get attendee's type (a.k.a. CUTYPE)
     *
     * @param {String} type
     * @since 0.2.3
     * @returns {ICalAttendee|String}
     */
    this.type = function(type) {
        if(type === undefined) {
            return data.type;
        }
        data.type = getAllowedType(type);
        return this;
    };


    /**
     * Set/Get the attendee's delegated-to field
     *
     * @param delegatedTo Email address
     * @since 0.2.0
     * @returns {ICalAttendee|String}
     */
    this.delegatedTo = function(delegatedTo) {
        if(!delegatedTo) {
            return data.delegatedTo;
        }

        data.delegatedTo = delegatedTo;
        data.status = 'DELEGATED';
        return this;
    };


    /**
     * Set/Get the attendee's delegated-from field
     *
     * @param delegatedFrom Email address
     * @since 0.2.0
     * @returns {ICalAttendee|String}
     */
    this.delegatedFrom = function(delegatedFrom) {
        if(!delegatedFrom) {
            return data.delegatedFrom;
        }

        data.delegatedFrom = delegatedFrom;
        return this;
    };


    /**
     * Create a new attendee this attendee delegates to
     * and returns this new attendee
     *
     * @param {Object} options
     * @since 0.2.0
     * @returns {ICalAttendee}
     */
    this.delegatesTo = function(options) {
        var a = options instanceof ICalAttendee ? options : event.createAttendee(options);
        this.delegatedTo(a);
        a.delegatedFrom(this);
        return a;
    };


    /**
     * Create a new attendee this attendee delegates from
     * and returns this new attendee
     *
     * @param {Object} options
     * @since 0.2.0
     * @returns {ICalAttendee}
     */
    this.delegatesFrom = function(options) {
        var a = options instanceof ICalAttendee ? options : event.createAttendee(options);
        this.delegatedFrom(a);
        a.delegatedTo(this);
        return a;
    };


    /**
     * Export calender as JSON Object to use it later…
     *
     * @since 0.2.4
     * @returns Object Calendar
     */
    this.toJSON = function() {
        var tools = require('./_tools.js');
        return tools.toJSON(this, attributes, {
            ignoreAttributes: ['delegatesTo', 'delegatesFrom'],
            hooks: {
                delegatedTo: function(value) {
                    return (value instanceof ICalAttendee ? value.email() : value);
                },
                delegatedFrom: function(value) {
                    return (value instanceof ICalAttendee ? value.email() : value);
                }
            }
        });
    };


    /**
     * Export Event to iCal
     *
     * @since 0.2.0
     * @returns {String}
     */
    this.generate = function() {
        var g = 'ATTENDEE';

        if(!data.email) {
            throw 'No value for `email` in ICalAttendee given!';
        }

        // ROLE
        g += ';ROLE=' + data.role;

        // TYPE
        if(data.type) {
            g += ';CUTYPE=' + data.type;
        }

        // PARTSTAT
        if(data.status) {
            g += ';PARTSTAT=' + data.status;
        }

        // DELEGATED-TO
        if(data.delegatedTo) {
            g += ';DELEGATED-TO="' + (data.delegatedTo instanceof ICalAttendee ? data.delegatedTo.email() : data.delegatedTo) + '"';
        }

        // DELEGATED-FROM
        if(data.delegatedFrom) {
            g += ';DELEGATED-FROM="' + (data.delegatedFrom instanceof ICalAttendee ? data.delegatedFrom.email() : data.delegatedFrom) + '"';
        }

        // CN / Name
        if(data.name) {
            g += ';CN="' + data.name + '"';
        }

        g += ':MAILTO:' + data.email + '\r\n';
        return g;
    };


    for(i in _data) {
        if(_data.hasOwnProperty(i) && attributes.indexOf(i) > -1) {
            this[i](_data[i]);
        }
    }
};

module.exports = ICalAttendee;
