<template>
  <div>
    <slot />
  </div>
</template>

<script>
import {
  defineComponent,
  onBeforeMount,
  onBeforeUnmount,
  inject,
  watch
} from "vue";
import { GeoJSONVectorTileLayer } from "@maptalks/gl-layers";
import { buildUUID } from "@pureadmin/utils";
export default defineComponent({
  // GeoJSONVectorTileLayer是VectorTileLayer的子类,区别在于其是对geojson文件在前端自动切片的图层.
  name: "mt-geojson-vector-tile-layer",

  props: {
    // GeoJSON图层id
    id: {
      type: [String, Number],
      default: ""
    },
    // GeoJSON图层配置
    options: {
      type: Object,
      default: () => ({
        data: {
          type: "FeatureCollection",
          features: []
        }
      })
    }
  },

  setup(props, context) {
    // 获取图层ID
    let id = props.id ? props.id : buildUUID();
    // 获取图层样式
    let options = props.options ? props.options : null;
    // 接收图层配置信息并初始化图层对象
    let geoJSONVectorTileLayer = new GeoJSONVectorTileLayer(id, options);

    // 监听GeoJSON图层ID
    watch(
      () => props.id,
      newId => {
        if (geoJSONVectorTileLayer && newId) {
          geoJSONVectorTileLayer.setId(newId);
        }
      },
      { immediate: true }
    );

    // 监听GeoJSON图层配置
    watch(
      () => props.options,
      newVal => {
        if (geoJSONVectorTileLayer && newVal) {
          geoJSONVectorTileLayer.setOptions(newVal);
        }
      },
      { immediate: true, deep: true }
    );

    // 页面加载后执行
    onBeforeMount(() => {
      addGeoJSONVectorTileLayer();
      initEvents();
    });

    // 页面元素销毁之前执行
    onBeforeUnmount(() => {
      removeAll();
    });

    // 添加矢量瓦片图层
    const addGeoJSONVectorTileLayer = () => {
      // 判断更多图层...
      const groupGLLayer = inject("groupGLLayer", null);
      // 若是GL图层存在则优先添加到它里面
      if (groupGLLayer) {
        groupGLLayer.addLayer(geoJSONVectorTileLayer);
        return;
      }
    };

    // 初始化图层事件
    const initEvents = () => {
      if (!geoJSONVectorTileLayer) return;
      // geosjon图层数据成功加载事件
      geoJSONVectorTileLayer.on("dataload", event => {
        // // 获取上级组件中的地图对象
        // let maptalks = inject("maptalks", null);
        // let map = maptalks.value;
        // // 加载完成后自动设置地图范围为数据范围
        // if (map && map.isLoaded()) map.fitExtent(event.extent);
        context.emit("dataload", event);
      });
      // geosjon图层数据加载错误事件
      geoJSONVectorTileLayer.on("dataerror", event => {
        context.emit("dataerror", event);
      });
      // 环境光更新事件
      geoJSONVectorTileLayer.on("iblupdated", event => {
        context.emit("iblupdated", event);
      });
      // 图层画布产生绘制的事件
      geoJSONVectorTileLayer.on("canvasisdirty", event => {
        context.emit("canvasisdirty", event);
      });
      // worker准备就绪事件
      geoJSONVectorTileLayer.on("workerready", event => {
        context.emit("workerready", event);
      });
      // 获取到瓦片数据事件
      geoJSONVectorTileLayer.on("datareceived", event => {
        context.emit("datareceived", event);
      });
      // 渲染插件初始化结束事件
      geoJSONVectorTileLayer.on("pluginsinited", event => {
        context.emit("pluginsinited", event);
      });
      // 设置样式事件
      geoJSONVectorTileLayer.on("dataerror", event => {
        context.emit("dataerror", event);
      });
      // updatesceneconfig事件
      geoJSONVectorTileLayer.on("updatesceneconfig", event => {
        context.emit("updatesceneconfig", event);
      });
      // updatefeaturesceneconfig事件
      geoJSONVectorTileLayer.on("updatesceneconfig", event => {
        context.emit("updatesceneconfig", event);
      });
      // updatedataconfig事件
      geoJSONVectorTileLayer.on("updatedataconfig", event => {
        context.emit("updatedataconfig", event);
      });
      // updatefeaturesdataconfig事件
      geoJSONVectorTileLayer.on("updatesdataconfig", event => {
        context.emit("updatesdataconfig", event);
      });
      // updatesymbol事件
      geoJSONVectorTileLayer.on("updatesymbol", event => {
        context.emit("updatesymbol", event);
      });
      // updatefeaturesymbol事件
      geoJSONVectorTileLayer.on("updatefeaturesymbol", event => {
        context.emit("updatefeaturesymbol", event);
      });
      // 瓦片载入事件
      geoJSONVectorTileLayer.on("tileload", event => {
        context.emit("tileload", event);
      });
      // 瓦片载入错误事件
      geoJSONVectorTileLayer.on("tileerror", event => {
        context.emit("tileerror", event);
      });
      // 图层被清除事件
      geoJSONVectorTileLayer.on("clear", event => {
        context.emit("clear", event);
      });
      // 图层id变化事件
      geoJSONVectorTileLayer.on("idchange", event => {
        context.emit("idchange", event);
      });
      // renderer创建事件
      geoJSONVectorTileLayer.on("renderercreate", event => {
        context.emit("renderercreate", event);
      });
      // canvas创建事件
      geoJSONVectorTileLayer.on("canvascreate", event => {
        context.emit("canvascreate", event);
      });
      // 开始渲染事件
      geoJSONVectorTileLayer.on("renderstart", event => {
        context.emit("renderstart", event);
      });
      // 结束渲染事件
      geoJSONVectorTileLayer.on("renderend", event => {
        context.emit("renderend", event);
      });
    };

    // 移除并销毁图层对象
    const removeAll = () => {
      if (geoJSONVectorTileLayer) {
        geoJSONVectorTileLayer.remove();
        geoJSONVectorTileLayer = undefined;
      }
    };

    return {
      geoJSONVectorTileLayer
    };
  }
});
</script>
