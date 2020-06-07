/// <reference types="node" />

declare module 'ical-generator' {
  /** Imports must be inside the module declaration */
  import * as moment from 'moment';
  import * as http from 'http';

  /**
   * Tool for generating iCal calendar data
   * Exports a function that can be used to generate a calendar object
   */
  function ICalGenerator(data?: ICalGenerator.CalendarData): ICalGenerator.ICalCalendar;

  namespace ICalGenerator {
    type method = 'PUBLISH' | 'REQUEST' | 'REPLY' | 'ADD' | 'CANCEL' | 'REFRESH' | 'COUNTER' | 'DECLINECOUNTER';
    type repeatingFreq = 'SECONDLY' | 'MINUTELY' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
    type status = 'CONFIRMED' | 'TENTATIVE' | 'CANCELLED';
    type busystatus = 'FREE' | 'TENTATIVE' | 'BUSY' | 'OOF';
    type day = 'SU' | 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA';
    type attendeeRole = 'CHAIR' | 'REQ-PARTICIPANT' | 'OPT_PARTICIPANT' | 'NON-PARTICIPANT';
    type attendeeStatus = 'ACCEPTED' | 'TENTATIVE'| 'DECLINED'| 'DELEGATED' | 'NEEDS-ACTION';
    type attendeeRsvp = 'true' | 'false'| true| false;
    type attendeeType = 'INDIVIDUAL'| 'GROUP'| 'RESOURCE'| 'ROOM'| 'UNKNOWN';
    type alarmType = 'display' | 'audio';


    /**
     * The calendar's product id as an object.
     * Can be provided as a string alternatively, following
     * the scheme //company//product//language
     */
    interface ProdId {
      company: string;
      product: string;
      language?: string;
    }

    /**
     * Meta data that can be applied to a calendar
     */
    interface CalendarData {
      domain?: string;
      prodId?: string | ProdId;
      method?: method;
      name?: string;
      description?: string;
      timezone?: string;
      ttl?: number;
      url?: string;
      scale?: string;
      events?: EventData[];
    }

    /**
     * Information used to create calendar events
     */
    interface EventData {
      start: moment.Moment | Date;
      summary: string;
      id?: string | number;
      uid?: string | number;
      end?: moment.Moment | Date;
      stamp?: moment.Moment | Date;
      created?: moment.Moment | Date;
      lastModified?: moment.Moment | Date;
      description?: string;
      location?: string;
      appleLocation?: AppleLocationData;
      geo?: GeoData;
      url?: string;
      sequence?: number;
      allDay?: boolean;
      floating?: boolean;
      repeating?: RepeatingData;
      htmlDescription?: string;
      organizer?: string | PersonData;
      attendees?: AttendeeData[];
      alarms?: AlarmData[];
      status?: string;
      busystatus?: string;
      timezone?: string;
      recurrenceId?: moment.Moment | Date;
      transparency?: string;
    }

    interface RepeatingData {
      freq: repeatingFreq;
      count?: number;
      interval?: number;
      until?: string | moment.Moment | Date;
      byDay?: day[];
      byMonth?: number[];
      byMonthDay?: number[];
      bySetPos?: number;
      exclude?: moment.Moment[] | Date[];
    }

    /**
     * Specifies information that determines an involved person
     */
    interface PersonData {
      name: string;
      email: string;
      mailto?: string;
    }

    interface AttendeeData extends PersonData {
      role?: attendeeRole;
      status?: attendeeStatus;
      type?: attendeeType;
      delegatedTo?: ICalAttendee;
      delegatedFrom?: ICalAttendee;
      delegatesTo?: ICalAttendee;
      delegatesFrom?: ICalAttendee;
    }

    interface Attachment {
      uri: string;
      mime?: string;
    }

    interface AlarmData {
      type?: alarmType;
      trigger?: number | moment.Moment | Date;
      triggerBefore?: number | moment.Moment | Date;
      triggerAfter?: number | moment.Moment | Date;
      repeat?: number;
      interval?: number;
      attach?: string | Attachment;
      description?: string;
    }

    interface CategoryData {
      name: string;
    }

    interface GeoData {
      lat: number;
      lon: number;
    }

    interface AppleLocationData {
      title: string;
      address: string;
      radius: number;
      geo: GeoData;
    }

    /**
     * The calendar object containing all event data
     */
    class ICalCalendar {
      constructor(data?: CalendarData);
      domain(): string;
      domain(domain: string): ICalCalendar;
      prodId(): string;
      prodId(prodId: string | ProdId): ICalCalendar;
      method(): method;
      method(method: method): ICalCalendar;
      name(): string;
      name(name: string): ICalCalendar;
      description(): string;
      description(description: string): ICalCalendar;
      timezone(): string;
      timezone(timezone: string): ICalCalendar;
      url(): string;
      url(url: string): ICalCalendar;
      scale(): string;
      scale(scale: string): ICalCalendar;
      ttl(): number;
      ttl(ttl: number): ICalCalendar;
      createEvent(event: EventData): ICalEvent;
      events(): ICalEvent[];
      events(events: EventData[]): ICalCalendar;
      save(path: string, cb: Function): ICalCalendar;
      saveSync(path: string): number;
      serve(response: http.ServerResponse, filename?: string): ICalCalendar;
      toURL(): string;
      toString(): string;
      toJSON(): any;
      length(): number;
      clear(): ICalCalendar;
    }

    class ICalEvent {
      constructor(data: EventData, calendar: ICalCalendar);
      id(): string | number;
      id(id: string | number): ICalEvent;
      uid(): string | number;
      uid(id: string | number): ICalEvent;
      sequence(): number;
      sequence(sequence: number): ICalEvent;
      start(): moment.Moment;
      start(start: string | moment.Moment |  Date): ICalEvent;
      end(): moment.Moment;
      end(end: string | moment.Moment | Date): ICalEvent;
      recurrenceId(): moment.Moment;
      recurrenceId(recurrenceId: string | moment.Moment | Date): ICalEvent;
      timezone(): string;
      timezone(timezone: string): ICalEvent;
      stamp(): moment.Moment;
      stamp(stamp: string | moment.Moment | Date): ICalEvent;
      timestamp(): moment.Moment;
      timestamp(stamp: string | moment.Moment | Date): ICalEvent;
      allDay(): boolean;
      allDay(allDay: boolean): ICalEvent;
      floating(): boolean;
      floating(floating: boolean): ICalEvent;
      repeating(): RepeatingData;
      repeating(repeating: RepeatingData): ICalEvent;
      summary(): string;
      summary(summary: string): ICalEvent;
      location(): string;
      location(location: string): ICalEvent;
      appleLocation(): AppleLocationData;
      appleLocation(location: AppleLocationData): ICalEvent;
      geo(): string | null;
      geo(geo: string | GeoData | null): ICalEvent;
      description(): string;
      description(description: string): ICalEvent;
      htmlDescription(): string;
      htmlDescription(htmlDescription: string): ICalEvent;
      organizer(): PersonData;
      organizer(organizer: string | PersonData): ICalEvent;
      createAttendee(attendee: AttendeeData): ICalAttendee;
      attendees(): ICalAttendee[];
      attendees(attendees: AttendeeData[]): ICalEvent;
      createAlarm(alarmData: AlarmData): ICalAlarm;
      alarms(): ICalAlarm[];
      alarms(alarms: AlarmData[]): ICalEvent;
      createCategory(categoryData: CategoryData): ICalCategory;
      categories(): ICalCategory[];
      categories(categories: CategoryData[]): ICalEvent;
      status(): status;
      status(status: status): ICalEvent;
      busystatus(): busystatus;
      busystatus(busystatus: busystatus): ICalEvent;
      url(): string;
      url(url: string): ICalEvent;
      created(): moment.Moment;
      created(created: string | moment.Moment | Date): ICalEvent;
      lastModified(): moment.Moment;
      lastModified(lastModified: string | moment.Moment | Date): ICalEvent;
      toJSON(): EventData;
      transparency(): string;
      transparency(transparency: string): string;
    }

    class ICalAttendee {
      constructor(data: AttendeeData | string);
      name(): string;
      name(name: string): ICalAttendee;
      email(): string;
      email(email: string): ICalAttendee;
      mailto(): string;
      mailto(mailto: string): ICalAttendee;
      role(): attendeeRole;
      role(role: attendeeRole): ICalAttendee;
      rsvp(): attendeeRsvp;
      rsvp(rsvp: attendeeRsvp): ICalAttendee;
      status(): attendeeStatus;
      status(status: attendeeStatus): ICalAttendee;
      type(): attendeeType;
      type(type: attendeeType): ICalAttendee;
      delegatedTo(): string | ICalAttendee;
      delegatedTo(attendee: string | ICalAttendee): ICalAttendee;
      delegatedFrom(): string | ICalAttendee;
      delegatedFrom(attendee: string | ICalAttendee): ICalAttendee;
      delegatesTo(attendee: ICalAttendee | string | AttendeeData): ICalAttendee;
      delegatesFrom(attendee: ICalAttendee | string | AttendeeData): ICalAttendee;
      toJSON(): AttendeeData;
    }

    class ICalAlarm {
      constructor(data: AlarmData);
      type(): alarmType;
      type(type: alarmType): ICalAlarm;
      trigger(): number | moment.Moment;
      trigger(delay: number | moment.Moment | Date | null): ICalAlarm;
      triggerAfter(): number | moment.Moment;
      triggerAfter(delay: number | moment.Moment | Date): ICalAlarm;
      triggerBefore(): number | moment.Moment;
      triggerBefore(delay: number | moment.Moment | Date): ICalAlarm;
      repeat(): number;
      repeat(times: number): ICalAlarm;
      interval(): number;
      interval(interval: number): ICalAlarm;
      attach(): string | Attachment;
      attach(attachment: string | Attachment): ICalAlarm;
      description(): string;
      description(description: string): ICalAlarm;
      toJSON(): AlarmData;
    }

    class ICalCategory {
      constructor(data: CalendarData);
      name(): string;
      name(name: string): ICalCategory;
      toJSON(): CalendarData;
    }
  }
  export = ICalGenerator;
}
