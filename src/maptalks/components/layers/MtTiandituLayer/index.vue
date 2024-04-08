<template>
  <div><slot /></div>
</template>
<script>
import {
  inject,
  onBeforeUnmount,
  onBeforeMount,
  watch,
  defineComponent
} from "vue";
import { v4 as uuidv4 } from "uuid";
import { TileLayer } from "maptalks";
import { useMaptalksStoreHook } from "@/store/modules/maptalks";
import { tiandituApi } from "@/maptalks/config/tianditu.js";
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
    // 图层服务地址
    zIndex: {
      type: Number,
      default: 0
    }
  },

  setup(props, context) {
    // 获取地图对象
    let map = useMaptalksStoreHook().getMap;
    // 定义天地图图层组对象
    let tileLayer = null;

    // 页面加载后执行
    onBeforeMount(() => {
      if (props.tk) {
        addTileLayer();
      } else {
        console.error("天地图密匙不能为空!");
      }
    });

    // 页面元素销毁之前执行
    onBeforeUnmount(() => {
      removeAll();
    });

    // 监听天地图图层开关
    watch(
      () => props.visible,
      (newVal, oldVal) => {
        if (tileLayer && tileLayer.isLoaded()) {
          tileLayer.setOpacity(newVal);
        }
      },
      { immediate: true }
    );
    // 监听天地图图层透明度
    watch(
      () => props.opacity,
      (newVal, oldVal) => {
        if (tileLayer && tileLayer.isLoaded()) {
          tileLayer.setZIndex(newVal);
        }
      },
      { immediate: true }
    );
    // 监听天地图图层高度
    watch(
      () => props.zIndex,
      (newVal, oldVal) => {
        if (tileLayer && tileLayer.isLoaded()) {
          tileLayer.setZIndex(newVal);
        }
      },
      { immediate: true }
    );

    // 添加天地图图层
    const addTileLayer = () => {
      // 获取坐标系
      let proj = props.projection ? props.projection : "EPSG:4326";
      // 获取图层类型
      let type = props.layerType ? props.layerType : "img";
      // 获取图层ID
      let id = props.id ? props.id : uuidv4().replace(/-/g, "");
      // 获取天地图URL
      let url = "";
      if (type === "vec") url = tiandituApi.getUrlByVecc(props.tk);
      if (type === "cva") url = tiandituApi.getUrlByCvac(props.tk);
      if (type === "ter") url = tiandituApi.getUrlByTerc(props.tk);
      if (type === "cta") url = tiandituApi.getUrlByCtac(props.tk);
      if (type === "img") url = tiandituApi.getUrlByImgc(props.tk);
      if (type === "cia") url = tiandituApi.getUrlByCiac(props.tk);
      if (type === "ibo") url = tiandituApi.getUrlByIboc(props.tk);
      // 若图层url和id为空则返回
      if (!url) return;
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
        zIndex: props.zIndex
      });
      // 获取插槽的上级组件
      const groupGLLayer = inject("maptalks-groupGLLayer");
      // 若是GL图层存在则优先添加到它里面
      if (groupGLLayer) {
        groupGLLayer.addLayer(tileLayer);
      } else {
        // 若不存在任何图层组则判断地图对象是否加载并添加至map的layers数组中
        if (map && map.isLoaded()) {
          tileLayer.addTo(map);
        }
      }
      // 向组件传送初始化完毕的layer
      if (tileLayer && tileLayer.isLoaded()) {
        context.emit("getLayer", tileLayer);
      }
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
      tileLayer,
      removeAll
    };
  }
});
</script>
