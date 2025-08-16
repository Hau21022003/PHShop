import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import * as fs from 'fs';
import * as path from 'path';
import { ProductService } from 'src/modules/product/product.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private readonly uploadDir = path.join(process.cwd(), 'uploads', 'product');
  constructor(private readonly productService: ProductService) {}

  @Cron('0 0 * * *') // Oh
  // @Cron('* * * * *')
  async handleCleanup() {
    this.logger.log('Bắt đầu dọn dẹp ảnh không sử dụng...');

    // 1. Lấy tất cả file trong thư mục uploads/product
    const allFiles = fs.existsSync(this.uploadDir)
      ? fs.readdirSync(this.uploadDir)
      : [];

    // 2. Lấy tất cả ảnh đang dùng từ database
    const products = await this.productService.find();
    const usedFiles = new Set<string>();

    products.forEach((product) => {
      const allImageUrls = [
        ...(product.images || []),
        ...(product.descriptionImages || []),
      ];

      // console.log('allImageUrls', allImageUrls);

      allImageUrls.forEach((url) => {
        const filename = path.basename(url);
        usedFiles.add(filename);
      });
    });

    // 3. Tìm và Xóa file không dùng
    const unusedFiles = allFiles.filter((file) => !usedFiles.has(file));
    for (const file of unusedFiles) {
      try {
        fs.unlinkSync(path.join(this.uploadDir, file));
        this.logger.log(`Đã xóa ảnh không dùng: ${file}`);
      } catch (error) {
        this.logger.error(`Lỗi khi xóa file ${file}:`, error);
      }
    }

    this.logger.log('Hoàn tất dọn dẹp ảnh.');
  }
}
