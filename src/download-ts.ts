import * as fs from 'fs';
import { join } from 'path';
import { argv } from 'yargs';
import * as request from 'request';
import { DownloadProgress } from './download-progress';

export function downloadTs({tsList, urlPrefix}: { tsList: string[], urlPrefix: string }) {
  // [url, fileName]
  const downloadList = tsList.map(o => [`${urlPrefix}${o}`, o.match(/.+?\.ts/)[0]]);
  const storageDir = join(process.cwd(), (argv.d as string) || 'ts');
  const downloadProgress = new DownloadProgress(downloadList, storageDir);

  downloadList.forEach(o => {
    download({url: o[0], fileName: o[1], dir: storageDir})
      .then((filename) => {
        downloadProgress.updateCount();
      });
  });
}

function download({ url, fileName, dir }: {url: string, fileName: string, dir: string}): Promise<string> {
  return new Promise((resolve, reject) => {
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
