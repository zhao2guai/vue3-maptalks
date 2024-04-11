/**
 * Description
 * @mixin TiandituConfig
 * @desc 地图配置文件:用于存储地图密匙服务地址等参数配置，天地图key服务配置和超图服务配置文件信息
 * @author zpc
 */

// 三维地名服务，使用wtfs服务
const getUrlBySwdm = (tk: String) => {
  return (
    "https://t{s}.tianditu.gov.cn/mapservice/GetTiles?tk=" +
    tk +
    "&lxys={z},{x},{y}"
  );
};

// 三维地形
const getUrlBySwdx = (tk: String) => {
  return (
    "https://t{s}.tianditu.gov.cn/mapservice/swdx?T=elv_c&tk=" +
    tk +
    "&x={x}&y={y}&l={z}"
  );
};

// 获取maptalks的GL图层中的天地图3D地形参数对象
const getTerrain = (tk: String) => {
  if (tk) {
    // 设置天地图3D地形
    return {
      type: "tianditu",
      tileSize: 256,
      terrainWidth: 65,
      shader: "lit",
      tileSystem: [1, -1, -180, 90],
      maxAvailableZoom: 14,
      urlTemplate: getUrlBySwdx(tk),
      subdomains: ["1", "2", "3", "4", "5"]
      // debug: true
    };
  } else {
    return null;
  }
};

export const tiandituApi = {
  getUrlBySwdm,
  getUrlBySwdx,
  getTerrain
};
