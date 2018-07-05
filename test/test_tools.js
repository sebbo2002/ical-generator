'use strict';

const assert = require('assert');
const moment = require('moment');
const ICalTools = require('../src/_tools');

describe('ICalTools', function() {
    describe('formatDate()', function () {
        it('timezone=0 dateonly=0 floating=0', function() {
            assert.equal(
                ICalTools.formatDate(null, '2018-07-05T18:24:00.052Z', false, false),
                '20180705T182400Z'
            );
        });

        it('timezone=0 dateonly=0 floating=1', function() {
            assert.equal(
                ICalTools.formatDate(null, '2018-07-05T18:24:00.052Z', false, true),
                '20180705T182400'
            );
        });

        it('timezone=0 dateonly=1 floating=0', function() {
            assert.equal(
                ICalTools.formatDate(null, '2018-07-05T18:24:00.052Z', true, false),
                '20180705'
            );
        });

        it('timezone=0 dateonly=1 floating=1', function() {
            assert.equal(
                ICalTools.formatDate(null, '2018-07-05T18:24:00.052Z', true, true),
                '20180705'
            );
        });

        it('timezone=1 dateonly=0 floating=0', function() {
            assert.equal(
                ICalTools.formatDate('Europe/Berlin', '2018-07-05T18:24:00.052Z', false, false),
                '20180705T202400Z'
            );
        });

        it('timezone=1 dateonly=0 floating=1', function() {
            assert.equal(
                ICalTools.formatDate('Europe/Berlin', '2018-07-05T18:24:00.052Z', false, true),
                '20180705T202400'
            );
        });

        it('timezone=1 dateonly=1 floating=0', function() {
            assert.equal(
                ICalTools.formatDate('Europe/Berlin', '2018-07-05T18:24:00.052Z', true, false),
                '20180705'
            );
        });

        it('timezone=1 dateonly=1 floating=1', function() {
            assert.equal(
                ICalTools.formatDate('Europe/Berlin', '2018-07-05T18:24:00.052Z', true, true),
                '20180705'
            );
        });
    });

    describe('formatDateTZ()', function () {
        it('should work with timezone', function () {
            const ed = {timezone: 'Europe/Berlin'};
            assert.equal(
                ICalTools.formatDateTZ('Europe/Berlin', 'DSTART', '2018-07-02T15:48:05.000Z', ed),
                'DSTART;TZID=Europe/Berlin:20180702T174805'
            );
        });
        it('should work without timezone', function () {
            assert.equal(
                ICalTools.formatDateTZ(null, 'DSTART', '2018-07-02T15:48:05.000Z', {}),
                'DSTART:20180702T154805Z'
            );
        });
    });

    describe('toJSON()', function() {
        it('should work with basic examples', function () {
            const json = ICalTools.toJSON(
                {
                    foo: () => '=foo',
                    bar: () => '=bar'
                },
                ['foo', 'bar']
            );

            assert.deepEqual(json, {foo: '=foo', bar: '=bar'});
        });
        it('should handle moment values', function () {
            const json = ICalTools.toJSON(
                {
                    foo: () => moment('2018-02-01T00:00:00.000Z')
                },
                ['foo']
            );

            assert.deepEqual(json, {foo: '2018-02-01T00:00:00.000Z'});
        });
        it('should handle ignoreAttributes option', function () {
            const json = ICalTools.toJSON(
                {
                    foo: () => '=foo',
                    bar: () => '=bar'
                },
                ['foo', 'bar'],
                {ignoreAttributes: ['foo']}
            );

            assert.deepEqual(json, {bar: '=bar'});
        });
        it('should handle arrays', function () {
            const json = ICalTools.toJSON(
                {
                    foo: () => '=foo',
                    bar: () => [
                        {toJSON: () => 'a'},
                        {toJSON: () => 'b'}
                    ]
                },
                ['foo', 'bar']
            );

            assert.deepEqual(json, {foo: '=foo', bar: ['a', 'b']});
        });
        it('should handle hooks properly', function () {
            const json = ICalTools.toJSON(
                {
                    foo: () => '=foo',
                    bar: () => '=bar'
                },
                ['foo', 'bar'],
                {
                    hooks: {
                        bar: s => s.replace('=', '+')
                    }
                }
            );

            assert.deepEqual(json, {foo: '=foo', bar: '+bar'});
        });
    });
});