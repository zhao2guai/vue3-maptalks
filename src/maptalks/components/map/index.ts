/*
 * @Description: maptalks 地图基础库组件注册
 * @Author: zhao2guai
 * @Date: 2024-02-02 14:23:07
 * @LastEditors: 赵二乖
 * @LastEditTime: 2024-03-28 09:01:16
 */
import type { App } from "vue";
import MtInitMap from "./MtInitMap/index.vue";

function install(app: App) {
  // 初始化地图组件
  app.component("mt-init-map", MtInitMap);
}

export default install;

export { install, MtInitMap };
