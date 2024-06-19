import { defineFakeRoute } from "vite-plugin-fake-server/client";
import geojson10 from "@/geojson/10/beijingarea.json";
import geojson62 from "@/geojson/62/甘肃省_市.json";
import geojson64 from "@/geojson/64/宁夏回族自治区.json";
import geojson6527 from "@/geojson/65/博尔塔拉蒙古自治州_县.json";
import shadow6527 from "@/geojson/65/博州遮罩多边形.json";
import shanghai from "@/geojson/markerCluster/shanghai.json";
import pipelineData from "@/geojson/pipeline/pipeline.json";

type geoJsonType = {
  features: Array<Object>;
  type: string;
};

export default defineFakeRoute([
  {
    url: "/get-async-geojson62",
    method: "get",
    response: () => {
      // 转换甘肃geojson数据随机加上value值为了分层设色效果，如有真是数据还是从后台一次性设置好再返回
      let resData = setFeatureData(geojson62);
      return {
        success: true,
        data: resData
      };
    }
  },
  {
    url: "/get-async-geojson65",
    method: "get",
    response: () => {
      // 转换甘肃geojson数据随机加上value值为了分层设色效果，如有真是数据还是从后台一次性设置好再返回
      let resData = setFeatureData(geojson6527);
      return {
        success: true,
        data: resData
      };
    }
  },
  {
    url: "/get-async-shadow6527",
    method: "get",
    response: () => {
      return {
        success: true,
        data: shadow6527
      };
    }
  },
  {
    url: "/get-async-geojson64",
    method: "get",
    response: () => {
      return {
        success: true,
        data: geojson64
      };
    }
  },
  {
    url: "/get-async-beijing",
    method: "get",
    response: () => {
      return {
        success: true,
        data: geojson10
      };
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
  {
    url: "/get-pipeline-geojson",
    method: "get",
    response: () => {
      return {
        success: true,
        data: pipelineData
      };
    }
  }
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
};

// 生成范围之间的随机整数
const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
