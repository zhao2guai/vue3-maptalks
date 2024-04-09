<template>
  <!-- 地图加载区域 -->
  <div :id="container" ref="mapRef" class="maptalks-map">
    <!-- 地图子组件插槽区域 -->
    <slot v-if="mapload" />
  </div>
</template>
<script>
import {
  ref,
  shallowRef,
  provide,
  nextTick,
  onBeforeUnmount,
  onBeforeMount,
  watch,
  defineComponent
} from "vue";
import "maptalks/dist/maptalks.css";
import { Map } from "maptalks";
import { useMaptalksStoreHook } from "@/store/modules/maptalks";
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
        center: [103.831741, 36.061685], // 甘肃省兰州市
        zoom: 14,
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
    },
    // 光照配置
    lights: {
      type: Object,
      default: () => ({
        directional: {
          direction: [0.5, 0, -1],
          color: [1, 1, 1]
        },
        ambient: {
          resource: {
            url: {
              front: new URL(
                "@/maptalks/assets/imgs/weather/446/front.jpg",
                import.meta.url
              ),
              back: new URL(
                "@/maptalks/assets/imgs/weather/446/back.jpg",
                import.meta.url
              ),
              left: new URL(
                "@/maptalks/assets/imgs/weather/446/left.jpg",
                import.meta.url
              ),
              right: new URL(
                "@/maptalks/assets/imgs/weather/446/right.jpg",
                import.meta.url
              ),
              top: new URL(
                "@/maptalks/assets/imgs/weather/446/top.jpg",
                import.meta.url
              ),
              bottom: new URL(
                "@/maptalks/assets/imgs/weather/446/bottom.jpg",
                import.meta.url
              )
            },
            prefilterCubeSize: 1024
          },
          exposure: 0.787,
          hsv: [0, 0, 0],
          orientation: 0
        }
      })
    }
  },

  setup(props, context) {
    // 地图对象
    let map = undefined;
    // 地图加载状态
    let mapload = ref(false);
    // 地图对象存储
    let maptalks = shallowRef(null);

    // 监听地图配置
    watch(
      () => props.options,
      (newOptions, oldOptions) => {
        if (map && map.isLoaded()) {
          map.setOptions(newOptions);
        }
      },
      { deep: true }
    );

    // 监听地图光照配置
    watch(
      () => props.lights,
      (newLights, oldLights) => {
        if (map && map.isLoaded()) {
          map.setLights(newLights);
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
      const proj = map.getProjection().code;
      // 设置地图范围
      map.setSpatialReference({
        projection: proj ? proj : "EPSG:4326",
        resolutions: getResolutions(props.options.maxZoom)
      });
      // 设置光照
      map.setLights(props.lights);
      // 向组件传送初始化完毕的map
      context.emit("getMap", map);
      // 将地图对象存储在maptalks
      maptalks.value = map;
      // 获取地图初始化状态来更新插槽状态
      if (map.isLoaded()) {
        mapload.value = true;
      }
    };

    // 获取地图范围
    const getResolutions = num => {
      const resolutions = [];
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
        // 清除地图状态中的值
        useMaptalksStoreHook().clearAllState();
      }
    };

    // 存储全局属性和方法
    provide("maptalks", maptalks);

    return {
      map,
      mapload,
      maptalks,
      initMap,
      removeAll
    };
  }
});
</script>
<style lang="scss" scoped>
.maptalks-map {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
