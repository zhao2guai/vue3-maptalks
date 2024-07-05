<template>
  <div>
    <slot />
  </div>
</template>

<script>
import {
  defineComponent,
  onUnmounted,
  onBeforeMount,
  inject,
  provide,
  watch,
  ref
} from "vue";
import { buildUUID } from "@pureadmin/utils";
import { WMSTileLayer, ui } from "maptalks";
import TileLayerModel from "./TileLayerModel.js";
export default defineComponent({
  /** 初始化WMS图层组件 */
  name: "mt-wms-tile-layer",
  props: {
    // 服务图层id
    id: {
      type: [String, Number],
      default: ""
    },
    // 服务配置信息
    options: {
      type: Object,
      default: () => ({
        tileSystem: [1, -1, -180, 90],
        urlTemplate: "",
        crs: "EPSG:4326",
        layers: "",
        styles: "",
        version: "1.1.0",
        format: "image/png",
        transparent: true,
        uppercase: true
      })
    },
    // 服务请求参数
    params: {
      type: Object,
      default: () => ({})
    },
    // 是否开启要素识别
    isFeatureInfo: {
      type: Boolean,
      default: true
    }
  },

  setup(props, context) {
    // 获取坐标系
    let proj = props.options.crs ? props.options.crs : "EPSG:4326";
    // 获取图层ID
    let id = props.id ? props.id : buildUUID();
    // 接收图层配置信息并初始化图层对象
    let wmsLayer = new WMSTileLayer(id, props.options);
    // 向组件传送初始化完毕的layer
    context.emit("layerCreated", wmsLayer);
    // 在组件内部向外提供当前的图层对象，其他组件可以通过调用inject('wmsLayer')来使用这个图层对象。
    provide("wmsLayer", wmsLayer);
    // 设置ol数据源参数
    let properties = {
      url: props.options.urlTemplate,
      layers: props.options.layers,
      styles: props.options.styles,
      params: props.params,
      projection: proj
    };
    // openlayers图层对象
    let olTileLayer = ref(null);

    // 获取上级组件中的地图对象
    let maptalks = inject("maptalks", null);
    let map = maptalks.value;

    // 监听瓦片图层ID
    watch(
      () => props.id,
      newId => {
        if (wmsLayer && newId) {
          wmsLayer.setId(newId);
        }
      },
      { immediate: true }
    );

    // 监听服务配置信息
    watch(
      () => props.options,
      newOptions => {
        if (wmsLayer && newOptions) {
          wmsLayer.setOptions(newOptions);
          wmsLayer.forceReload();
        }
      },
      { immediate: true, deep: true }
    );

    // 监听ol图层查询参数
    watch(
      () => props.params,
      newVal => {
        // 判断SQL和ol图层是否存在
        if (newVal && olTileLayer.value) {
          let layer = olTileLayer.value;
          layer.getSource().updateParams(newVal);
        }
      },
      { deep: true }
    );

    // 页面加载后执行
    onBeforeMount(() => {
      addwmsLayer();
      initOlTileLayer();
      initEvents();
    });

    // 页面元素销毁之前执行
    onUnmounted(() => {
      removeAll();
    });

    // 添加瓦片图层
    const addwmsLayer = () => {
      // 判断更多图层...
      const groupGLLayer = inject("groupGLLayer", null);
      // 若是GL图层存在则优先添加到它里面
      if (groupGLLayer) {
        groupGLLayer.addLayer(wmsLayer);
        return;
      }
      // 再次判断图层组
      const groupTileLayer = inject("groupTileLayer", null);
      if (groupTileLayer && groupTileLayer.isLoaded()) {
        let layers = groupTileLayer.getLayers();
        layers.push(wmsLayer);
        groupTileLayer.addLayer(layers);
        return;
      }
      // 若不存在任何图层组则判断地图对象是否加载并添加至map的layers数组中
      if (map) {
        wmsLayer.addTo(map);
        return;
      }
    };

    // 初始化openlayers图层对象
    const initOlTileLayer = () => {
      if (props.isFeatureInfo && wmsLayer) {
        // 同步创建一个ol的图层对象
        olTileLayer.value = new TileLayerModel({
          // 设置图层主键
          id: buildUUID(),
          // 载入地图默认启用
          visible: true,
          // 设置图层透明度
          opacity: 1,
          // 此层可见的最小视图缩放级别（独占）
          minZoom: 1,
          // 此层可见的最大视图缩放级别（独占）
          maxZoom: 18,
          // 设置图层扩展参数
          properties: properties
        });
      }
    };

    // 初始化图层事件
    const initEvents = () => {
      if (!wmsLayer) return;
      // 监听clear事件
      wmsLayer.on("clear", event => {
        context.emit("clear", event);
      });
      // 监听id改变事件
      wmsLayer.on("idchange", event => {
        context.emit("idchange", event);
      });
      // 图层高度改变事件
      wmsLayer.on("setzindex", event => {
        context.emit("setzindex", event);
      });
      // 图层透明度改变事件
      wmsLayer.on("setopacity", event => {
        context.emit("setopacity", event);
      });
      // 图层显示时候触发事件
      wmsLayer.on("show", event => {
        context.emit("show", event);
      });
      // 图层显示时候触发事件
      wmsLayer.on("hide", event => {
        context.emit("hide", event);
      });
      // renderer创建事件
      wmsLayer.on("renderercreate", event => {
        context.emit("renderercreate", event);
      });
      // 关闭图层触发事件
      wmsLayer.on("visiblechange", event => {
        context.emit("visiblechange", event);
      });
      // 数据源加载时候触发事件。
      wmsLayer.on("resourceload", event => {
        context.emit("resourceload", event);
      });
      // canvas创建时候触发事件。
      wmsLayer.on("canvascreate", event => {
        context.emit("canvascreate", event);
      });
      // 开始渲染事件
      wmsLayer.on("renderstart", event => {
        context.emit("renderstart", event);
      });
      // 结束渲染事件
      wmsLayer.on("renderend", event => {
        context.emit("renderend", event);
      });
    };

    // 移除地图所有图层销毁地图组件
    const removeAll = () => {
      // 删除图层和地图对象
      if (wmsLayer) {
        wmsLayer.remove();
        wmsLayer = undefined;
      }
      // 销毁ol图层对象和参数
      if (olTileLayer.value) {
        properties = undefined;
        olTileLayer.value = undefined;
      }
    };

    // 获取openlayers瓦片图层方法
    const getOlLayer = () => {
      return olTileLayer.value;
    };

    return {
      wmsLayer,
      olTileLayer,
      getOlLayer
    };
  }
});
</script>
