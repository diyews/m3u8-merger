import { downloadM3u8 } from './download-m3u8';
import { downloadTs } from './download-ts';
import { join } from 'path';

export async function m3u8Merger({url, dir, isConvert, format}: {
  dir: string,
  isConvert?: boolean,
  url: string,
  format: string,
}) {
  if (!url) {
    return console.error('Must provide a url');
  }
  dir = dir || './ts';
  format = format || 'mp4';

  const urlPrefix = url.match(/(.+\/).+\.m3u8/)[1];
  const storageDir = join(process.cwd(), dir);

  const tsList = await downloadM3u8(url);
  downloadTs({ tsList, urlPrefix, storageDir, isConvert: isConvert !== false, format });
}
