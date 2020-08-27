import * as request from 'request';

export function downloadM3u8(url: string): Promise<string[]> {
  return new Promise((resolve, reject) => {

    request(url, (error, res) => {
      if (error || res.statusCode !== 200) {
        const err = error ?? `HTTP status ${res.statusCode}`;
        reject(err);
        return console.error('Fetch m3u8 failed with: ', err);
      }
      const list: string[] = res.body.split('\n').filter((o: string) => o && !o.startsWith('#'));

      resolve(list);
    });
  });
}
