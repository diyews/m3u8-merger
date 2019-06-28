#!/usr/bin/env node
import * as yargs from 'yargs';
import { m3u8Merger } from './main';

const url = yargs.argv._[0];
const dir = yargs.argv.d as string;
const isConvert = yargs.argv.convert;
m3u8Merger({ url, dir, isConvert });
