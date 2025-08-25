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

  findOneProvince(provinceId: string) {
    return province.find((item) => item.idProvince === provinceId);
  }

  findOneDistrict(districtId: string) {
    return district.find((item) => item.idDistrict === districtId);
  }

  findOneWard(wardId: string) {
    return commune.find((item) => item.idCommune === wardId);
  }
}
