import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: {};
};

/** 获取geojson数据 */
export const getGeojsonData = (params?: any) => {
  if (params.code === "65") {
    return http.request<Result>("get", "/get-async-geojson65");
  } else if (params.code === "64") {
    return http.request<Result>("get", "/get-async-geojson64");
  } else {
    return http.request<Result>("get", "/get-async-geojson62");
  }
};

/** 获取遮罩阴影数据 */
export const getShadowData = () => {
  return http.request<Result>("get", "/get-async-shadow6527");
};

/** 获取geojson数据 */
export const getBeijingData = () => {
  return http.request<Result>("get", "/get-async-beijing");
};

/**
 * 获取点聚合数据
 */
export const getmarkerClusterData = () => {
  return http.request<Result>("get", "/get-marker-cluster-geojson");
};

/**
 * 获取管线数据
 */
export const getPipelineData = () => {
  return http.request<Result>("get", "/get-pipeline-geojson");
};
