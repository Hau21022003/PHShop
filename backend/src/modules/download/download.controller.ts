import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { Public } from 'src/auth/decorators/public.decorator';
import { DownloadService } from 'src/modules/download/download.service';

@Public()
@Controller('download')
export class DownloadController {
  constructor(private readonly downloadService: DownloadService) {}
  @Get('*')
  async downloadImage(@Param() params, @Res() res: Response) {
    const filePath = params[0];
    const {
      stream,
      mimeType,
      filename: realName,
    } = this.downloadService.getImageStream(filePath);
    res.set({
      'Content-Type': mimeType,
      'Content-Disposition': `inline; filename="${realName}"`,
    });
    stream.pipe(res);
  }
}
