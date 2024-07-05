<template>
  <div><slot /></div>
</template>
<script>
import {
  watch,
  inject,
  provide,
  onBeforeMount,
  onUnmounted,
  defineComponent
} from "vue";
import { buildUUID } from "@pureadmin/utils";
import { GroupTileLayer } from "maptalks";
export default defineComponent({
  /** 初始化图层组件 */
  name: "mt-group-tile-layer",
  props: {
    // 图层组id
    id: {
      type: [String, Number],
      default: ""
    },
    // 图层组配置信息
    options: {
      type: Object,
      default: () => ({
        tileSystem: [1, -1, -180, 90],
        spatialReference: {
          projection: "EPSG:4326"
        },
        urlTemplate: "",
        maxAvailableZoom: 18,
        subdomains: ["1", "2", "3", "4", "5"]
      })
    }
  },

  setup(props, context) {
    // 获取图层ID
    let id = props.id ? props.id : buildUUID();
    // 定义图层组组对象
    let groupTileLayer = new GroupTileLayer(id, [], props.options);

    // 将图层添加到注册组件中提供给子组件调用
    provide("groupTileLayer", groupTileLayer);
    // 向组件传送初始化完毕的layer
    context.emit("layerCreated", groupTileLayer);

    // 监听图层ID
    watch(
      () => props.id,
      newId => {
        if (groupTileLayer && newId) {
          groupTileLayer.setId(newId);
        }
      },
      { immediate: true }
    );
    // 监听图层配置信息
    watch(
      () => props.options,
      newOptions => {
        if (groupTileLayer && newOptions) {
          groupTileLayer.setOptions(newOptions);
        }
      },
      { immediate: true, deep: true }
    );

    // 页面加载后执行
    onBeforeMount(() => {
      addGroupLayer();
      initEvents();
    });

    // 页面元素销毁之前执行
    onUnmounted(() => {
      removeAll();
    });

    // 添加图层组
    const addGroupLayer = () => {
      // 判断更多图层...
      const groupGLLayer = inject("groupGLLayer", null);
      // 若是GL图层存在则优先添加到它里面
      if (groupGLLayer) {
        groupGLLayer.addLayer(groupTileLayer);
        return;
      }
      // 获取上级组件中的地图对象
      let maptalks = inject("maptalks", null);
      // 获取地图对象
      let map = maptalks.value;
      // 若不存在任何图层组则判断地图对象是否加载并添加至map的layers数组中
      if (map) {
        groupTileLayer.addTo(map);
        return;
      }
      // 获取上级组件是否是BaseLayer
      let baseLayer = inject("baseLayer", null);
      // 若是存在底图图层还要判断里面是否有其他的图层，因为底图中只能放一个
      if (map && baseLayer) {
        // 若是底图中已有其他图层则返回
        if (!map.getBaseLayer()) map.setBaseLayer(groupTileLayer);
        return;
      } else {
        return;
      }
    };

    // 初始化图层事件
    const initEvents = () => {
      if (!groupTileLayer) return;
      // 监听clear事件
      groupTileLayer.on("clear", event => {
        context.emit("clear", event);
      });
      // 监听id改变事件
      groupTileLayer.on("idchange", event => {
        context.emit("idchange", event);
      });
      // 图层高度改变事件
      groupTileLayer.on("setzindex", event => {
        context.emit("setzindex", event);
      });
      // 图层透明度改变事件
      groupTileLayer.on("setopacity", event => {
        context.emit("setopacity", event);
      });
      // 图层显示时候触发事件
      groupTileLayer.on("show", event => {
        context.emit("show", event);
      });
      // 图层显示时候触发事件
      groupTileLayer.on("hide", event => {
        context.emit("hide", event);
      });
      // renderer创建事件
      groupTileLayer.on("renderercreate", event => {
        context.emit("renderercreate", event);
      });
      // 关闭图层触发事件
      groupTileLayer.on("visiblechange", event => {
        context.emit("visiblechange", event);
      });
      // 数据源加载时候触发事件。
      groupTileLayer.on("resourceload", event => {
        context.emit("resourceload", event);
      });
      // canvas创建时候触发事件。
      groupTileLayer.on("canvascreate", event => {
        context.emit("canvascreate", event);
      });
      // 开始渲染事件
      groupTileLayer.on("renderstart", event => {
        context.emit("renderstart", event);
      });
      // 结束渲染事件
      groupTileLayer.on("renderend", event => {
        context.emit("renderend", event);
      });
    };

    // 移除地图所有图层销毁地图组件
    const removeAll = () => {
      // 删除图层和地图对象
      if (groupTileLayer) {
        groupTileLayer.clearLayers();
        groupTileLayer.remove();
        groupTileLayer = undefined;
      }
    };

    return {
      groupTileLayer
    };
  }
});
</script>
