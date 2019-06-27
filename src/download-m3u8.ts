import * as request from 'request';
import { downloadTs } from './download-ts';

export function downloadM3u8(url: string) {
  const urlPrefix = url.match(/(.+\/).+\.m3u8/)[1];

  request(url, (error, res) => {
    const list = res.body.split('\n').filter(o => o.includes('.ts'));
    const listLength = list.length;
    const download = {};
    let downloadedCount = 0;
    process.stdout.write('Start Download ts files:\n');
    process.stdout.write(`${downloadedCount}/${listLength}`);
    list.forEach(o => {
      downloadTs(`${urlPrefix}${o}`)
        .then((filename) => {
          process.stdout.write('\r\x1b[k');
          process.stdout.write(`${++downloadedCount}/${listLength}`);
        });
    });
  });
}
