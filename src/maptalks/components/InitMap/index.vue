<template>
  <div class="map-content">
    <!-- 地图加载区域 -->
    <div :id="container" class="maptalks-content" />
    <!-- 地图子组件插槽区域 -->
    <slot v-if="mapload" />
  </div>
</template>
<script lang="ts">
import {
  ref,
  provide,
  nextTick,
  onBeforeUnmount,
  onBeforeMount,
  watch,
  defineComponent
} from "vue";
import { Map, TileLayer, GroupTileLayer } from "maptalks";
import "@maptalks/transcoders.draco";
import "@maptalks/transcoders.crn";
import "@maptalks/transcoders.ktx2";
import { tiandituApi } from "../../config/tianditu.js";
export default defineComponent({
  /** 初始化地图组件 */
  name: "mt-tianditu-map",
  props: {
    // 绑定地图dom的id
    container: {
      type: String,
      default: "mapId"
    },
    // 地图配置
    options: {
      type: Object,
      default: () => ({
        center: [103.82591437579072, 36.05400583727757], // 兰州坐标
        zoom: 10,
        spatialReference: {
          projection: "EPSG:4326"
        },
        minZoom: 1,
        maxZoom: 18,
        bearing: 0,
        pitch: 0,
        // 是否显示中心十字
        centerCross: false,
        // 是否使用无缝缩放模式
        seamlessZoom: true,
        // 是否启用地图缩放
        zoomable: true,
        // 是否禁用贴图拖动
        draggable: true
      })
    }
  },

  setup(props, context) {
    // 地图对象
    let map: Map | undefined = undefined;
    // 地图加载状态
    let mapload: Bolean = ref(false);

    // 监听地图配置
    watch(
      () => props.options,
      newOptions => {
        if (map && map.isLoaded()) {
          map.setOptions(newOptions);
        }
      },
      { deep: true }
    );

    // 页面加载后执行
    onBeforeMount(() => {
      nextTick(() => {
        if (props.container) {
          initMap();
        } else {
          console.error("当前地图绑定的HTMLElement容器的ID为空！");
        }
      });
    });

    // 页面元素销毁之前执行
    onBeforeUnmount(() => {
      removeAll();
    });

    // 初始化地图容器
    const initMap = () => {
      // 加载地图配置参数
      map = new Map(props.container, props.options);
      // 获取坐标系
      const proj: String = map.getProjection().code;
      // 设置地图范围
      map.setSpatialReference({
        projection: proj ? proj : "EPSG:4326",
        resolutions: getResolutions(props.options.maxZoom)
      });
      // 获取地图初始化状态来更新插槽状态
      if (map.isLoaded()) {
        mapload.value = true;
        // 向父组件方法传送初始化完毕的map
        provide("map", map);
      }
    };

    // 获取地图范围
    const getResolutions = num => {
      const resolutions: Array = [];
      let zoom = num > 0 ? num : 19;
      for (let i = 0; i < zoom; i++) {
        resolutions[i] = 180 / (Math.pow(2, i) * 128);
      }
      return resolutions;
    };

    // 移除地图所有图层销毁地图组件
    const removeAll = () => {
      // 删除图层和地图对象
      if (map) {
        map.removeBaseLayer();
        map.remove();
        // 修改地图加载状态清除子组件
        if (map.isRemoved()) mapload.value = false;
        map = undefined;
      }
    };

    return {
      map,
      mapload,
      removeAll
    };
  }
});
</script>
<style lang="scss" scoped>
.map-content {
  position: absolute;
  width: 100%;
  height: 100%;
}

.maptalks-content {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
