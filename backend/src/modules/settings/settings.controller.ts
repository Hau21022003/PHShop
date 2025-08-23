import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get(':key')
  async get(@Param('key') key: string) {
    return { key, value: await this.settingsService.get(key) };
  }

  @Post()
  async set(@Body() body: { key: string; value: any }) {
    return this.settingsService.set(body.key, body.value);
  }
}
