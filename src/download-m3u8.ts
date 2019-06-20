import * as request from 'request';
import { downloadTs } from './download-ts';

export function downloadM3u8(url: string) {
  const urlPrefix = url.match(/(.+\/).+\.m3u8/)[1];

  request(url, (error, res) => {
    const list = res.body.split('\n').filter(o => o.includes('.ts'));
    const download = {};
    list.forEach(o => {
      downloadTs(`${urlPrefix}${o}`);
    });
  });
}
