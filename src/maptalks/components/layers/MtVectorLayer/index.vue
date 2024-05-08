<template>
  <div>
    <slot />
  </div>
</template>

<script>
import {
  defineComponent,
  inject,
  onUnmounted,
  onBeforeMount,
  watch
} from "vue";
import { VectorLayer } from "maptalks";
import { buildUUID } from "@pureadmin/utils";
export default defineComponent({
  // 初始化矢量图层
  name: "mt-vector-layer",

  props: {
    // 矢量图层id
    id: {
      type: [String, Number],
      default: ""
    },
    // 矢量图层配置信息
    options: {
      type: Object,
      default: null
    }
  },

  setup(props, context) {
    // 获取图层ID和配置
    let id = props.id ? props.id : buildUUID();
    let options = props.options ? props.options : null;
    // 接收图层配置信息并初始化图层对象
    let vectorLayer = new VectorLayer(id, options);
    // 图层对象创建完毕后的回调
    context.emit("layerCreated", vectorLayer);

    // 监听矢量图层ID
    watch(
      () => props.id,
      newId => {
        if (vectorLayer && newId) {
          vectorLayer.setId(newId);
        }
      },
      { immediate: true }
    );
    // 监听矢量图层配置信息
    watch(
      () => props.options,
      newOptions => {
        if (vectorLayer && newOptions) {
          vectorLayer.setOptions(newOptions);
        }
      },
      { immediate: true, deep: true }
    );

    // 页面加载后执行
    onBeforeMount(() => {
      addVectorLayer();
      initEvents();
    });

    // 页面元素销毁之前执行
    onUnmounted(() => {
      removeAll();
    });

    // 添加矢量图层
    const addVectorLayer = () => {
      // 获取上级组件中的地图对象
      let maptalks = inject("maptalks", null);
      // 获取地图对象
      let map = maptalks.value;
      // 若不存在任何图层组则判断地图对象是否加载并添加至map的layers数组中
      if (map && map.isLoaded()) {
        vectorLayer.addTo(map);
        return;
      }
    };

    // 初始化图层事件
    const initEvents = () => {
      if (!vectorLayer) return;
      // 设置样式时触发事件
      vectorLayer.on("setstyle", event => {
        context.emit("setstyle", event);
      });
      // 移除样式时触发事件
      vectorLayer.on("removestyle", event => {
        context.emit("removestyle", event);
      });
      // 添加geo数据触发事件
      vectorLayer.on("addgeo", event => {
        context.emit("addgeo", event);
      });
      // 移除geo数据触发事件
      vectorLayer.on("removegeo", event => {
        context.emit("removegeo", event);
      });
      // 监听clear事件
      vectorLayer.on("clear", event => {
        context.emit("clear", event);
      });
      // 监听id改变事件
      vectorLayer.on("idchange", event => {
        context.emit("idchange", event);
      });
      // 图层高度改变事件
      vectorLayer.on("setzindex", event => {
        context.emit("setzindex", event);
      });
      // 图层透明度改变事件
      vectorLayer.on("setopacity", event => {
        context.emit("setopacity", event);
      });
      // 图层显示时候触发事件
      vectorLayer.on("show", event => {
        context.emit("show", event);
      });
      // 图层显示时候触发事件
      vectorLayer.on("hide", event => {
        context.emit("hide", event);
      });
      // renderer创建事件
      vectorLayer.on("renderercreate", event => {
        context.emit("renderercreate", event);
      });
      // 关闭图层触发事件
      vectorLayer.on("visiblechange", event => {
        context.emit("visiblechange", event);
      });
      // 数据源加载时候触发事件。
      vectorLayer.on("resourceload", event => {
        context.emit("resourceload", event);
      });
      // canvas创建时候触发事件。
      vectorLayer.on("canvascreate", event => {
        context.emit("canvascreate", event);
      });
      // 开始渲染事件
      vectorLayer.on("renderstart", event => {
        context.emit("renderstart", event);
      });
      // 结束渲染事件
      vectorLayer.on("renderend", event => {
        context.emit("renderend", event);
      });
    };

    // 移除并销毁图层对象
    const removeAll = () => {
      if (vectorLayer) {
        vectorLayer.remove();
        vectorLayer = undefined;
      }
    };

    return {
      vectorLayer
    };
  }
});
</script>
