/*
 * @Description: maptalks 图层组件注册
 * @Author: zhao2guai
 * @Date: 2024-02-02 14:23:07
 * @LastEditors: 赵二乖
 * @LastEditTime: 2024-03-28 09:01:16
 */
import type { App } from "vue";
import MtGroupGLLayer from "./MtGroupGLLayer/index.vue";
import MtTileLayer from "./MtTileLayer/index.vue";
import MtTiandituLayer from "./MtTiandituLayer/index.vue";
import MtGroupTileLayer from "./MtGroupTileLayer/index.vue";
import MtWMSTileLayer from "./MtWMSTileLayer/index.vue";
import MtVectorTileLayer from "./MtVectorTileLayer/index.vue";
import MtGeoJSONVectorTileLayer from "./MtGeoJSONVectorTileLayer/index.vue";
import MtGeo3DTilesLayer from "./MtGeo3DTilesLayer/index.vue";

function install(app: App) {
  // webgl图层集合的管理和融合类
  app.component("mt-group-gl-layer", MtGroupGLLayer);
  // 瓦片图层组件
  app.component("mt-tile-layer", MtTileLayer);
  // 天地图图层组件
  app.component("mt-tianditu-layer", MtTiandituLayer);
  // 瓦片图层组
  app.component("mt-group-tile-layer", MtGroupTileLayer);
  // 服务图层
  app.component('mt-wms-tile-layer', MtWMSTileLayer);
  // 矢量瓦片图层
  app.component('mt-vector-tile-layer', MtVectorTileLayer);
  // GEOJSON矢量瓦片图层
  app.component('mt-geojson-vector-tile-layer', MtGeoJSONVectorTileLayer);
  // GEO3D矢量瓦片图层
  app.component('mt-geo3d-tile-layer', MtGeo3DTilesLayer);
}

export default install;

export {
  install,
  MtGroupGLLayer,
  MtTileLayer,
  MtTiandituLayer,
  MtGroupTileLayer,
  MtWMSTileLayer,
  MtVectorTileLayer,
  MtGeoJSONVectorTileLayer,
  MtGeo3DTilesLayer
};
