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
import { buildUUID } from "@pureadmin/utils";
import { TileLayer } from "maptalks";
export default defineComponent({
  /** 初始化webgl图层组件 */
  name: "mt-tile-layer",
  props: {
    // tile图层id
    id: {
      type: String,
      default: ""
    },
    // 服务配置信息
    options: {
      type: Object,
      default: () => ({
        urlTemplate: "",
        tileSystem: [1, -1, -180, 90],
        spatialReference: {
          projection: "EPSG:4326"
        },
        subdomains: ["1", "2", "3", "4", "5"],
        attribution: ""
      })
    }
  },

  setup(props, context) {
    // 获取图层ID
    let id = props.id ? props.id : buildUUID();
    // 接收图层配置信息并初始化图层对象
    let tileLayer = new TileLayer(id, props.options);
    // 向组件传送初始化完毕的layer
    context.emit("getLayer", tileLayer);

    // 监听瓦片图层ID
    watch(
      () => props.id,
      (newVal, oldVal) => {
        if (tileLayer && newVal) {
          tileLayer.setId(newVal);
        }
      },
      { immediate: true }
    );

    // 监听图层配置信息
    watch(
      () => props.options,
      (newVal, oldVal) => {
        if (tileLayer && newVal) {
          tileLayer.setOptions(newVal);
        }
      },
      { deep: true }
    );

    // 页面加载后执行
    onBeforeMount(() => {
      addTileLayer();
    });

    // 页面元素销毁之前执行
    onBeforeUnmount(() => {
      removeAll();
    });

    // 添加瓦片图层
    const addTileLayer = () => {
      // 判断更多图层...
      const groupGLLayer = inject("groupGLLayer", null);
      // const groupTileLayer = inject("groupTileLayer");
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
