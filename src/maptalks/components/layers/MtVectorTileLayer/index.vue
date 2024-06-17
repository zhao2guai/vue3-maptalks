<template>
  <div>
    <slot />
  </div>
</template>

<script>
import {
  defineComponent,
  inject,
  provide,
  onUnmounted,
  onBeforeMount,
  watch
} from "vue";
import { VectorTileLayer } from "@maptalks/gl-layers";
import { buildUUID } from "@pureadmin/utils";
export default defineComponent({
  // 初始化矢量瓦片图层
  name: "mt-vector-tile-layer",

  props: {
    // 矢量瓦片图层id
    id: {
      type: [String, Number],
      default: ""
    },
    // 矢量瓦片图层配置信息
    options: {
      type: Object,
      default: () => ({
        urlTemplate: "",
        style: []
      })
    }
  },

  setup(props, context) {
    // 获取图层ID
    let id = props.id ? props.id : buildUUID();

    // 接收图层配置信息并初始化图层对象
    let vectorTileLayer = new VectorTileLayer(id, props.options);
    // 向组件传送初始化完毕的layer
    context.emit("layerCreated", vectorTileLayer);
    // 将图层对象提供出去，以便其他组件可以使用
    provide("vectorTileLayer", vectorTileLayer);

    // 监听矢量瓦片图层ID
    watch(
      () => props.id,
      newId => {
        if (vectorTileLayer && newId) {
          vectorTileLayer.setId(newId);
        }
      },
      { immediate: true }
    );
    // 监听矢量瓦片图层配置信息
    watch(
      () => props.options,
      newOptions => {
        if (vectorTileLayer && newOptions) {
          vectorTileLayer.setOptions(newOptions);
        }
      },
      { immediate: true, deep: true }
    );

    // 页面加载后执行
    onBeforeMount(() => {
      addVectorTileLayer();
      initEvents();
    });

    // 页面元素销毁之前执行
    onUnmounted(() => {
      removeAll();
    });

    // 添加矢量瓦片图层
    const addVectorTileLayer = () => {
      // 判断更多图层...
      const groupGLLayer = inject("groupGLLayer", null);
      // 若是GL图层存在则优先添加到它里面
      if (groupGLLayer) {
        groupGLLayer.addLayer(vectorTileLayer);
        return;
      }
    };

    // 初始化图层事件
    const initEvents = () => {
      if (!vectorTileLayer) return;
      // 监听workerready事件
      vectorTileLayer.on("workerready", event => {
        // event为事件参数
        // console.log("worker is ready");
        context.emit("workerready", event);
      });
      // 监听clear事件
      vectorTileLayer.on("clear", event => {
        context.emit("clear", event);
      });
      // 监听id改变事件
      vectorTileLayer.on("idchange", event => {
        context.emit("idchange", event);
      });
      // 图层高度改变事件
      vectorTileLayer.on("setzindex", event => {
        context.emit("setzindex", event);
      });
      // 图层透明度改变事件
      vectorTileLayer.on("setopacity", event => {
        context.emit("setopacity", event);
      });
      // 图层显示时候触发事件
      vectorTileLayer.on("show", event => {
        context.emit("show", event);
      });
      // 图层显示时候触发事件
      vectorTileLayer.on("hide", event => {
        context.emit("hide", event);
      });
      // renderer创建事件
      vectorTileLayer.on("renderercreate", event => {
        context.emit("renderercreate", event);
      });
      // 关闭图层触发事件
      vectorTileLayer.on("visiblechange", event => {
        context.emit("visiblechange", event);
      });
      // 数据源加载时候触发事件。
      vectorTileLayer.on("resourceload", event => {
        context.emit("resourceload", event);
      });
      // canvas创建时候触发事件。
      vectorTileLayer.on("canvascreate", event => {
        context.emit("canvascreate", event);
      });
      // 开始渲染事件
      vectorTileLayer.on("renderstart", event => {
        context.emit("renderstart", event);
      });
      // 结束渲染事件
      vectorTileLayer.on("renderend", event => {
        context.emit("renderend", event);
      });
      // 瓦片载入事件
      vectorTileLayer.on("tileload", event => {
        context.emit("tileload", event);
      });
      // 瓦片载入错误事件
      vectorTileLayer.on("tileerror", event => {
        context.emit("tileerror", event);
      });
      // 环境光更新事件
      vectorTileLayer.on("iblupdated", event => {
        context.emit("iblupdated", event);
      });
      // 图层画布产生绘制的事件
      vectorTileLayer.on("canvasisdirty", event => {
        context.emit("canvasisdirty", event);
      });
      // worker准备就绪事件
      vectorTileLayer.on("workerready", event => {
        context.emit("workerready", event);
      });
      // 获取到瓦片数据事件
      vectorTileLayer.on("datareceived", event => {
        context.emit("datareceived", event);
      });
      // 渲染插件初始化结束事件
      vectorTileLayer.on("pluginsinited", event => {
        context.emit("pluginsinited", event);
      });
      // 设置样式事件
      vectorTileLayer.on("dataerror", event => {
        context.emit("dataerror", event);
      });
      // updatesceneconfig事件
      vectorTileLayer.on("updatesceneconfig", event => {
        context.emit("updatesceneconfig", event);
      });
      // updatefeaturesceneconfig事件
      vectorTileLayer.on("updatesceneconfig", event => {
        context.emit("updatesceneconfig", event);
      });
      // updatedataconfig事件
      vectorTileLayer.on("updatedataconfig", event => {
        context.emit("updatedataconfig", event);
      });
      // updatefeaturesdataconfig事件
      vectorTileLayer.on("updatesdataconfig", event => {
        context.emit("updatesdataconfig", event);
      });
      // updatesymbol事件
      vectorTileLayer.on("updatesymbol", event => {
        context.emit("updatesymbol", event);
      });
      // updatefeaturesymbol事件
      vectorTileLayer.on("updatefeaturesymbol", event => {
        context.emit("updatefeaturesymbol", event);
      });
    };

    // 移除并销毁图层对象
    const removeAll = () => {
      if (vectorTileLayer) {
        vectorTileLayer.remove();
        vectorTileLayer = undefined;
      }
    };

    return {
      vectorTileLayer
    };
  }
});
</script>
