'use strict';


import {addOrGetCustomAttributes, checkEnum, checkNameAndMail, escape} from './tools.ts';
import ICalEvent from './event.ts';
import ICalAlarm from './alarm.ts';


interface ICalInternalAttendeeData {
    name: string | null;
    email: string;
    mailto: string | null;
    sentBy: string | null;
    status: ICalAttendeeStatus | null;
    role: ICalAttendeeRole;
    rsvp: boolean | null;
    type: ICalAttendeeType | null;
    delegatedTo: ICalAttendee | null;
    delegatedFrom: ICalAttendee | null;
    x: [string, string][];
}

export interface ICalAttendeeData {
    name?: string | null;
    email: string;
    mailto?: string | null;
    sentBy?: string | null;
    status?: ICalAttendeeStatus | null;
    role?: ICalAttendeeRole;
    rsvp?: boolean | null;
    type?: ICalAttendeeType | null;
    delegatedTo?: ICalAttendee | ICalAttendeeData | string | null;
    delegatedFrom?: ICalAttendee | ICalAttendeeData | string | null;
    delegatesTo?: ICalAttendee | ICalAttendeeData | string | null;
    delegatesFrom?: ICalAttendee | ICalAttendeeData | string | null;
    x?: {key: string, value: string}[] | [string, string][] | Record<string, string>;
}

export interface ICalAttendeeJSONData {
    name: string | null;
    email: string;
    mailto: string | null;
    sentBy: string | null;
    status: ICalAttendeeStatus | null;
    role: ICalAttendeeRole;
    rsvp: boolean | null;
    type: ICalAttendeeType | null;
    delegatedTo: string | null;
    delegatedFrom: string | null;
    x: {key: string, value: string}[];
}

export enum ICalAttendeeRole {
    CHAIR = 'CHAIR',
    REQ = 'REQ-PARTICIPANT',
    OPT = 'OPT-PARTICIPANT',
    NON = 'NON-PARTICIPANT'
}

export enum ICalAttendeeStatus {
    ACCEPTED = 'ACCEPTED',
    TENTATIVE = 'TENTATIVE',
    DECLINED = 'DECLINED',
    DELEGATED = 'DELEGATED',
    NEEDSACTION = 'NEEDS-ACTION'
}

// ref: https://tools.ietf.org/html/rfc2445#section-4.2.3
export enum ICalAttendeeType {
    INDIVIDUAL = 'INDIVIDUAL',
    GROUP = 'GROUP',
    RESOURCE = 'RESOURCE',
    ROOM = 'ROOM',
    UNKNOWN = 'UNKNOWN'
}


/**
 * Usually you get an {@link ICalAttendee} object like this:
 *
 * ```javascript
 * import ical from 'ical-generator';
 * const calendar = ical();
 * const event = calendar.createEvent();
 * const attendee = event.createAttendee({ email: 'mail@example.com' });
 * ```
 *
 * You can also use the {@link ICalAttendee} object directly:
 *
 * ```javascript
 * import ical, {ICalAttendee} from 'ical-generator';
 * const attendee = new ICalAttendee({ email: 'mail@example.com' });
 * event.attendees([attendee]);
 * ```
 */
export default class ICalAttendee {
    private readonly data: ICalInternalAttendeeData;
    private readonly parent: ICalEvent | ICalAlarm;

    /**
     * Constructor of {@link ICalAttendee}. The event reference is
     * required to query the calendar's timezone when required.
     *
     * @param data Attendee Data
     * @param parent Reference to ICalEvent object
     */
    constructor(data: ICalAttendeeData, parent: ICalEvent | ICalAlarm) {
        this.data = {
            name: null,
            email: '',
            mailto: null,
            sentBy: null,
            status: null,
            role: ICalAttendeeRole.REQ,
            rsvp: null,
            type: null,
            delegatedTo: null,
            delegatedFrom: null,
            x: []
        };
        this.parent = parent;
        if (!this.parent) {
            throw new Error('`event` option required!');
        }
        if (!data.email) {
            throw new Error('No value for `email` in ICalAttendee given!');
        }

        if (data.name !== undefined) this.name(data.name);
        if (data.email !== undefined) this.email(data.email);
        if (data.mailto !== undefined) this.mailto(data.mailto);
        if (data.sentBy !== undefined) this.sentBy(data.sentBy);
        if (data.status !== undefined) this.status(data.status);
        if (data.role !== undefined) this.role(data.role);
        if (data.rsvp !== undefined) this.rsvp(data.rsvp);
        if (data.type !== undefined) this.type(data.type);
        if (data.delegatedTo !== undefined) this.delegatedTo(data.delegatedTo);
        if (data.delegatedFrom !== undefined) this.delegatedFrom(data.delegatedFrom);
        if (data.delegatesTo) this.delegatesTo(data.delegatesTo);
        if (data.delegatesFrom) this.delegatesFrom(data.delegatesFrom);
        if (data.x !== undefined) this.x(data.x);
    }


    /**
     * Get the attendee's name
     * @since 0.2.0
     */
    name(): string | null;

    /**
     * Set the attendee's name
     * @since 0.2.0
     */
    name(name: string | null): this;
    name(name?: string | null): this | string | null {
        if (name === undefined) {
            return this.data.name;
        }

        this.data.name = name || null;
        return this;
    }


    /**
     * Get the attendee's email address
     * @since 0.2.0
     */
    email(): string;

    /**
     * Set the attendee's email address
     * @since 0.2.0
     */
    email(email: string): this;
    email(email?: string): this | string {
        if (!email) {
            return this.data.email;
        }

        this.data.email = email;
        return this;
    }

    /**
     * Get the attendee's email address
     * @since 1.3.0
     */
    mailto(): string | null;

    /**
     * Set the attendee's email address
     * @since 1.3.0
     */
    mailto(mailto: string | null): this;
    mailto(mailto?: string | null): this | string | null {
        if (mailto === undefined) {
            return this.data.mailto;
        }

        this.data.mailto = mailto || null;
        return this;
    }


    /**
     * Get the acting user's email adress
     * @since 3.3.0
     */
    sentBy(): string | null;

    /**
     * Set the acting user's email adress
     * @since 3.3.0
     */
    sentBy(email: string | null): this;
    sentBy(email?: string | null): this | string | null {
        if (!email) {
            return this.data.sentBy;
        }

        this.data.sentBy = email;
        return this;
    }


    /**
     * Get attendee's role
     * @since 0.2.0
     */
    role(): ICalAttendeeRole;

    /**
     * Set the attendee's role, defaults to `REQ` / `REQ-PARTICIPANT`.
     * Checkout {@link ICalAttendeeRole} for available roles.
     *
     * @since 0.2.0
     */
    role(role: ICalAttendeeRole): this;
    role(role?: ICalAttendeeRole): this | ICalAttendeeRole {
        if (role === undefined) {
            return this.data.role;
        }

        this.data.role = checkEnum(ICalAttendeeRole, role) as ICalAttendeeRole;
        return this;
    }


    /**
     * Get attendee's RSVP expectation
     * @since 0.2.1
     */
    rsvp(): boolean | null;

    /**
     * Set the attendee's RSVP expectation
     * @since 0.2.1
     */
    rsvp(rsvp: boolean | null): this;
    rsvp(rsvp?: boolean | null): this | boolean | null {
        if (rsvp === undefined) {
            return this.data.rsvp;
        }
        if (rsvp === null) {
            this.data.rsvp = null;
            return this;
        }

        this.data.rsvp = Boolean(rsvp);
        return this;
    }


    /**
     * Get attendee's status
     * @since 0.2.0
     */
    status(): ICalAttendeeStatus | null;

    /**
     * Set the attendee's status. See {@link ICalAttendeeStatus}
     * for available status options.
     *
     * @since 0.2.0
     */
    status(status: ICalAttendeeStatus | null): this;
    status(status?: ICalAttendeeStatus | null): this | ICalAttendeeStatus | null {
        if (status === undefined) {
            return this.data.status;
        }
        if (!status) {
            this.data.status = null;
            return this;
        }

        this.data.status = checkEnum(ICalAttendeeStatus, status) as ICalAttendeeStatus;
        return this;
    }


    /**
     * Get attendee's type (a.k.a. CUTYPE)
     * @since 0.2.3
     */
    type(): ICalAttendeeType;

    /**
     * Set attendee's type (a.k.a. CUTYPE).
     * See {@link ICalAttendeeType} for available status options.
     *
     * @since 0.2.3
     */
    type(type: ICalAttendeeType | null): this;
    type(type?: ICalAttendeeType | null): this | ICalAttendeeType | null {
        if (type === undefined) {
            return this.data.type;
        }
        if (!type) {
            this.data.type = null;
            return this;
        }

        this.data.type = checkEnum(ICalAttendeeType, type) as ICalAttendeeType;
        return this;
    }


    /**
     * Get the attendee's delegated-to value.
     * @since 0.2.0
     */
    delegatedTo(): ICalAttendee | null;

    /**
     * Set the attendee's delegated-to field.
     *
     * Creates a new Attendee if the passed object is not already a
     * {@link ICalAttendee} object. Will set the `delegatedTo` and
     * `delegatedFrom` attributes.
     *
     * Will also set the `status` to `DELEGATED`, if attribute is set.
     *
     * ```javascript
     * const cal = ical();
     * const event = cal.createEvent();
     * const attendee = cal.createAttendee();
     *
     * attendee.delegatesTo({email: 'foo@bar.com', name: 'Foo'});
     ```
     *
     * @since 0.2.0
     */
    delegatedTo(delegatedTo: ICalAttendee | ICalAttendeeData | string | null): this;
    delegatedTo(delegatedTo?: ICalAttendee | ICalAttendeeData | string | null): this | ICalAttendee | null {
        if (delegatedTo === undefined) {
            return this.data.delegatedTo;
        }
        if (!delegatedTo) {
            this.data.delegatedTo = null;
            if (this.data.status === ICalAttendeeStatus.DELEGATED) {
                this.data.status = null;
            }
            return this;
        }

        if(typeof delegatedTo === 'string') {
            this.data.delegatedTo = new ICalAttendee(
                { email: delegatedTo, ...checkNameAndMail('delegatedTo', delegatedTo) },
                this.parent,
            );
        }
        else if(delegatedTo instanceof ICalAttendee) {
            this.data.delegatedTo = delegatedTo;
        }
        else {
            this.data.delegatedTo = new ICalAttendee(delegatedTo, this.parent);
        }

        this.data.status = ICalAttendeeStatus.DELEGATED;
        return this;
    }


    /**
     * Get the attendee's delegated-from field
     * @since 0.2.0
     */
    delegatedFrom (): ICalAttendee | null;

    /**
     * Set the attendee's delegated-from field
     *
     * Creates a new Attendee if the passed object is not already a
     * {@link ICalAttendee} object. Will set the `delegatedTo` and
     * `delegatedFrom` attributes.
     *
     * @param delegatedFrom
     */
    delegatedFrom (delegatedFrom: ICalAttendee | ICalAttendeeData | string | null): this;
    delegatedFrom(delegatedFrom?: ICalAttendee | ICalAttendeeData | string | null): this | ICalAttendee | null {
        if (delegatedFrom === undefined) {
            return this.data.delegatedFrom;
        }

        if (!delegatedFrom) {
            this.data.delegatedFrom = null;
        }
        else if(typeof delegatedFrom === 'string') {
            this.data.delegatedFrom = new ICalAttendee(
                { email: delegatedFrom, ...checkNameAndMail('delegatedFrom', delegatedFrom) },
                this.parent,
            );
        }
        else if(delegatedFrom instanceof ICalAttendee) {
            this.data.delegatedFrom = delegatedFrom;
        }
        else {
            this.data.delegatedFrom = new ICalAttendee(delegatedFrom, this.parent);
        }

        return this;
    }


    /**
     * Create a new attendee this attendee delegates to and returns
     * this new attendee. Creates a new attendee if the passed object
     * is not already an {@link ICalAttendee}.
     *
     * ```javascript
     * const cal = ical();
     * const event = cal.createEvent();
     * const attendee = cal.createAttendee();
     *
     * attendee.delegatesTo({email: 'foo@bar.com', name: 'Foo'});
     * ```
     *
     * @since 0.2.0
     */
    delegatesTo (options: ICalAttendee | ICalAttendeeData | string): ICalAttendee {
        const a = options instanceof ICalAttendee ? options : this.parent.createAttendee(options);
        this.delegatedTo(a);
        a.delegatedFrom(this);
        return a;
    }


    /**
     * Create a new attendee this attendee delegates from and returns
     * this new attendee. Creates a new attendee if the passed object
     * is not already an {@link ICalAttendee}.
     *
     * ```javascript
     * const cal = ical();
     * const event = cal.createEvent();
     * const attendee = cal.createAttendee();
     *
     * attendee.delegatesFrom({email: 'foo@bar.com', name: 'Foo'});
     * ```
     *
     * @since 0.2.0
     */
    delegatesFrom (options: ICalAttendee | ICalAttendeeData | string): ICalAttendee {
        const a = options instanceof ICalAttendee ? options : this.parent.createAttendee(options);
        this.delegatedFrom(a);
        a.delegatedTo(this);
        return a;
    }

    /**
     * Set X-* attributes. Woun't filter double attributes,
     * which are also added by another method (e.g. status),
     * so these attributes may be inserted twice.
     *
     * ```javascript
     * attendee.x([
     *     {
     *         key: "X-MY-CUSTOM-ATTR",
     *         value: "1337!"
     *     }
     * ]);
     *
     * attendee.x([
     *     ["X-MY-CUSTOM-ATTR", "1337!"]
     * ]);
     *
     * attendee.x({
     *     "X-MY-CUSTOM-ATTR": "1337!"
     * });
     * ```
     *
     * @since 1.9.0
     */
    x (keyOrArray: {key: string, value: string}[] | [string, string][] | Record<string, string>): this;

    /**
     * Set a X-* attribute. Woun't filter double attributes,
     * which are also added by another method (e.g. status),
     * so these attributes may be inserted twice.
     *
     * ```javascript
     * attendee.x("X-MY-CUSTOM-ATTR", "1337!");
     * ```
     *
     * @since 1.9.0
     */
    x (keyOrArray: string, value: string): this;

    /**
     * Get all custom X-* attributes.
     * @since 1.9.0
     */
    x (): {key: string, value: string}[];
    x (keyOrArray?: ({key: string, value: string})[] | [string, string][] | Record<string, string> | string, value?: string): this | void | ({key: string, value: string})[] {
        if(keyOrArray === undefined) {
            return addOrGetCustomAttributes (this.data);
        }

        if(typeof keyOrArray === 'string' && typeof value === 'string') {
            addOrGetCustomAttributes (this.data, keyOrArray, value);
        }
        else if(typeof keyOrArray === 'object') {
            addOrGetCustomAttributes (this.data, keyOrArray);
        }
        else {
            throw new Error('Either key or value is not a string!');
        }

        return this;
    }


    /**
     * Return a shallow copy of the attendee's options for JSON stringification.
     * Can be used for persistence.
     *
     * @since 0.2.4
     */
    toJSON(): ICalAttendeeJSONData {
        return Object.assign({}, this.data, {
            delegatedTo: this.data.delegatedTo?.email() || null,
            delegatedFrom: this.data.delegatedFrom?.email() || null,
            x: this.x()
        });
    }


    /**
     * Return generated attendee as a string.
     *
     * ```javascript
     * console.log(attendee.toString()); // → ATTENDEE;ROLE=…
     * ```
     */
    toString (): string {
        let g = 'ATTENDEE';

        if (!this.data.email) {
            throw new Error('No value for `email` in ICalAttendee given!');
        }

        // ROLE
        g += ';ROLE=' + this.data.role;

        // TYPE
        if (this.data.type) {
            g += ';CUTYPE=' + this.data.type;
        }

        // PARTSTAT
        if (this.data.status) {
            g += ';PARTSTAT=' + this.data.status;
        }

        // RSVP
        if (this.data.rsvp !== null) {
            g += ';RSVP=' + this.data.rsvp.toString().toUpperCase();
        }

        // SENT-BY
        if (this.data.sentBy !== null) {
            g += ';SENT-BY="mailto:' + this.data.sentBy + '"';
        }

        // DELEGATED-TO
        if (this.data.delegatedTo) {
            g += ';DELEGATED-TO="' + this.data.delegatedTo.email() + '"';
        }

        // DELEGATED-FROM
        if (this.data.delegatedFrom) {
            g += ';DELEGATED-FROM="' + this.data.delegatedFrom.email() + '"';
        }

        // CN / Name
        if (this.data.name) {
            g += ';CN="' + escape(this.data.name, true) + '"';
        }

        // EMAIL
        if (this.data.email && this.data.mailto) {
            g += ';EMAIL=' + escape(this.data.email, false);
        }

        // CUSTOM X ATTRIBUTES
        if(this.data.x.length) {
            g += ';' + this.data.x
                .map(([key, value]) => key.toUpperCase() + '=' + escape(value, false))
                .join(';');
        }

        g += ':MAILTO:' + escape(this.data.mailto || this.data.email, false) + '\r\n';

        return g;
    }
}
