import { defineStore } from "pinia";
import { store } from "@/store";
import type { Map } from "maptalks";
import type { GroupGLLayer } from "@maptalks/gl-layers";

export const useMaptalksStore = defineStore({
  id: "pure-maptalks",
  state: () => ({
    // 地图对象
    map: undefined,
    // webgl图层对象
    groupGLLayer: undefined
  }),
  getters: {
    getMap(state) {
      return state.map;
    },
    getGroupGLLayer(state) {
      // 判断地图是否存在且已经初始化完毕
      if (state.map && state.map.isLoaded()) {
        // 从地图对象中获取GL图层ID
        const id = state.map.config().groupId;
        return id ? state.map.getLayer(id) : null;
      } else {
        return null;
      }
    }
  },
  actions: {
    /** 存储地图对象 */
    setMap(map: Map) {
      this.map = map;
    },
    /** 存储webgl图层 */
    setGroupGLLayer(layer: GroupGLLayer) {
      this.groupGLLayer = layer;
    },
    /** 清空所有state中地图属性 */
    clearMap() {
      this.map = undefined;
    },
    /** 清空所有state中地图属性 */
    clearGroupGLLayer() {
      this.groupId = undefined;
      this.groupGLLayer = undefined;
    },
    /** 清空所有state中地图属性 */
    clearAllState() {
      this.clearGroupGLLayer();
      this.clearMap();
    }
  }
});

export function useMaptalksStoreHook() {
  return useMaptalksStore(store);
}
