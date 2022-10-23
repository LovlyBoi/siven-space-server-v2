const mapRegion: Record<string, string> = {
  AH: "安徽省",
  BJ: "北京市",
  CQ: "重庆市",
  FJ: "福建省",
  GD: "广东省",
  GS: "甘肃省",
  GX: "广西壮族自治区",
  GZ: "贵州省",
  HA: "河南省",
  HB: "湖北省",
  HE: "河北省",
  HI: "海南省",
  HK: "香港特别行政区",
  HL: "黑龙江省",
  HN: "湖南省",
  JL: "吉林省",
  JS: "江苏省",
  JX: "江西省",
  LN: "辽宁省",
  MO: "内蒙古自治区",
  NX: "宁夏回族自治区",
  QH: "青海省",
  SC: "四川省",
  SD: "山东省",
  SH: "上海市",
  SN: "陕西省",
  SX: "山西省",
  TJ: "天津市",
  TW: "台湾省",
  XJ: "新疆维吾尔自治区",
  XZ: "西藏自治区",
  YN: "云南省",
  ZJ: "浙江省",
};

export function getCNRegion(
  country: string,
  region: string,
  city: string = "",
  ll: [number, number] = [0, 0]
) {
  let country_CN = "海外",
    region_CN = "海外城市",
    city_CN = city;
  country = country.toUpperCase();
  region = region.toUpperCase();
  if (country === "CN") {
    country_CN = "中国";
  }
  if (region in mapRegion) {
    region_CN = mapRegion[region]
  }
  return {
    country,
    country_CN,
    region,
    region_CN,
    city,
    city_CN,
    ll,
  }
}
