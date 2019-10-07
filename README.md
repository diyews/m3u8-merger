# m3u8-merger
Merge m3u8 to mp[3,4] by link.

## Usage
Notice: FFmpeg is required. Download for your platform [here](https://ffmpeg.org/download.html). After downloaded, set environment variable `%FFMPEG_PATH%` that the directory includes `ffmpeg.exe`.
- CLI:
  ```
  $ npm i m3u8-merger -g
  $ m3u8-merger url [-d storageDir]
  ```
  
- Module:

  `$ npm i m3u8-merger`
  
  ```js
  const m3u8Merger = require('m3u8-merger');
  m3u8Merger({url, dir, isConvert, format});
  ```
## Options
  ```
  -d [dir]
    Default: './ts'. Dir to storage .ts file, 
    
  --convert [true]
    Default: true. Whether convert merged .ts file to MP4.
  ```
