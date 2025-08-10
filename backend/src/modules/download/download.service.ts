// image-download.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { createReadStream, statSync, existsSync } from 'fs';
import { join, extname } from 'path';
import * as mime from 'mime-types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DownloadService {
  getImageStream(filename: string) {
    const filePath = join(process.cwd(), filename);

    if (!existsSync(filename)) {
      throw new NotFoundException('Image not found');
    }

    const mimeType =
      mime.lookup(extname(filename)) || 'application/octet-stream';
    const stream = createReadStream(filename);
    const fileStat = statSync(filename);

    return {
      stream,
      mimeType,
      fileSize: fileStat.size,
      filename: filename,
    };
  }
}
