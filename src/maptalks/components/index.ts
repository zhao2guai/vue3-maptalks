/*
 * @Description: maptalks 地图库组件注册首页
 * @Author: zhao2guai
 * @Date: 2024-02-02 14:23:07
 * @LastEditors: 赵二乖
 * @LastEditTime: 2024-03-28 09:01:16
 */
import type { App, Plugin } from "vue";
import "maptalks/dist/maptalks.css";
// maptalks webgl 图层的汇总包
import '@maptalks/gl-layers';
// 可选的draco插件
import '@maptalks/transcoders.draco';
// 可选的crn纹理解析插件
import '@maptalks/transcoders.crn';
// 可选的ktx2纹理解析插件
import '@maptalks/transcoders.ktx2';
import * as Map from "./map";
import * as Layers from "./layers";
import * as GLTF from './gltf';

const install: Plugin = (app: App) => {
  app.use(Map.install);
  app.use(Layers.install);
  app.use(GLTF.install);
};

const plugin = { install };

export default plugin;
export { install, Map, Layers, GLTF };
