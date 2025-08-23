import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AppService } from 'src/app.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IsExistConstraint } from 'src/common/validators/is-exist-constraint.validator';
import { mongooseConfig } from 'src/config/db.config';
import { CartModule } from 'src/modules/cart/cart.module';
import { CategoryModule } from 'src/modules/category/category.module';
import { DownloadModule } from 'src/modules/download/download.module';
import { OrdersModule } from 'src/modules/orders/orders.module';
import { ProductModule } from 'src/modules/product/product.module';
import { ProvinceModule } from 'src/modules/province/province.module';
import { SettingsModule } from 'src/modules/settings/settings.module';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [
    HttpModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(mongooseConfig.uri),
    UsersModule,
    AuthModule,
    CategoryModule,
    ProductModule,
    DownloadModule,
    CartModule,
    ProvinceModule,
    OrdersModule,
    SettingsModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    IsExistConstraint,
  ],
})
export class AppModule {}
