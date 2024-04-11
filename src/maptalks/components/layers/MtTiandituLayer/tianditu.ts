/**
 * Description
 * @mixin TiandituConfig
 * @desc 地图配置文件:用于存储地图密匙服务地址等参数配置，天地图key服务配置和超图服务配置文件信息
 * @author zpc
 */
// 影像底图-球面墨卡托投影
const getUrlByImgw = (tk: String) => {
  return (
    "http://t{s}.tianditu.gov.cn/img_w/wmts?tk=" +
    tk +
    "&service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles"
  );
};
// 影像底图-经纬度投影
const getUrlByImgc = (tk: String) => {
  return (
    "http://t{s}.tianditu.gov.cn/img_c/wmts?tk=" +
    tk +
    "&service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=c&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles"
  );
};
// 影像注记-球面墨卡托投影
const getUrlByCiaw = (tk: String) => {
  return (
    "http://t{s}.tianditu.gov.cn/cia_w/wmts?tk=" +
    tk +
    "&service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles"
  );
};
// 影像注记-经纬度投影
const getUrlByCiac = (tk: String) => {
  return (
    "http://t{s}.tianditu.gov.cn/cia_c/wmts?tk=" +
    tk +
    "&service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=c&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles"
  );
};
// 矢量底图-球面墨卡托投影
const getUrlByVecw = (tk: String) => {
  return (
    "http://t{s}.tianditu.gov.cn/vec_w/wmts?tk=" +
    tk +
    "&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}"
  );
};
// 矢量底图-经纬度投影
const getUrlByVecc = (tk: String) => {
  return (
    "http://t{s}.tianditu.gov.cn/vec_c/wmts?tk=" +
    tk +
    "&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}"
  );
};
// 矢量注记-球面墨卡托投影
const getUrlByCvaw = (tk: String) => {
  return (
    "http://t{s}.tianditu.gov.cn/cva_w/wmts?tk=" +
    tk +
    "&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}"
  );
};
// 矢量注记-经纬度投影
const getUrlByCvac = (tk: String) => {
  return (
    "http://t{s}.tianditu.gov.cn/cva_c/wmts?tk=" +
    tk +
    "&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}"
  );
};
// 地形晕渲-球面墨卡托投影
const getUrlByTerw = (tk: String) => {
  return (
    "http://t{s}.tianditu.gov.cn/ter_w/wmts?tk=" +
    tk +
    "&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}"
  );
};
// 地形晕渲-经纬度投影
const getUrlByTerc = (tk: String) => {
  return (
    "http://t{s}.tianditu.gov.cn/ter_c/wmts?tk=" +
    tk +
    "&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}"
  );
};
// 地形注记-球面墨卡托投影
const getUrlByCtaw = (tk: String) => {
  return (
    "http://t{s}.tianditu.gov.cn/cta_w/wmts?tk=" +
    tk +
    "&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cta&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}"
  );
};
// 地形注记-经纬度投影
const getUrlByCtac = (tk: String) => {
  return (
    "http://t{s}.tianditu.gov.cn/cta_c/wmts?tk=" +
    tk +
    "&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cta&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}"
  );
};
// 全球境界-球面墨卡托投影
const getUrlByIbow = (tk: String) => {
  return (
    "http://t{s}.tianditu.gov.cn/ibo_w/wmts?tk=" +
    tk +
    "&service=wmts&request=GetTile&version=1.0.0&LAYER=ibo&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles"
  );
};
// 全球境界-经纬度投影
const getUrlByIboc = (tk: String) => {
  return (
    "http://t{s}.tianditu.gov.cn/ibo_c/wmts?tk=" +
    tk +
    "&service=wmts&request=GetTile&version=1.0.0&LAYER=ibo&tileMatrixSet=c&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles"
  );
};

export const tiandituApi = {
  getUrlByImgw,
  getUrlByImgc,
  getUrlByCiaw,
  getUrlByCiac,
  getUrlByVecw,
  getUrlByVecc,
  getUrlByCvaw,
  getUrlByCvac,
  getUrlByTerw,
  getUrlByTerc,
  getUrlByCtaw,
  getUrlByCtac,
  getUrlByIbow,
  getUrlByIboc
};
