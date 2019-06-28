import * as request from 'request';

export function downloadM3u8(url: string): Promise<string[]> {
  return new Promise((resolve, reject) => {

    request(url, (error, res) => {
      const list: string[] = res.body.split('\n').filter(o => o.includes('.ts'));

      resolve(list);
    });
  });
}
