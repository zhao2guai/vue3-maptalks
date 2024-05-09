import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: {};
};

/** 获取geojson数据 */
export const getGeojsonData = (data?: object) => {
  return http.request<Result>("get", "/get-async-geojson", { data });
};

/**
 * 获取点聚合数据
 */
export const getmarkerClusterData = () => {
  return http.request<Result>("get", "/get-marker-cluster-geojson");
};