import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: {};
};

export const getProductCategory = (baseUrl?: String) => {
  return http.request<Result>("get", baseUrl);
};