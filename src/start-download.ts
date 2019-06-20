import { downloadM3u8 } from './download-m3u8';

export function startDownload({ url }: {
  url: string,
}) {
  if (!url) {
    return console.error('Muse provide a url');
  }

  downloadM3u8(url);
}
