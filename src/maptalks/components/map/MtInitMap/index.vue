<template>
  <!-- 地图加载区域 -->
  <div :id="container" class="maptalks-map">
    <!-- 地图子组件插槽区域 -->
    <slot v-if="mapload" />
  </div>
</template>
<script>
import {
  ref,
  shallowRef,
  watch,
  provide,
  nextTick,
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
        pitch: 45,
        // 是否显示中心十字
        centerCross: false,
        // 是否使用无缝缩放模式
        seamlessZoom: true,
        // 是否启用地图缩放
        zoomable: true,
        // 是否禁用贴图拖动
        draggable: true,
        // 地图左下角署名
        attribution: false
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
    },
    // 暗角开关
    darkAngleSwitch: {
      type: Boolean,
      default: false
    }
  },

  setup(props, context) {
    // 获取图层ID
    const container = props.container ? props.container : buildUUID();
    // 地图对象
    let map = undefined;
    // 地图加载状态
    let mapload = ref(false);
    // 地图对象存储
    let maptalks = shallowRef(null);

    // 存储全局属性和方法
    provide("maptalks", maptalks);

    // 监听地图配置
    watch(
      () => props.options,
      newOptions => {
        if (map && map.isLoaded()) {
          map.setOptions(newOptions);
        }
      },
      { immediate: true, deep: true }
    );

    // 监听地图光照配置
    watch(
      () => props.lights,
      newLights => {
        if (map && map.isLoaded()) {
          map.setLights(newLights);
        }
      },
      { immediate: true, deep: true }
    );

    // 监听地图暗角配置
    watch(
      () => props.darkAngleSwitch,
      newVal => {
        if (map && map.isLoaded()) {
          changePostProcess(newVal);
        }
      },
      { deep: true }
    );

    // 页面组件挂载完成后执行
    onMounted(() => {
      nextTick(() => {
        initMap();
      });
    });

    // 页面元素销毁之前执行
    onUnmounted(() => {
      removeAll();
    });

    // 初始化地图容器
    const initMap = () => {
      // 加载地图配置参数
      map = new Map(container, props.options);
      // 获取坐标系
      // const proj = map.getProjection().code;
      // 设置地图范围
      // map.setSpatialReference({
      //   projection: proj ? proj : "EPSG:4326",
      //   resolutions: getResolutions(props.options.maxZoom)
      // });
      // 设置光照
      map.setLights(props.lights);
      // 向组件传送初始化完毕的map
      context.emit("getMap", map);
      // 将地图对象存储在maptalks
      maptalks.value = map;
      // 获取地图初始化状态来更新插槽状态
      if (map.isLoaded()) {
        // 初始化地图事件
        initMapEvents();
        // 判断地图暗角
        changePostProcess(props.darkAngleSwitch);
        // 修改地图加载状态
        mapload.value = true;
      }
    };

    // 获取地图范围
    const getResolutions = num => {
      const resolutions = [];
      let zoom = num > 1 ? num : 19;
      for (let i = 0; i < zoom; i++) {
        resolutions[i] = 180 / (Math.pow(2, i) * 128);
      }
      return resolutions;
    };

    // 屏幕暗角开关
    const changePostProcess = e => {
      if (!map) return;
      // 设置地图映射后处理参数
      const mapPostProcess = {
        enable: true,
        vignette: {
          enable: false
        }
      };
      mapPostProcess.vignette.enable = e;
      map.setPostProcessConfig(mapPostProcess);
      const zoom = map.getZoom();
      map.setZoom(zoom + 0.001);
      map.setZoom(zoom - 0.001);
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

    // 注册地图事件并返回给组件回调
    const initMapEvents = () => {
      // 当地图对象存在且加载完毕时
      if (map && map.isLoaded()) {
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
      }
    };

    return {
      map,
      mapload,
      maptalks,
      changePostProcess
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
