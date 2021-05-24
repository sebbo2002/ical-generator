#!/usr/bin/env node
'use strict';

/* istanbul ignore file */

import Magic from '../lib';

const number = parseInt(process.argv[process.argv.length - 1], 10);
console.log(Magic.double(number));
