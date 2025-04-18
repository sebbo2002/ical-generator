'use strict';

import assert from 'assert';

import Magic from '../../src/lib/index.js';

describe('Example', function () {
    it('should work with integers', function () {
        assert.strictEqual(Magic.double(2), 4);
    });
});
