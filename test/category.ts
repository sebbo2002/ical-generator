'use strict';

import assert from 'assert';
import ICalCategory from '../src/category.js';

describe('ical-generator Category', function () {
    describe('constructor()', function () {
        it('should ignore unknown data attributes', function () {
            const a = new ICalCategory({
                // @ts-ignore
                unknown: true,
                name: 'FOO'
            });

            assert.strictEqual(a.name(), 'FOO');
        });
    });

    describe('name()', function () {
        it('setter should return this', function () {
            const c = new ICalCategory({});
            assert.deepStrictEqual(c, c.name('FOO'));
            assert.deepStrictEqual(c, c.name(null));
        });

        it('getter should return value', function () {
            const c = new ICalCategory({});
            assert.strictEqual(c.name(), null);

            c.name('HELLO-WORLD');
            assert.strictEqual(c.name(), 'HELLO-WORLD');
        });

        it('should change something', function () {
            const c = new ICalCategory({name: 'BANANA'});
            assert.ok(c.toString().indexOf('BANANA') > -1);
        });
    });

    describe('toJSON()', function () {
        it('should contain valued previously set', function () {
            const c = new ICalCategory({name: 'FOOBAR'});
            assert.deepStrictEqual(c.toJSON(), {name: 'FOOBAR'});
        });
    });

    describe('toString()', function () {
        it('shoult throw an error without name', function () {
            const c = new ICalCategory({});
            assert.throws(function () {
                c.toString();
            }, /`name`/);
        });
    });
});
