import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: {};
};

/** 获取geojson数据 */
export const getGeojsonData = (params?: any) => {
  if (params.code==="65") {
    return http.request<Result>("get", "/get-async-geojson65");
  } else { 
    return http.request<Result>("get", "/get-async-geojson62");
  }
};

/**
 * 获取点聚合数据
 */
export const getmarkerClusterData = () => {
  return http.request<Result>("get", "/get-marker-cluster-geojson");
};