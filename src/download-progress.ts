import { join } from 'path';
import * as fs from 'fs';
import { spawn } from 'child_process';

export class DownloadProgress {
  downloadedCount = 0;
  listLength: number;
  finalFilePath: string;
  mp4FilePath: string;

  constructor(private downloadList: string[][],
              private storageDir: string,
  ) {
    this.listLength = downloadList.length;
    this.finalFilePath = join(this.storageDir, '0'.repeat(6) + '.ts');
    this.mp4FilePath = join(this.storageDir, '0'.repeat(6) + '.mp4');
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
            this.convertToMP4();
          } else {
            mergeFile(this.downloadList[++i][1]);
          }
        })
        .pipe(finalFileStream, { end: false });
    };
    mergeFile(this.downloadList[i][1]);
  }

  convertToMP4() {
    const ffmpeg = spawn(`${process.env.FFMPEG_PATH}\\ffmpeg.exe`,
      ['-i', this.finalFilePath, '-acodec', 'copy', '-vcodec', 'copy', this.mp4FilePath], {
        stdio: ['inherit', 'ignore', 'pipe'],
      });
    ffmpeg.stderr.on('data', (data: string) => {
      if (data.includes('Overwrite ?')) {
        process.stdout.write('File exist, Overwrite ? [y/N]');
      }
    });
    ffmpeg.on('exit', code => {
      if (code === 0) {
        process.stdout.write('Convert to MP4 success. bye.');
      } else {
        process.stdout.write(code + '');
      }
    });
  }
}
