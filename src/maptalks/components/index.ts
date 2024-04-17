/*
 * @Description: maptalks 地图库组件注册首页
 * @Author: zhao2guai
 * @Date: 2024-02-02 14:23:07
 * @LastEditors: 赵二乖
 * @LastEditTime: 2024-03-28 09:01:16
 */
import Map from "./map";
import Layers from "./layers";
import GLTF from './gltf';

const plugin = { Map, Layers, GLTF  };

export default plugin;

export { Map, Layers, GLTF };
