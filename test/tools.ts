'use strict';

import assert from 'assert';
import { formatDate, formatDateTZ, foldLines, escape } from '../src/tools';

describe('ICalTools', function () {
    describe('formatDate()', function () {
        it('timezone=0 dateonly=0 floating=0', function () {
            assert.strictEqual(
                formatDate(null, '2018-07-05T18:24:00.052Z', false, false),
                '20180705T182400Z'
            );
        });

        it('timezone=0 dateonly=0 floating=1', function () {
            assert.strictEqual(
                formatDate(null, '2018-07-05T18:24:00.052Z', false, true),
                '20180705T182400'
            );
        });

        it('timezone=0 dateonly=1 floating=0', function () {
            assert.strictEqual(
                formatDate(null, '2018-07-05T18:24:00.052Z', true, false),
                '20180705'
            );
        });

        it('timezone=0 dateonly=1 floating=1', function () {
            assert.strictEqual(
                formatDate(null, '2018-07-05T18:24:00.052Z', true, true),
                '20180705'
            );
        });

        it('timezone=1 dateonly=0 floating=0', function () {
            assert.strictEqual(
                formatDate('Europe/Berlin', '2018-07-05T18:24:00.052Z', false, false),
                '20180705T182400Z'
            );
        });

        it('timezone=1 dateonly=0 floating=1', function () {
            assert.strictEqual(
                formatDate('Europe/Berlin', '2018-07-05T18:24:00.052Z', false, true),
                '20180705T202400'
            );
        });

        it('timezone=1 dateonly=1 floating=0', function () {
            assert.strictEqual(
                formatDate('Europe/Berlin', '2018-07-05T18:24:00.052Z', true, false),
                '20180705'
            );
        });

        it('timezone=1 dateonly=1 floating=1', function () {
            assert.strictEqual(
                formatDate('Europe/Berlin', '2018-07-05T18:24:00.052Z', true, true),
                '20180705'
            );
        });
    });

    describe('formatDateTZ()', function () {
        it('should work with timezone', function () {
            const ed = {timezone: 'Europe/Berlin'};
            assert.strictEqual(
                formatDateTZ('Europe/Berlin', 'DSTART', '2018-07-02T15:48:05.000Z', ed),
                'DSTART;TZID=Europe/Berlin:20180702T174805'
            );
        });
        it('should work without timezone', function () {
            assert.strictEqual(
                formatDateTZ(null, 'DSTART', '2018-07-02T15:48:05.000Z', {}),
                'DSTART:20180702T154805Z'
            );
        });
    });

    describe('escape()', function () {
        it('should escape \\', function () {
            assert.strictEqual(
                escape('Lorem \\ipsum'),
                'Lorem \\\\ipsum'
            );
        });
        it('should escape ;', function () {
            assert.strictEqual(
                escape('Lorem ;ipsum'),
                'Lorem \\;ipsum'
            );
        });
        it('should escape ,', function () {
            assert.strictEqual(
                escape('Lorem, ipsum'),
                'Lorem\\, ipsum'
            );
        });
        it('should escape \\r', function () {
            assert.strictEqual(
                escape('Lorem \ripsum'),
                'Lorem \\nipsum'
            );
        });
        it('should escape \\n', function () {
            assert.strictEqual(
                escape('Lorem \nipsum'),
                'Lorem \\nipsum'
            );
        });
        it('should escape \\r\\n', function () {
            assert.strictEqual(
                escape('Lorem \r\nipsum'),
                'Lorem \\nipsum'
            );
        });
    });

    describe('foldLines()', function () {
        it('should basically work correctly', function () {
            assert.strictEqual(
                foldLines('12345678ikjhgztrde546rf7g8hjiomkjnhgqfcdxerdftgzuinjhgcfvtzvzvuwcbiweciujzvguhbghbbqwxowidoi21e8981'),
                '12345678ikjhgztrde546rf7g8hjiomkjnhgqfcdxerdftgzuinjhgcfvtzvzvuwcbiweciujz\r\n vguhbghbbqwxowidoi21e8981'
            );
        });
        it('should not split surrogate pairs', function () {
            assert.strictEqual(
                foldLines('👋🏼12345678ikjhgztrde546rf7g8hjiomkjnhgqfcdxerdftgzuinjhgcfvtzvzvuwcbiweciujvguhbghbbqwxowidoi21e8981'),
                '👋🏼12345678ikjhgztrde546rf7g8hjiomkjnhgqfcdxerdftgzuinjhgcfvtzvzvuwcb\r\n iweciujvguhbghbbqwxowidoi21e8981'
            );
        });
    });
});
