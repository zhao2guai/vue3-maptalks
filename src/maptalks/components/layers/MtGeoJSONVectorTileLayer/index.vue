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
      if (geoJSONVectorTileLayer) {
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
      }
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
