#!/usr/bin/env node

const {watchMode} = require('./lib/utils');

if (watchMode()) {
  process.exit(0);
}

const program = require('commander');
const run = require('./lib/run');

program
  .option('--fix', 'Automatically fix lint problems')
	.parse(process.argv);

const {lint} = require('./lib/yoshi-plugins')(program);
run(lint, program);
