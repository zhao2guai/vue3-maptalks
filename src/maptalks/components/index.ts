/*
 * @Description: maptalks 地图库组件注册首页
 * @Author: zhao2guai
 * @Date: 2024-02-02 14:23:07
 * @LastEditors: 赵二乖
 * @LastEditTime: 2024-03-28 09:01:16
 */
import type { App, Plugin } from "vue";
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
