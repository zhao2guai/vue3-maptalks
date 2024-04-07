/**
 * Description
 * @mixin TiandituConfig
 * @desc 地图配置文件:用于存储地图密匙服务地址等参数配置，天地图key服务配置和超图服务配置文件信息
 * @author zpc
 */
const mapKey = import.meta.env.VITE_MAP_KEY_TIANDITU; //天地图密匙
const keyList = [
  "0592e6141496da4ac134903ad99a76e3", // 天地图密匙(gisway)
  "541d353afad9f0a0aa2856997de02357", // 天地图密匙(gisway)
  "695a9bebe4c75d64d9cada2be2789425", // 天地图密匙zpc1
  "dc7daefa7eb64e40157d3681117d8467", // 天地图密匙zpc2
  "93819ce65cd88930d504a90f0e6569b1", // 天地图密匙zpc3
  "82a74f41821a492c53c0a0b13467cf88", // 天地图密匙zxz
  "dd19af61769ae30c179e4d23aa6c533d",
  "1a768c04dbd17d4451f3b5ea2bf1743d",
  "98e1c9a3cf5f531dbe8af78c1dd28974", // 生态部1
  "ec89e7ba91633b147f76d47e08f9f1a1" // 生态部2
];
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
    // 若存在密匙则用无则随机拿一个
    let key = tk ? tk : this.getRandomKey();
    // 设置天地图3D地形
    return {
      type: "tianditu",
      tileSize: 256,
      terrainWidth: 65,
      shader: "lit",
      tileSystem: [1, -1, -180, 90],
      maxAvailableZoom: 14,
      urlTemplate: this.getUrlBySwdx(key),
      subdomains: ["1", "2", "3", "4", "5"]
      // debug: true
    };
  },

  // 根据天地图类型获取maptalks的天地图瓦片配置
  getTdtTileLayer(type, tk, proj) {
    let url = "";
    if (type === "vec_c") url = this.getUrlByVecc(tk);
    if (type === "cva_c") url = this.getUrlByCvac(tk);
    if (type === "ter_c") url = this.getUrlByTerc(tk);
    if (type === "cta_c") url = this.getUrlByCtac(tk);
    if (type === "img_c") url = this.getUrlByImgc(tk);
    if (type === "cia_c") url = this.getUrlByCiac(tk);
    if (type === "ibo_c") url = this.getUrlByIboc(tk);
    return {
      tileSystem: [1, -1, -180, 90],
      spatialReference: {
        projection: proj
      },
      // urlTemplate: this.getTiandituUrl(type, tk),
      urlTemplate: url,
      maxAvailableZoom: 18,
      subdomains: ["1", "2", "3", "4", "5"]
    };
  },

  /**
   * 根据类型获取天地图底图服务
   * @param {*} type (img_w 影像底图-球面墨卡托投影 img_c 影像底图-经纬度)
   * @param {*} tk (传入天地图的密钥)
   */
  getTiandituUrl(type, tk) {
    if (!type || !tk) return;
    // 获取天地图API基础地质
    let baseUrl = "http://t{s}.tianditu.gov.cn/" + type + "/wmts";
    // 获取图层名称如'img'
    let layer = type.substring(0, 3);
    // 获取投影类型如w是墨卡托c是经纬度
    let tileMatrixSet = type.substring(4);
    // 定义天地图请求参数信息
    let params = {
      tk: tk,
      SERVICE: "wmts",
      REQUEST: "GetTile",
      VERSION: "1.0.0",
      LAYER: layer,
      TILEMATRIXSET: tileMatrixSet,
      TILECOL: "{x}",
      TILEROW: "{y}",
      TILEMATRIX: "{z}",
      STYLE: "default",
      FORMAT: "tiles"
    };
    // 创建一个空数组，用于存储参数键值对
    let paramStrings = [];
    // 遍历params对象，将每键值对转换为参数字符串，并添加到数组中。
    for (let key in params) {
      let paramString =
        encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
      paramStrings.push(paramString);
    }
    // 将数组中的参数字符串使用"符号连接起来，形成完整的请求字符串。
    let paramString = paramStrings.join("&");
    // 拼接完整地址并返回
    let url = baseUrl + "?" + paramString;
    return url;
  },

  /**
   * 根据收集的天地图密匙中随机抽取一个
   * @returns
   */
  getRandomKey() {
    const resKey = keyList[Math.floor(this.getRandomNum() * keyList.length)];
    return resKey ? resKey : mapKey;
  },

  /**
   * 获取安全随机数
   * @returns
   */
  getRandomNum() {
    let array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % 100;
  }
};
