import { downloadM3u8 } from './download-m3u8';
import { downloadTs } from './download-ts';
import { join } from 'path';

export async function m3u8Merger({url, dir, isConvert}: {
  dir: string,
  isConvert?: null,
  url: string,
}) {
  if (!url) {
    return console.error('Muse provide a url');
  }
  dir = dir || './ts';

  const urlPrefix = url.match(/(.+\/).+\.m3u8/)[1];
  const storageDir = join(process.cwd(), dir);

  const tsList = await downloadM3u8(url);
  downloadTs({ tsList, urlPrefix, storageDir, isConvert: isConvert !== false });
}
