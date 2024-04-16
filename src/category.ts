'use strict';


import {escape} from './tools.ts';


export interface ICalCategoryData {
    name: string;
}


export interface ICalCategoryJSONData {
    name: string;
}

export type ICalCategoryInternalData = ICalCategoryJSONData;


/**
 * Usually you get an {@link ICalCategory} object like this:
 *
 * ```javascript
 * import ical from 'ical-generator';
 * const calendar = ical();
 * const event = calendar.createEvent();
 * const category = event.createCategory();
 * ```
 *
 * You can also use the {@link ICalCategory} object directly:
 *
 * ```javascript
 * import ical, {ICalCategory} from 'ical-generator';
 * const category = new ICalCategory();
 * event.categories([category]);
 * ```
 */
export default class ICalCategory {
    private readonly data: ICalCategoryInternalData;

    /**
     * Constructor of {@link ICalCategory}.
     * @param data Category Data
     */
    constructor(data: ICalCategoryData) {
        this.data = {
            name: ''
        };

        if(!data.name) {
            throw new Error('No value for `name` in ICalCategory given!');
        }

        this.name(data.name);
    }


    /**
     * Get the category name
     * @since 0.3.0
     */
    name(): string;

    /**
     * Set the category name
     * @since 0.3.0
     */
    name(name: string): this;
    name(name?: string): this | string {
        if (name === undefined) {
            return this.data.name;
        }

        this.data.name = name;
        return this;
    }


    /**
     * Return a shallow copy of the category's options for JSON stringification.
     * Can be used for persistence.
     *
     * @since 0.2.4
     */
    toJSON(): ICalCategoryInternalData {
        return Object.assign({}, this.data);
    }


    /**
     * Return generated category name as a string.
     *
     * ```javascript
     * console.log(category.toString());
     * ```
     */
    toString(): string {

        // CN / Name
        return escape(this.data.name, false);
    }
}
