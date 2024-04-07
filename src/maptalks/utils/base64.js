import imageToBase64 from "image-to-base64/browser";
/**
 * 图片url链接路径转base64
 * @param {*} url
 * @returns
 * @description Image URL / Path to the image
 */
export function getImgBase64(url) {
  return new Promise((resolve, reject) => {
    imageToBase64(url)
      .then(response => {
        // "iVBORw0KGgoAAAANSwCAIA..."
        let res = getImageType(url) + response;
        resolve(res);
      })
      .catch(error => {
        // Logs an error if there was one
        reject(error);
      });
  });
}

/**
 * 根据图片或者地址返回base64+图片类型后缀
 * @param {*} url
 * @returns
 */
function getImageType(url) {
  // 使用正则表达式匹配URL或者路径结尾的图片类型
  var regex = /(?:\.([^.]+))?$/;
  var match = regex.exec(url);
  // 如果匹配成功，则返回图片类型
  if (match && match[1]) {
    return "data:image/" + match[1] + ";base64,";
  }
  // 如果没有匹配到图片类型，则返回空字符串
  return "";
}

// 图片url链接转base64
export async function convertImageToBase64(url) {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// 获取图片的base64字符串
export function getBase64Img(url) {
  if (!url) return "";
  convertImageToBase64(url)
    .then(base64 => {
      return base64;
    })
    .catch(error => {
      console.error(error);
      return "";
    });
}
