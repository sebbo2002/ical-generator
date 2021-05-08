'use strict';

import Magic from '../../src/lib';
import assert = require('assert');

describe('Example', function () {
    it('should work with integers', function () {
        assert.strictEqual(Magic.double(2), 4);
    });
});
