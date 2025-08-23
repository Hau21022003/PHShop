import { Controller, Get, Param } from '@nestjs/common';
import { ProvinceService } from './province.service';
import { Public } from 'src/auth/decorators/public.decorator';

@Public()
@Controller('province')
export class ProvinceController {
  constructor(private readonly provinceService: ProvinceService) {}

  @Get()
  getProvinces() {
    return this.provinceService.getProvinces();
  }

  @Get(':provinceId/districts')
  getDistricts(@Param('provinceId') provinceId: string) {
    return this.provinceService.getDistricts(provinceId);
  }

  @Get('district/:districtId/wards')
  getWards(@Param('districtId') districtId: string) {
    return this.provinceService.getWards(districtId);
  }
}
