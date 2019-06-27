import * as fs from 'fs';
import { join } from 'path';
import { argv } from 'yargs';
import * as request from 'request';

export function downloadTs(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileName = url.match(/.*\/(.+?\.ts)/)[1];
    const dir = join(process.cwd(), (argv.d as string) || 'ts');
    try {
      fs.accessSync(dir, fs.constants.F_OK);
    } catch (e) {
      switch (e.errno) {
        case -4058:
          fs.mkdirSync(dir, { recursive: true });
          break;
        default:
          console.error(e);
      }
    }

    const file = fs.createWriteStream(join(dir, fileName));
    request(url)
      .on('error', () => {
        reject(fileName);
      })
      .on('end', () => {
        resolve(fileName);
      }).pipe(file);
  });
}
