import { urlToBase64 } from "@pureadmin/utils";

/**
 * 本地图片转base64
 * @param path 图片 `url`
 * @param mineType 图片格式，默认为 `image/png`
 * @param encoderOptions `0` 到 `1` 之间的取值，主要用来选定图片的质量，默认值是 `0.92`，超出范围也会选择默认值
 * @returns
 */
export async function localImgToBase64(
  path: string,
  mineType?: string,
  encoderOptions?: number
) {
  let res = "";
  await urlToBase64(path, mineType, encoderOptions)
    .then(res => {
      res = res;
    })
    .catch(error => {
      console.error(error);
    });
  return res;
}

/**
 * 在线图片url转base64
 * @param url
 * @returns
 */
export async function onlineImgToBase64(url: string) {
  let res = "";
  await urlToBase64(url)
    .then(res => {
      res = res;
    })
    .catch(error => {
      console.error(error);
    });
  return res;
}

export function getFrontImg() {
  return new URL("../assets/images/weather/446/front.jpg", import.meta.url);
}

export function getbackImg() {
  return new URL("../assets/images/weather/446/back.jpg", import.meta.url);
}

export function getLeftImg() {
  return new URL("../assets/images/weather/446/left.jpg", import.meta.url);
}

export function getRightImg() {
  return new URL("../assets/images/weather/446/right.jpg", import.meta.url);
}

export function getTopImg() {
  return new URL("../assets/images/weather/446/top.jpg", import.meta.url);
}

export function getBottomImg() {
  return new URL("../assets/images/weather/446/bottom.jpg", import.meta.url);
}
