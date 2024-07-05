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
  watch
} from "vue";
import { LineStringLayer } from "@maptalks/gl-layers";
import { buildUUID } from "@pureadmin/utils";
export default defineComponent({
  // 初始线数据绘制图层(支持添加LineString和MultiLineString，添加其他数据时会报错)
  name: "mt-line-string-layer",

  props: {
    // 线数据绘制图层id
    id: {
      type: [String, Number],
      default: ""
    },
    // 线数据绘制图层配置信息
    options: {
      type: Object,
      default: () => ({
        picking: true, // 是否允许图层用identify或identifyAtPoint方法查询数据
        textGamma: 1, // 文字的gamma值，可用于调整文字清晰度
        geometryEvents: true, // 是否允许Geometry响应事件
        styleScale: 1, // 图层图标和文字整体放大系数
        visible: true, // 图层是否隐藏
        opacity: 1, // 图层透明度
        hitDetect: false // 是否开启图层绘制检测（动态鼠标样式），关闭可以提高性能
      })
    }
  },

  setup(props, context) {
    // 获取图层ID
    let id = props.id ? props.id : buildUUID();

    // 接收图层配置信息并初始化图层对象
    let lineStringLayer = new LineStringLayer(id, props.options);
    // 向组件传送初始化完毕的layer
    context.emit("layerCreated", lineStringLayer);
    // 提供lineStringLayer给子组件使用或调用layer方法时使用
    provide("lineStringLayer", lineStringLayer);

    // 监听线数据绘制图层ID
    watch(
      () => props.id,
      newId => {
        if (lineStringLayer && newId) {
          lineStringLayer.setId(newId);
        }
      },
      { immediate: true }
    );

    // 监听线数据绘制图层配置信息
    watch(
      () => props.options,
      newOptions => {
        if (lineStringLayer && newOptions) {
          lineStringLayer.setOptions(newOptions);
        }
      },
      { immediate: true, deep: true }
    );

    // 页面加载后执行
    onBeforeMount(() => {
      addLineStringLayer();
      initEvents();
    });

    // 页面元素销毁之前执行
    onUnmounted(() => {
      removeAll();
    });

    // 添加矢量瓦片图层
    const addLineStringLayer = () => {
      // 判断更多图层...
      const groupGLLayer = inject("groupGLLayer", null);
      // 若是GL图层存在则优先添加到它里面
      if (groupGLLayer) {
        groupGLLayer.addLayer(lineStringLayer);
        return;
      }
      // 如果没有GL图层存在，则从全局map对象获取并添加到其中
      const map = inject("map", null);
      if (map) {
        map.addLayer(lineStringLayer);
      }
    };

    // 初始化图层事件
    const initEvents = () => {
      if (!lineStringLayer) return;
      // 图层画布产生绘制的事件
      lineStringLayer.on("canvasisdirty", event => {
        context.emit("canvasisdirty", event);
      });
      // 添加Geometry事件
      lineStringLayer.on("addgeo", event => {
        context.emit("addgeo", event);
      });
      // 移除Geometry事件
      lineStringLayer.on("removegeo", event => {
        context.emit("removegeo", event);
      });
      // 调用图层setStyle设置图层样式后的事件
      lineStringLayer.on("setstyle", event => {
        context.emit("setstyle", event);
      });
      // 调用图层removeStyle清除图层样式后的事件
      lineStringLayer.on("removestyle", event => {
        context.emit("removestyle", event);
      });
      // 监听图层被清除事件
      lineStringLayer.on("clear", event => {
        context.emit("clear", event);
      });
      // 监听图层id变化事件
      lineStringLayer.on("idchange", event => {
        context.emit("idchange", event);
      });
      // 监听renderer创建事件
      lineStringLayer.on("renderercreate", event => {
        context.emit("renderercreate", event);
      });
      // canvas创建事件
      lineStringLayer.on("canvascreate", event => {
        context.emit("canvascreate", event);
      });
      // 开始渲染事件
      lineStringLayer.on("renderstart", event => {
        context.emit("renderstart", event);
      });
      // 结束渲染事件
      lineStringLayer.on("renderend", event => {
        context.emit("renderend", event);
      });
    };

    // 移除并销毁图层对象
    const removeAll = () => {
      if (lineStringLayer) {
        lineStringLayer.remove();
        lineStringLayer = undefined;
      }
    };

    return {
      lineStringLayer
    };
  }
});
</script>
