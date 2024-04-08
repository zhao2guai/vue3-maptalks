/**
 * Description
 * @mixin TiandituConfig
 * @desc 地图配置文件:用于存储地图密匙服务地址等参数配置，天地图key服务配置和超图服务配置文件信息
 * @author zpc
 */
export const tiandituApi = {
  // 影像底图-球面墨卡托投影
  getUrlByImgw(tk) {
    return (
      "http://t{s}.tianditu.gov.cn/img_w/wmts?tk=" +
      tk +
      "&service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles"
    );
  },
  // 影像底图-经纬度投影
  getUrlByImgc(tk) {
    return (
      "http://t{s}.tianditu.gov.cn/img_c/wmts?tk=" +
      tk +
      "&service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=c&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles"
    );
  },
  // 影像注记-球面墨卡托投影
  getUrlByCiaw(tk) {
    return (
      "http://t{s}.tianditu.gov.cn/cia_w/wmts?tk=" +
      tk +
      "&service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles"
    );
  },
  // 影像注记-经纬度投影
  getUrlByCiac(tk) {
    return (
      "http://t{s}.tianditu.gov.cn/cia_c/wmts?tk=" +
      tk +
      "&service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=c&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles"
    );
  },
  // 矢量底图-球面墨卡托投影
  getUrlByVecw(tk) {
    return (
      "http://t{s}.tianditu.gov.cn/vec_w/wmts?tk=" +
      tk +
      "&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}"
    );
  },
  // 矢量底图-经纬度投影
  getUrlByVecc(tk) {
    return (
      "http://t{s}.tianditu.gov.cn/vec_c/wmts?tk=" +
      tk +
      "&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}"
    );
  },
  // 矢量注记-球面墨卡托投影
  getUrlByCvaw(tk) {
    return (
      "http://t{s}.tianditu.gov.cn/cva_w/wmts?tk=" +
      tk +
      "&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}"
    );
  },
  // 矢量注记-经纬度投影
  getUrlByCvac(tk) {
    return (
      "http://t{s}.tianditu.gov.cn/cva_c/wmts?tk=" +
      tk +
      "&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}"
    );
  },
  // 地形晕渲-球面墨卡托投影
  getUrlByTerw(tk) {
    return (
      "http://t{s}.tianditu.gov.cn/ter_w/wmts?tk=" +
      tk +
      "&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}"
    );
  },
  // 地形晕渲-经纬度投影
  getUrlByTerc(tk) {
    return (
      "http://t{s}.tianditu.gov.cn/ter_c/wmts?tk=" +
      tk +
      "&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}"
    );
  },
  // 地形注记-球面墨卡托投影
  getUrlByCtaw(tk) {
    return (
      "http://t{s}.tianditu.gov.cn/cta_w/wmts?tk=" +
      tk +
      "&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cta&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}"
    );
  },
  // 地形注记-经纬度投影
  getUrlByCtac(tk) {
    return (
      "http://t{s}.tianditu.gov.cn/cta_c/wmts?tk=" +
      tk +
      "&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cta&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}"
    );
  },
  // 全球境界-球面墨卡托投影
  getUrlByIbow(tk) {
    return (
      "http://t{s}.tianditu.gov.cn/ibo_w/wmts?tk=" +
      tk +
      "&service=wmts&request=GetTile&version=1.0.0&LAYER=ibo&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles"
    );
  },
  // 全球境界-经纬度投影
  getUrlByIboc(tk) {
    return (
      "http://t{s}.tianditu.gov.cn/ibo_c/wmts?tk=" +
      tk +
      "&service=wmts&request=GetTile&version=1.0.0&LAYER=ibo&tileMatrixSet=c&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles"
    );
  },
  // 三维地名服务，使用wtfs服务
  getUrlBySwdm(tk) {
    return (
      "https://t{s}.tianditu.gov.cn/mapservice/GetTiles?tk=" +
      tk +
      "&lxys={z},{x},{y}"
    );
  },

  // 三维地形
  getUrlBySwdx(tk) {
    return (
      "https://t{s}.tianditu.gov.cn/mapservice/swdx?T=elv_c&tk=" +
      tk +
      "&x={x}&y={y}&l={z}"
    );
  },

  // 获取maptalks的GL图层中的天地图3D地形参数对象
  getTerrain(tk) {
    if (tk) {
      // 设置天地图3D地形
      return {
        type: "tianditu",
        tileSize: 256,
        terrainWidth: 65,
        shader: "lit",
        tileSystem: [1, -1, -180, 90],
        maxAvailableZoom: 14,
        urlTemplate: this.getUrlBySwdx(tk),
        subdomains: ["1", "2", "3", "4", "5"]
        // debug: true
      };
    } else {
      return null;
    }
  }
};
