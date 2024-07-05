<template>
  <!-- 地图加载区域 -->
  <div :id="container" class="maptalks-container">
    <!-- 地图子组件插槽区域 -->
    <div v-if="mapload">
      <slot />
    </div>
  </div>
</template>
<script>
import {
  ref,
  watch,
  provide,
  onMounted,
  onUnmounted,
  defineComponent
} from "vue";
import { Map } from "maptalks";
import { buildUUID } from "@pureadmin/utils";
import {
  getFrontImg,
  getbackImg,
  getLeftImg,
  getRightImg,
  getTopImg,
  getBottomImg
} from "../../../utils/base64";
export default defineComponent({
  /** 初始化地图组件 */
  name: "mt-init-map",
  props: {
    // 绑定地图dom的id
    container: {
      type: [String, Number],
      default: buildUUID()
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
        pitch: 45
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
              front: getFrontImg(),
              back: getbackImg(),
              left: getLeftImg(),
              right: getRightImg(),
              top: getTopImg(),
              bottom: getBottomImg()
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
    // 地图加载状态
    let mapload = ref(false);
    // 地图对象存储
    let mapRef = ref(null);

    // 存储全局属性和方法
    provide("maptalks", mapRef);

    // 监听地图配置
    watch(
      () => props.options,
      newOptions => {
        mapRef.value?.setOptions(newOptions);
      },
      { deep: true }
    );

    // 监听地图光照配置
    watch(
      () => props.lights,
      newLights => {
        mapRef.value?.setLights(newLights);
      },
      { deep: true }
    );

    // 页面组件挂载完成后执行
    onMounted(() => {
      // 执行地图初始化函数
      initMap();
      // 地图父页面加载成功状态存储
      // window.mapParentMounted = instance?.isMounted;
    });

    // 页面元素销毁之前执行
    onUnmounted(() => {
      removeAll();
    });

    // 初始化地图容器
    const initMap = () => {
      // 加载地图配置参数
      const map = new Map(props.container, props.options);
      // 获取坐标系
      // const proj = map.getProjection().code;
      // 设置地图范围
      // map.setSpatialReference({
      //   projection: proj ? proj : "EPSG:4326",
      //   resolutions: getResolutions(props.options.maxZoom)
      // });
      // 设置光照
      map?.setLights(props.lights);
      // 向组件传送初始化完毕的map
      context.emit("getMap", map);
      // 将地图对象存储在mapRef
      mapRef.value = map;
      // 初始化地图事件
      initMapEvents();
      // 修改地图加载状态
      mapload.value = true;
    };

    // 移除地图所有图层销毁地图组件
    const removeAll = () => {
      // 删除图层和地图对象
      if (mapRef.value) {
        mapRef.value.removeBaseLayer();
        mapRef.value.remove();
        // 修改地图加载状态清除子组件
        if (mapRef.value.isRemoved()) mapload.value = false;
        mapRef.value = undefined;
      }
    };

    // 注册地图事件并返回给组件回调
    const initMapEvents = () => {
      // 当地图对象存在且加载完毕时
      const map = mapRef.value;
      if (!map) return;
      // 给地图添加鼠标点击事件
      map.on("click", event => {
        context.emit("click", event);
      });

      // 给地图添加鼠标移入事件
      map.on("mouseenter", event => {
        context.emit("mouseenter", event);
      });

      // 给地图添加鼠标移出事件
      map.on("mouseout", event => {
        context.emit("mouseout", event);
      });

      map.on("spatialreferencechange", event =>
        context.emit("spatialreferencechange", event)
      );
      map.on("baselayerchangestart", event =>
        context.emit("baselayerchangestart", event)
      );
      map.on("baselayerchangeend", event =>
        context.emit("baselayerchangeend", event)
      );
      map.on("setbaselayer", event => context.emit("setbaselayer", event));
      map.on("baselayerload", event => context.emit("baselayerload", event));
      map.on("baselayerremove", event =>
        context.emit("baselayerremove", event)
      );
      map.on("addlayer", event => context.emit("addlayer", event));
      map.on("removelayer", event => context.emit("removelayer", event));
      map.on("resize", event => context.emit("resize", event));
      map.on("movestart", event => context.emit("movestart", event));
      map.on("moving", event => context.emit("moving", event));
      map.on("moveend", event => context.emit("moveend", event));
      map.on("dragrotatestart", event =>
        context.emit("dragrotatestart", event)
      );
      map.on("dragrotating", event => context.emit("dragrotating", event));
      map.on("dragrotateend", event => context.emit("dragrotateend", event));
      map.on("animating", event => context.emit("animating", event));
      map.on("animateinterrupted", event =>
        context.emit("animateinterrupted", event)
      );
      map.on("animateend", event => context.emit("animateend", event));
      map.on("animatestart", event => context.emit("animatestart", event));
      map.on("pitch", event => context.emit("pitch", event));
      map.on("pitchend", event => context.emit("pitchend", event));
      map.on("mousedown", event => context.emit("mousedown", event));
      map.on("mouseup", event => context.emit("mouseup", event));
      map.on("mouseover", event => context.emit("mouseover", event));
      map.on("mouseleave", event => context.emit("mouseleave", event));
      map.on("mousemove", event => context.emit("mousemove", event));
      map.on("dblclick", event => context.emit("dblclick", event));
      map.on("contextmenu", event => context.emit("contextmenu", event));
      map.on("keypress", event => context.emit("keypress", event));
      map.on("touchstart", event => context.emit("touchstart", event));
      map.on("touchmove", event => context.emit("touchmove", event));
      map.on("touchend", event => context.emit("touchend", event));
      map.on("drop", event => context.emit("drop", event));
      map.on("fullscreenstart", event =>
        context.emit("fullscreenstart", event)
      );
      map.on("fullscreenend", event => context.emit("fullscreenend", event));
      map.on("cancelfullscreen", event =>
        context.emit("cancelfullscreen", event)
      );
      map.on("viewchange", event => context.emit("viewchange", event));
      map.on("zoomstart", event => context.emit("zoomstart", event));
      map.on("zooming", event => context.emit("zooming", event));
      map.on("zoomend", event => context.emit("zoomend", event));
      map.on("touchactstart", event => context.emit("touchactstart", event));
      map.on("touchacting", event => context.emit("touchacting", event));
      map.on("touchactend", event => context.emit("touchactend", event));
      map.on("openmenu", event => context.emit("openmenu", event));
      map.on("closemenu", event => context.emit("closemenu", event));
      map.on("removemenu", event => context.emit("removemenu", event));
    };

    return {
      mapRef,
      mapload
    };
  }
});
</script>
<style lang="scss" scoped>
.maptalks-container {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
