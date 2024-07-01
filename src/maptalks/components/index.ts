/*
 * @Description: maptalks 地图库组件注册首页
 * @Author: zhao2guai
 * @Date: 2024-02-02 14:23:07
 * @LastEditors: 赵二乖
 * @LastEditTime: 2024-03-28 09:01:16
 */
import type { App, Plugin } from "vue";
// 引入maptalks官方样式
import "maptalks/dist/maptalks.css";
// 地图基础组件
import * as Map from "./map";
// 图层类组件
import * as Layers from "./layers";
// 模型类组件
import * as GLTF from "./gltf";
// maptalks高级功能及其组件
import * as MtPlugin from "./others";
// 地图分析插件
import * as MtAnalysis from "./analysis";

const install: Plugin = (app: App) => {
  app.use(Map.install);
  app.use(Layers.install);
  app.use(GLTF.install);
  app.use(MtPlugin.install);
  app.use(MtAnalysis.install);
};

const plugin = { install };

export default plugin;
export { install, Map, Layers, GLTF, MtPlugin, MtAnalysis };
