import * as fs from 'fs';
import { join } from 'path';
import { resolve as urlResolve } from 'url';
import * as request from 'request';
import { DownloadProgress } from './download-progress';
import { defer, from } from 'rxjs';
import { mergeAll } from 'rxjs/operators';

function download({ url, fileName, dir }: { url: string; fileName: string; dir: string }): Promise<string> {
  return new Promise((resolve, reject) => {
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


export function downloadTs({ tsList, urlPrefix, storageDir, isConvert, format, maxDownloads }: {
  tsList: string[];
  urlPrefix: string;
  storageDir: string;
  isConvert: boolean;
  format: string;
  maxDownloads?: number;
}) {
  // [url, fileName]
  const downloadList: [string, string][] = tsList.map(o => {
    const resUrl = urlResolve(urlPrefix, o);
    return [resUrl, resUrl.match(/.+\/(.+)/)[1].split('?')[0]]
  });
  const downloadProgress = new DownloadProgress(downloadList, storageDir, isConvert, format);

  try {
    fs.accessSync(storageDir, fs.constants.F_OK);
  } catch (e) {
    switch (e.errno) {
      case -4058:
        fs.mkdirSync(storageDir, { recursive: true });
        break;
      default:
        console.error(e);
    }
  }

  const tsRequestList =
    downloadList
      .filter(o =>
        !downloadProgress.downloadListStatus[o[1]])
      .map(o => {
        return defer(() =>
          download({url: o[0], fileName: o[1], dir: storageDir})
            .then((filename) => {
              downloadProgress.updateCount(filename);
              return filename;
            }, error => {
              console.log(error);
            })
        );
      })
  from(tsRequestList)
    .pipe(
      mergeAll(maxDownloads ?? 20)
    )
    .subscribe();
}
