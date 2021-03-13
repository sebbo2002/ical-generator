'use strict';


import {escape} from './tools';


export interface ICalCategoryData {
    name?: string | null
}

export interface ICalCategoryInternalData {
    name: string | null
}

export default class ICalCategory {
    private readonly data: ICalCategoryInternalData;

    constructor(data: ICalCategoryData) {
        this.data = {
            name: null
        };

        data?.name && this.name(data.name);
    }


    /**
     * Set/Get the category name
     * @since 0.3.0
     */
    name(): string | null;
    name(name: string): this;
    name(name?: string): this | string | null {
        if (name === undefined) {
            return this.data.name;
        }

        this.data.name = name || null;
        return this;
    }


    /**
     * Export calender as JSON Object to use it later…
     * @since 0.2.4
     */
    toJSON(): ICalCategoryInternalData {
        return Object.assign({}, this.data);
    }


    /**
     * Export Event to iCal
     * @since 0.2.0
     */
    toString(): string {

        // CN / Name
        if (!this.data.name) {
            throw new Error('No value for `name` in ICalCategory given!');
        }

        return escape(this.data.name);
    }
}
