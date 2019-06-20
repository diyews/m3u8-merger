#!/usr/bin/env node
import * as yargs from 'yargs';
import { startDownload } from './start-download';

if (require.main === module) {
  // cli
  const url = yargs.argv._[0];
  startDownload({ url });
} else {
  exports = startDownload;
}
