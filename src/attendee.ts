'use strict';


import {checkEnum, checkNameAndMail, escape} from './tools';
import ICalEvent from './event';


interface ICalInternalAttendeeData {
    name: string | null;
    email: string | null;
    mailto: string | null;
    status: ICalAttendeeStatus | null;
    role: ICalAttendeeRole;
    rsvp: boolean | null;
    type: ICalAttendeeType | null;
    delegatedTo: ICalAttendee | null;
    delegatedFrom: ICalAttendee | null;
}

export interface ICalAttendeeData {
    name?: string | null;
    email?: string | null;
    mailto?: string | null;
    status?: ICalAttendeeStatus | null;
    role?: ICalAttendeeRole;
    rsvp?: boolean | null;
    type?: ICalAttendeeType | null;
    delegatedTo?: ICalAttendee | ICalAttendeeData | string | null;
    delegatedFrom?: ICalAttendee | ICalAttendeeData | string | null;
    delegatesTo?: ICalAttendee | ICalAttendeeData | string | null;
    delegatesFrom?: ICalAttendee | ICalAttendeeData | string | null;
}

interface ICalAttendeeJSONData {
    name: string | null;
    email: string | null;
    mailto: string | null;
    status: ICalAttendeeStatus | null;
    role: ICalAttendeeRole;
    rsvp: boolean | null;
    type: ICalAttendeeType | null;
    delegatedTo: string | null;
    delegatedFrom: string | null;
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


export default class ICalAttendee {
    private readonly data: ICalInternalAttendeeData;
    private readonly event: ICalEvent;

    constructor(data: ICalAttendeeData, event: ICalEvent) {
        this.data = {
            name: null,
            email: null,
            mailto: null,
            status: null,
            role: ICalAttendeeRole.REQ,
            rsvp: null,
            type: null,
            delegatedTo: null,
            delegatedFrom: null
        };
        this.event = event;
        if (!this.event) {
            throw new Error('`event` option required!');
        }

        data.name && this.name(data.name);
        data.email && this.email(data.email);
        data.mailto && this.mailto(data.mailto);
        data.status && this.status(data.status);
        data.role && this.role(data.role);
        data.rsvp && this.rsvp(data.rsvp);
        data.type && this.type(data.type);
        data.delegatedTo && this.delegatedTo(data.delegatedTo);
        data.delegatedFrom && this.delegatedFrom(data.delegatedFrom);
        data.delegatesTo && this.delegatesTo(data.delegatesTo);
        data.delegatesFrom && this.delegatesFrom(data.delegatesFrom);
    }


    /**
     * Set/Get the attendee's name
     * @since 0.2.0
     */
    name(): string | null;
    name(name: string | null): this;
    name(name?: string | null): this | string | null {
        if (name === undefined) {
            return this.data.name;
        }

        this.data.name = name || null;
        return this;
    }


    /**
     * Set/Get the attendee's email address
     * @since 0.2.0
     */
    email(): string | null;
    email(email: string | null): this;
    email(email?: string | null): this | string | null {
        if (!email) {
            return this.data.email;
        }

        this.data.email = email;
        return this;
    }

    /**
     * Set/Get the attendee's email address
     * @since 1.3.0
     */
    mailto(): string | null;
    mailto(mailto: string | null): this;
    mailto(mailto?: string | null): this | string | null {
        if (mailto === undefined) {
            return this.data.mailto;
        }

        this.data.mailto = mailto || null;
        return this;
    }


    /**
     * Set/Get attendee's role
     * @since 0.2.0
     */
    role(): ICalAttendeeRole;
    role(role: ICalAttendeeRole): this;
    role(role?: ICalAttendeeRole): this | ICalAttendeeRole {
        if (role === undefined) {
            return this.data.role;
        }

        this.data.role = checkEnum(ICalAttendeeRole, role) as ICalAttendeeRole;
        return this;
    }


    /**
     * Set/Get attendee's RSVP expectation
     * @since 0.2.1
     */
    rsvp(): boolean | null;
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
     * Set/Get attendee's status
     *
     * @param {String} [status]
     * @since 0.2.0
     * @returns {ICalAttendee|String}
     */
    status(): ICalAttendeeStatus | null;
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
     * Set/Get attendee's type (a.k.a. CUTYPE)
     * @since 0.2.3
     */
    type(): ICalAttendeeType;
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
     * Set/Get the attendee's delegated-to field
     * @since 0.2.0
     */
    delegatedTo(): ICalAttendee | null;
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
                checkNameAndMail('delegatedTo', delegatedTo),
                this.event,
            );
        }
        else if(delegatedTo instanceof ICalAttendee) {
            this.data.delegatedTo = delegatedTo;
        }
        else {
            this.data.delegatedTo = new ICalAttendee(delegatedTo, this.event);
        }

        this.data.status = ICalAttendeeStatus.DELEGATED;
        return this;
    }


    /**
     * Set/Get the attendee's delegated-from field
     * @since 0.2.0
     */
    delegatedFrom (): ICalAttendee | null;
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
                checkNameAndMail('delegatedFrom', delegatedFrom),
                this.event,
            );
        }
        else if(delegatedFrom instanceof ICalAttendee) {
            this.data.delegatedFrom = delegatedFrom;
        }
        else {
            this.data.delegatedFrom = new ICalAttendee(delegatedFrom, this.event);
        }

        return this;
    }


    /**
     * Create a new attendee this attendee delegates to
     * and returns this new attendee
     *
     * @since 0.2.0
     */
    delegatesTo (options: ICalAttendee | ICalAttendeeData | string): ICalAttendee {
        const a = options instanceof ICalAttendee ? options : this.event.createAttendee(options);
        this.delegatedTo(a);
        a.delegatedFrom(this);
        return a;
    }


    /**
     * Create a new attendee this attendee delegates from
     * and returns this new attendee
     *
     * @since 0.2.0
     */
    delegatesFrom (options: ICalAttendee | ICalAttendeeData | string): ICalAttendee {
        const a = options instanceof ICalAttendee ? options : this.event.createAttendee(options);
        this.delegatedFrom(a);
        a.delegatedTo(this);
        return a;
    }


    /**
     * Export calender as JSON Object to use it later…
     * @since 0.2.4
     */
    toJSON(): ICalAttendeeJSONData {
        return Object.assign({}, this.data, {
            delegatedTo: this.data.delegatedTo?.email() || null,
            delegatedFrom: this.data.delegatedFrom?.email() || null
        });
    }


    /**
     * Export Event to iCal
     *
     * @since 0.2.0
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
        if (this.data.rsvp) {
            g += ';RSVP=' + this.data.rsvp.toString().toUpperCase();
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
            g += ';CN="' + escape(this.data.name) + '"';
        }

        // EMAIL
        if (this.data.email && this.data.mailto) {
            g += ';EMAIL=' + escape(this.data.email);
        }

        g += ':MAILTO:' + escape(this.data.mailto || this.data.email) + '\r\n';
        return g;
    }
}
