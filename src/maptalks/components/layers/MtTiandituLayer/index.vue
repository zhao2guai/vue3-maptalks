<template>
  <div><slot /></div>
</template>
<script>
import {
  inject,
  provide,
  onBeforeUnmount,
  onBeforeMount,
  watch,
  defineComponent
} from "vue";
import { buildUUID } from "@pureadmin/utils";
import { TileLayer } from "maptalks";
import { tiandituApi } from "./tianditu.ts";
export default defineComponent({
  /** 初始化天地图图层组件 */
  name: "mt-tianditu-layer",
  props: {
    // tile图层id
    id: {
      type: String,
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
    // 定义瓦片图层对象
    let tileLayer = null;
    // 获取坐标系
    let proj = props.projection ? props.projection : "EPSG:4326";
    // 获取图层类型
    let type = props.layerType ? props.layerType : "img";
    // 获取图层ID
    let id = props.id ? props.id : buildUUID();
    // 是否开启图层滤镜
    let cssFilter = props.cssFilter ? props.cssFilter : null;
    // 获取天地图URL
    let url = "";
    if (!props.tk) console.error("天地图密匙不能为空!");
    if (type === "vec") url = tiandituApi.getUrlByVecc(props.tk);
    if (type === "cva") url = tiandituApi.getUrlByCvac(props.tk);
    if (type === "ter") url = tiandituApi.getUrlByTerc(props.tk);
    if (type === "cta") url = tiandituApi.getUrlByCtac(props.tk);
    if (type === "img") url = tiandituApi.getUrlByImgc(props.tk);
    if (type === "cia") url = tiandituApi.getUrlByCiac(props.tk);
    if (type === "ibo") url = tiandituApi.getUrlByIboc(props.tk);
    // 若图层url和id为空则返回
    if (url) {
      // 接收图层配置信息并初始化图层对象
      tileLayer = new TileLayer(id, {
        tileSystem: [1, -1, -180, 90],
        spatialReference: {
          projection: proj
        },
        urlTemplate: url,
        maxAvailableZoom: 18,
        subdomains: ["1", "2", "3", "4", "5"],
        visible: props.visible,
        minZoom: props.minZoom,
        maxZoom: props.maxZoom,
        zIndex: props.zIndex,
        cssFilter: cssFilter
      });
    }
    // 向组件传送初始化完毕的layer
    context.emit("layerCreated", tileLayer);
    // 将天地图图层对象向组件提供 (可供其他地方使用) 使用provide函数
    provide("tileLayer", tileLayer);

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
      addTileLayer();
      initEvents();
    });

    // 页面元素销毁之前执行
    onBeforeUnmount(() => {
      removeAll();
    });

    // 添加天地图图层
    const addTileLayer = () => {
      // 获取插槽的上级组件 (groupGLLayer优先插入其次groupTileLayer最后才是map)
      const groupGLLayer = inject("groupGLLayer", null);
      // 若是GL图层存在则优先添加到它里面
      if (groupGLLayer) {
        groupGLLayer.addLayer(tileLayer);
        return;
      }
      // 再次判断图层组
      const groupTileLayer = inject("groupTileLayer", null);
      if (groupTileLayer) {
        let layers = groupTileLayer.getLayers();
        layers.push(tileLayer);
        groupTileLayer.addLayer(layers);
        return;
      }
      // 获取上级组件中的地图对象
      let maptalks = inject("maptalks", null);
      let map = maptalks.value;
      // 若不存在任何图层组则判断地图对象是否加载并添加至map的layers数组中
      if (map && map.isLoaded()) {
        tileLayer.addTo(map);
        return;
      }
    };

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
