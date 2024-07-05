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
import { PolygonLayer } from "@maptalks/gl-layers";
import { buildUUID } from "@pureadmin/utils";
export default defineComponent({
  // 初始线数据绘制图层(支持添加Polygon和MultiPolygon，添加其他数据时会报错)
  name: "mt-polygon-layer",

  props: {
    // 点数据绘制图层id
    id: {
      type: [String, Number],
      default: ""
    },
    // 点数据绘制图层配置信息
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
    let polygonLayer = new PolygonLayer(id, props.options);
    // 向组件传送初始化完毕的layer
    context.emit("layerCreated", polygonLayer);
    // 将图层对象作为provider向下传递
    provide("polygonLayer", polygonLayer);
    // 监听点数据绘制图层ID
    watch(
      () => props.id,
      newId => {
        if (polygonLayer && newId) {
          polygonLayer.setId(newId);
        }
      },
      { immediate: true }
    );

    // 监听点数据绘制图层配置信息
    watch(
      () => props.options,
      newOptions => {
        if (polygonLayer && newOptions) {
          polygonLayer.setOptions(newOptions);
        }
      },
      { immediate: true, deep: true }
    );

    // 页面加载后执行
    onBeforeMount(() => {
      addPolygonLayer();
      initEvents();
    });

    // 页面元素销毁之前执行
    onUnmounted(() => {
      removeAll();
    });

    // 添加矢量瓦片图层
    const addPolygonLayer = () => {
      // 判断更多图层...
      const groupGLLayer = inject("groupGLLayer", null);
      // 若是GL图层存在则优先添加到它里面
      if (groupGLLayer) {
        groupGLLayer.addLayer(polygonLayer);
        return;
      }

      const map = inject("map", null);
      if (map) {
        map.addLayer(polygonLayer);
      }
    };

    // 初始化图层事件
    const initEvents = () => {
      if (!polygonLayer) return;
      // 图层画布产生绘制的事件
      polygonLayer.on("canvasisdirty", event => {
        context.emit("canvasisdirty", event);
      });
      // 添加Geometry事件
      polygonLayer.on("addgeo", event => {
        context.emit("addgeo", event);
      });
      // 移除Geometry事件
      polygonLayer.on("removegeo", event => {
        context.emit("removegeo", event);
      });
      // 调用图层setStyle设置图层样式后的事件
      polygonLayer.on("setstyle", event => {
        context.emit("setstyle", event);
      });
      // 调用图层removeStyle清除图层样式后的事件
      polygonLayer.on("removestyle", event => {
        context.emit("removestyle", event);
      });
      // 监听图层被清除事件
      polygonLayer.on("clear", event => {
        context.emit("clear", event);
      });
      // 监听图层id变化事件
      polygonLayer.on("idchange", event => {
        context.emit("idchange", event);
      });
      // 监听renderer创建事件
      polygonLayer.on("renderercreate", event => {
        context.emit("renderercreate", event);
      });
      // canvas创建事件
      polygonLayer.on("canvascreate", event => {
        context.emit("canvascreate", event);
      });
      // 开始渲染事件
      polygonLayer.on("renderstart", event => {
        context.emit("renderstart", event);
      });
      // 结束渲染事件
      polygonLayer.on("renderend", event => {
        context.emit("renderend", event);
      });
    };

    // 移除并销毁图层对象
    const removeAll = () => {
      if (polygonLayer) {
        polygonLayer.remove();
        polygonLayer = undefined;
      }
    };

    return {
      polygonLayer
    };
  }
});
</script>
