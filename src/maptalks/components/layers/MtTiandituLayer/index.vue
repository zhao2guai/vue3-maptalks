<template>
  <div><slot /></div>
</template>
<script>
import {
  watch,
  provide,
  onBeforeMount,
  onUnmounted,
  defineComponent
} from "vue";
import { buildUUID } from "@pureadmin/utils";
import { TileLayer } from "maptalks";
import { tiandituApi } from "./tianditu.ts";
import useLayer from "../../map/useLayer.ts";
export default defineComponent({
  /** 初始化天地图图层组件 */
  name: "mt-tianditu-layer",
  props: {
    // tile图层id
    id: {
      type: [String, Number],
      default: ""
    },
    // 天地图密匙
    tk: {
      type: String,
      default: ""
    },
    // 图层类型
    layerType: {
      type: String,
      default: "img" // 默认影像底图(img)影像注记(cia)矢量图(vec)矢量注记(cva)地形图(ter)地形注记(cta)全球境界(ibo)
    },
    // 图层坐标系
    projection: {
      type: String,
      default: "EPSG:4326"
    },
    // 是否显示图层
    visible: {
      type: Boolean,
      default: true
    },
    // 图层最小缩放距离
    minZoom: {
      type: Number,
      default: 1
    },
    // 图层最大缩放距离
    maxZoom: {
      type: Number,
      default: 18
    },
    // 图层高度
    zIndex: {
      type: Number,
      default: undefined
    },
    // 图层的样式过滤器开关
    cssFilter: {
      type: String,
      default: null
    }
  },

  setup(props, context) {
    // 获取坐标系
    let proj =
      props.projection === "EPSG:4326" ? props.projection : "EPSG:3857";
    // 获取图层类型
    let type = props.layerType ? props.layerType : "img";
    // 获取图层ID
    let id = props.id ? props.id : buildUUID();
    // 是否开启图层滤镜
    let cssFilter = props.cssFilter ? props.cssFilter : null;
    // 获取天地图URL
    let urlTemplate = "";
    if (!props.tk) console.error("天地图密匙不能为空!");
    // 选择返回天地图的 EPSG3857 墨卡托 或者 EPSG4326 经纬度
    if (proj === "EPSG:4326") {
      if (type === "vec") urlTemplate = tiandituApi.getUrlByVecc(props.tk);
      if (type === "cva") urlTemplate = tiandituApi.getUrlByCvac(props.tk);
      if (type === "ter") urlTemplate = tiandituApi.getUrlByTerc(props.tk);
      if (type === "cta") urlTemplate = tiandituApi.getUrlByCtac(props.tk);
      if (type === "img") urlTemplate = tiandituApi.getUrlByImgc(props.tk);
      if (type === "cia") urlTemplate = tiandituApi.getUrlByCiac(props.tk);
      if (type === "ibo") urlTemplate = tiandituApi.getUrlByIboc(props.tk);
    } else {
      if (type === "vec") urlTemplate = tiandituApi.getUrlByVecw(props.tk);
      if (type === "cva") urlTemplate = tiandituApi.getUrlByCvaw(props.tk);
      if (type === "ter") urlTemplate = tiandituApi.getUrlByTerw(props.tk);
      if (type === "cta") urlTemplate = tiandituApi.getUrlByCtaw(props.tk);
      if (type === "img") urlTemplate = tiandituApi.getUrlByImgw(props.tk);
      if (type === "cia") urlTemplate = tiandituApi.getUrlByCiaw(props.tk);
      if (type === "ibo") urlTemplate = tiandituApi.getUrlByIbow(props.tk);
    }
    // 天地图图层配置信息
    let options = {
      spatialReference: {
        projection: proj
      },
      urlTemplate: urlTemplate,
      maxAvailableZoom: 18, //可用平铺的最大缩放级别。当以更高的缩放级别显示地图时，将使用来自最大可用缩放的分幅的数据。
      repeatWorld: false, // 关闭瓦片将在世界之外重复加载。
      subdomains: ["1", "2", "3", "4", "5"],
      visible: props.visible,
      minZoom: props.minZoom,
      maxZoom: props.maxZoom,
      zIndex: props.zIndex,
      cssFilter: cssFilter
    };
    // 若为经纬度EPSG4326则需要单独设置tileSystem
    if (proj === "EPSG:4326") options.tileSystem = [1, -1, -180, 90];
    // 接收图层配置信息并初始化图层对象
    let tileLayer = new TileLayer(id, options);
    // 向组件传送初始化完毕的layer
    context.emit("layerCreated", tileLayer);
    // 添加图层
    const { layer } = useLayer(tileLayer);
    // 将天地图图层对象向组件提供 (可供其他地方使用) 使用provide函数
    provide("tileLayer", layer);

    // 监听瓦片图层ID
    watch(
      () => props.id,
      newId => {
        if (tileLayer && newId) {
          tileLayer.setId(newId);
        }
      },
      { immediate: true }
    );

    // 监听瓦片图层透明度
    watch(
      () => props.opacity,
      newOpacity => {
        if (tileLayer && newOpacity) {
          tileLayer.setOpacity(newOpacity);
        }
      },
      { immediate: true }
    );

    // 监听瓦片图层高度
    watch(
      () => props.zIndex,
      newZIndex => {
        if (tileLayer && newZIndex) {
          tileLayer.setZIndex(newZIndex);
        }
      },
      { immediate: true }
    );

    // 页面加载后执行
    onBeforeMount(() => {
      // 初始化图层事件
      initEvents();
    });

    // 页面元素销毁之前执行
    onUnmounted(() => {
      removeAll();
    });

    // 初始化图层事件
    const initEvents = () => {
      if (!tileLayer) return;
      // 监听clear事件
      tileLayer.on("clear", event => {
        context.emit("clear", event);
      });
      // 监听id改变事件
      tileLayer.on("idchange", event => {
        context.emit("idchange", event);
      });
      // 图层高度改变事件
      tileLayer.on("setzindex", event => {
        context.emit("setzindex", event);
      });
      // 图层透明度改变事件
      tileLayer.on("setopacity", event => {
        context.emit("setopacity", event);
      });
      // 图层显示时候触发事件
      tileLayer.on("show", event => {
        context.emit("show", event);
      });
      // 图层显示时候触发事件
      tileLayer.on("hide", event => {
        context.emit("hide", event);
      });
      // renderer创建事件
      tileLayer.on("renderercreate", event => {
        context.emit("renderercreate", event);
      });
      // 关闭图层触发事件
      tileLayer.on("visiblechange", event => {
        context.emit("visiblechange", event);
      });
      // 数据源加载时候触发事件。
      tileLayer.on("resourceload", event => {
        context.emit("resourceload", event);
      });
      // canvas创建时候触发事件。
      tileLayer.on("canvascreate", event => {
        context.emit("canvascreate", event);
      });
      // 开始渲染事件
      tileLayer.on("renderstart", event => {
        context.emit("renderstart", event);
      });
      // 结束渲染事件
      tileLayer.on("renderend", event => {
        context.emit("renderend", event);
      });
    };

    // 移除地图所有图层销毁地图组件
    const removeAll = () => {
      // 删除图层和地图对象
      if (tileLayer) {
        tileLayer.remove();
        tileLayer = undefined;
      }
    };

    return {
      tileLayer
    };
  }
});
</script>
