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

        it('shoult throw an error without name', function () {
            assert.throws(function () {
                // @ts-ignore
                new ICalCategory({});
            }, /`name`/);
        });
    });

    describe('name()', function () {
        it('setter should return this', function () {
            const c = new ICalCategory({ name: 'foo' });
            assert.deepStrictEqual(c, c.name('FOO'));
        });

        it('getter should return value', function () {
            const c = new ICalCategory({ name: 'foo' });
            assert.strictEqual(c.name(), 'foo');

            c.name('HELLO-WORLD');
            assert.strictEqual(c.name(), 'HELLO-WORLD');
        });

        it('should change something', function () {
            const c = new ICalCategory({name: 'BANANA'});
            assert.ok(c.toString().includes('BANANA'));
        });
    });

    describe('toJSON()', function () {
        it('should contain valued previously set', function () {
            const c = new ICalCategory({name: 'FOOBAR'});
            assert.deepStrictEqual(c.toJSON(), {name: 'FOOBAR'});
        });
    });
});
