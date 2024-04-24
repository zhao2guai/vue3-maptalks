
import { urlToBase64 } from "@pureadmin/utils";

/**
 * 本地图片转base64
 * @param path 图片 `url`
 * @param mineType 图片格式，默认为 `image/png`
 * @param encoderOptions `0` 到 `1` 之间的取值，主要用来选定图片的质量，默认值是 `0.92`，超出范围也会选择默认值
 * @returns 
 */
export function localImgToBase64(path: string, mineType?: string, encoderOptions?: number) {
  let resUrl = "";
  urlToBase64(path, mineType, encoderOptions).then(res => {
    resUrl = res;
  });
  return resUrl;
};

/**
 * 在线图片url转base64
 * @param url 
 * @returns 
 */
export function onlineImgToBase64(url: string) {
  let resUrl = "";
  urlToBase64(url).then(res => {
    resUrl = res;
  });
  return resUrl;
};

export function getFrontImg() { 
  return new URL("@/maptalks/assets/imgs/weather/446/front.jpg", import.meta.url);
};

export function getbackImg() { 
  return new URL("@/maptalks/assets/imgs/weather/446/back.jpg", import.meta.url);
};

export function getLeftImg() { 
  return new URL("@/maptalks/assets/imgs/weather/446/left.jpg", import.meta.url);
};

export function getRightImg() { 
  return new URL("@/maptalks/assets/imgs/weather/446/right.jpg", import.meta.url);
};

export function getTopImg() { 
  return new URL("@/maptalks/assets/imgs/weather/446/top.jpg", import.meta.url);
};

export function getBottomImg() { 
  return new URL("@/maptalks/assets/imgs/weather/446/bottom.jpg", import.meta.url);
};