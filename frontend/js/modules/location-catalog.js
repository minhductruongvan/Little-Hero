(() => {
  "use strict";

  const provinces = [
    { name: "An Giang", region: "south" },
    { name: "Bắc Ninh", region: "north" },
    { name: "Cà Mau", region: "south" },
    { name: "Cao Bằng", region: "north" },
    { name: "Đà Nẵng", region: "central" },
    { name: "Đắk Lắk", region: "central" },
    { name: "Điện Biên", region: "north" },
    { name: "Đồng Nai", region: "south" },
    { name: "Đồng Tháp", region: "south" },
    { name: "Gia Lai", region: "central" },
    { name: "Hà Tĩnh", region: "central" },
    { name: "Hải Phòng", region: "north" },
    { name: "Hà Nội", region: "north" },
    { name: "Huế", region: "central" },
    { name: "Hưng Yên", region: "north" },
    { name: "Khánh Hòa", region: "central" },
    { name: "Lai Châu", region: "north" },
    { name: "Lâm Đồng", region: "central" },
    { name: "Lạng Sơn", region: "north" },
    { name: "Lào Cai", region: "north" },
    { name: "Nghệ An", region: "central" },
    { name: "Ninh Bình", region: "north" },
    { name: "Phú Thọ", region: "north" },
    { name: "Quảng Ngãi", region: "central" },
    { name: "Quảng Ninh", region: "north" },
    { name: "Quảng Trị", region: "central" },
    { name: "Sơn La", region: "north" },
    { name: "Tây Ninh", region: "south" },
    { name: "Thái Nguyên", region: "north" },
    { name: "Thanh Hóa", region: "central" },
    { name: "Thành phố Hồ Chí Minh", region: "south" },
    { name: "Tuyên Quang", region: "north" },
    { name: "Vĩnh Long", region: "south" },
    { name: "Cần Thơ", region: "south" }
  ].sort((first, second) => first.name.localeCompare(second.name, "vi"));
  const regions = {
    north: "Miền Bắc",
    central: "Miền Trung",
    south: "Miền Nam"
  };
  const regionByProvince = Object.fromEntries(provinces.map(({ name, region }) => [name, region]));
  const catalog = Object.freeze({ provinces, regions, regionByProvince });

  if (typeof module !== "undefined" && module.exports) module.exports = catalog;
  else window.LittleHeroLocations = catalog;
})();
