import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: {};
};

/** 获取geojson数据 */
export const getGeojsonData = (data?: object) => {
  return http.request<Result>("get", "/get-async-geojson", { data });
};