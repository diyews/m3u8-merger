#!/usr/bin/env node
import * as yargs from 'yargs';
import { startDownload } from './start-download';

const url = yargs.argv._[0];
startDownload({ url });
