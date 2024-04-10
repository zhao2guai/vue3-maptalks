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
  app.component('mt-wms-tile-layer', MtWMSTileLayer)
}

export default install;

export {
  install,
  MtGroupGLLayer,
  MtTileLayer,
  MtTiandituLayer,
  MtGroupTileLayer
};
