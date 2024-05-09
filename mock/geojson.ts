import { defineFakeRoute } from "vite-plugin-fake-server/client";

import geojson62 from "@/geojson/62/甘肃省_市.json";
import geojson65 from "@/geojson/65/新疆维吾尔自治区_市.json";
import shanghai from "@/geojson/markerCluster/shanghai.json";

type geoJsonType = {
  features: Array<Object>;
  type: string;
};

export default defineFakeRoute([
  {
    url: "/get-async-geojson",
    method: "get",
    response: ({ body }) => {
      if (body.code === "65") {
        return {
          success: true,
          data: geojson65
        };
      } else {
        // 转换甘肃geojson数据随机加上value值为了分层设色效果，如有真是数据还是从后台一次性设置好再返回
        let resData = setFeatureData(geojson62);
        return {
          success: true,
          data: resData
        };
      }
    }
  },
  {
    url: "/get-marker-cluster-geojson",
    method: "get",
    response: () => {
      return {
        success: true,
        data: shanghai
      };
    }
  },
]);

// 获取行政区划设置行政区划中的地区值
const setFeatureData = (data: geoJsonType) => {
  for (let i = 0; i < data.features.length; i++) {
    const element: any = data.features[i];
    // 这里因为测试需要所以随便给了这个范围
    const num = getRandomInt(1000, 10000);
    element.properties.value = num;
  }
  return data;
}

// 生成范围之间的随机整数
const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};