import { join } from 'path';
import * as fs from 'fs';
import { spawn } from 'child_process';

export class DownloadProgress {
  downloadedCount = 0;
  listLength: number;
  finalFilePath: string;
  outputFilePath: string;

  constructor(private downloadList: string[][],
              private storageDir: string,
              private autoConvert: boolean,
              private format: string,
  ) {
    this.listLength = downloadList.length;
    this.finalFilePath = join(this.storageDir, '0'.repeat(6) + '.ts');
    this.outputFilePath = join(this.storageDir, '0'.repeat(6) + `.${format}`);
    process.stdout.write('Start Download ts files:\n');
    this.log();
  }

  log() {
    process.stdout.write('\r\x1b[k');
    process.stdout.write(`${this.downloadedCount}/${this.listLength}`);
  }

  updateCount() {
    this.downloadedCount++;
    this.log();
    if (this.downloadedCount === this.listLength) {
      process.stdout.write('\n');
      this.concatFiles();
    }
  }

  concatFiles() {
    process.stdout.write('Merging files...\n');
    const finalFileStream = fs.createWriteStream(join(this.storageDir, '0'.repeat(6) + '.ts'));
    let i = 0;
    const mergeFile = (file: string) => {
      fs.createReadStream(join(this.storageDir, file))
        .on('end', () => {
          if (i === this.listLength - 1) {
            finalFileStream.close();
            process.stdout.write(`Merged file, output: ${this.finalFilePath}\n`);
            if (this.autoConvert) {
              this.convertToFormat();
            }
          } else {
            mergeFile(this.downloadList[++i][1]);
          }
        })
        .pipe(finalFileStream, { end: false });
    };
    mergeFile(this.downloadList[i][1]);
  }

  convertToFormat() {
    const mp3 = ['-i', this.finalFilePath, '-q:a', '0', '-map', 'a', this.outputFilePath];
    const mp4 = ['-i', this.finalFilePath, '-acodec', 'copy', '-vcodec', 'copy', this.outputFilePath];
    const command = this.format === 'mp4' ? mp4 : mp3;
    let lastErrorBuffer: Buffer = Buffer.from([]);

    const ffmpeg = spawn(`${process.env.FFMPEG_PATH}\\ffmpeg.exe`,
      command, {
        stdio: ['inherit', 'ignore', 'pipe'],
      });
    ffmpeg.stderr.on('data', (data: Buffer) => {
      const buf = Buffer.concat([lastErrorBuffer, data], lastErrorBuffer.length + data.length);
      if (buf.includes('Overwrite ?')) {
        process.stdout.write('File exist, Overwrite ? [y/N]');
      }
      lastErrorBuffer = data;
    });
    ffmpeg.on('exit', code => {
      if (code === 0) {
        process.stdout.write('Convert file success. bye.');
      } else {
        process.stdout.write(code + '');
      }
    });
  }
}
