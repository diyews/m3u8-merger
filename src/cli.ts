#!/usr/bin/env node
import * as yargs from 'yargs';
import { m3u8Merger } from './main';

yargs.option('max-concurrent-downloads', {
  alias: 'j', type: 'number', description: 'Set the maximum number of parallel downloads' })

const url = yargs.argv._[0];
const dir = yargs.argv.d as string;
const isConvert = yargs.argv.convert as boolean;
const format = yargs.argv.format as string;
m3u8Merger({ url, dir, isConvert, format });
