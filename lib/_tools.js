'use strict';

module.exports = {};

module.exports.formatDate = function formatDate(d, dateonly, floating) {
    var s;

    function pad(i) {
        return (i < 10 ? '0' : '') + i;
    }

    s = d.getUTCFullYear();
    s += pad(d.getUTCMonth() + 1);
    s += pad(d.getUTCDate());

    if(!dateonly) {
        s += 'T';
        s += pad(d.getUTCHours());
        s += pad(d.getUTCMinutes());
        s += pad(d.getUTCSeconds());

        if(!floating) {
            s += 'Z';
        }
    }

    return s;
};

// For information about this format, see RFC 5545, section 3.3.5
// https://tools.ietf.org/html/rfc5545#section-3.3.5
module.exports.formatDateTZ = function formatDateTZ(property, date, eventData) {
    var tzParam = '';
    var floating = eventData.floating;

    if(eventData.timezone) {
        tzParam = ';TZID=' + eventData.timezone;

        // This isn't a 'floating' event because it has a timezone;
        // but we use it to omit the 'Z' UTC specifier in formatDate()
        floating = true;
    }

    return property + tzParam + ':' + module.exports.formatDate(date, false, floating);
};

module.exports.escape = function escape(str) {
    return str.replace(/[\\;,"]/g, function(match) {
        return '\\' + match;
    }).replace(/(?:\r\n|\r|\n)/g, '\\n');
};

module.exports.duration = function duration(seconds) {
    var string = '';

    // < 0
    if(seconds < 0) {
        string = '-';
        seconds *= -1;
    }

    string += 'P';

    // DAYS
    if(seconds >= 86400) {
        string += Math.floor(seconds / 86400) + 'D';
        seconds %= 86400;
    }
    if(!seconds && string.length > 1) {
        return string;
    }

    string += 'T';

    // HOURS
    if(seconds >= 3600) {
        string += Math.floor(seconds / 3600) + 'H';
        seconds %= 3600;
    }

    // MINUTES
    if(seconds >= 60) {
        string += Math.floor(seconds / 60) + 'M';
        seconds %= 60;
    }

    // SECONDS
    if(seconds > 0) {
        string += seconds + 'S';
    }
    else if(string.length <= 2) {
        string += '0S';
    }

    return string;
};

module.exports.toJSON = function(object, attributes, options) {
    var result = {};
    options = options || {};
    options.ignoreAttributes = options.ignoreAttributes || [];
    options.hooks = options.hooks || {};

    attributes.forEach(function(attribute) {
        if(options.ignoreAttributes.indexOf(attribute) !== -1) {
            return;
        }

        var value = object[attribute]();
        if(options.hooks[attribute]) {
            value = options.hooks[attribute](value);
        }
        if(!value) {
            return;
        }

        result[attribute] = value;

        if(Array.isArray(result[attribute])) {
            var newObj = [];
            result[attribute].forEach(function(object) {
                newObj.push(object.toJSON());
            });
            result[attribute] = newObj;
        }
    });

    return result;
};