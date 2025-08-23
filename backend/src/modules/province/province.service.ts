import { Injectable } from '@nestjs/common';
import { province, commune, district } from 'data/province.json';

@Injectable()
export class ProvinceService {
  getProvinces() {
    return province;
  }

  getDistricts(provinceId: string) {
    return district.filter((d) => d.idProvince === provinceId);
  }

  getWards(districtId: string) {
    return commune.filter((w) => w.idDistrict === districtId);
  }
}
