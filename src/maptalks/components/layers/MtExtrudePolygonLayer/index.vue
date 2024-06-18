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
  provide,
  watch
} from "vue";
import { buildUUID } from "@pureadmin/utils";
import { ExtrudePolygonLayer } from "@maptalks/gl-layers";

export default defineComponent({
  // 三维多边形图层(管理图形面（Polygon）数据的)
  name: "mt-extrude-polygon-layer",

  props: {
    // 图层id
    id: {
      type: [String, Number],
      default: ""
    },
    // 图层配置
    options: {
      type: Object,
      default: () => ({})
    }
  },

  setup(props, context) {
    // 获取图层ID
    let id = props.id ? props.id : buildUUID();
    // 获取图层样式
    let options = props.options ? props.options : null;
    // 接收图层配置信息并初始化图层对象
    let extrudePolygonLayer = new ExtrudePolygonLayer(id, options);
    // 图层创建后的回调
    context.emit("layerCreated", extrudePolygonLayer);
    // 提供图层对象给后代组件使用
    provide("extrudePolygonLayer", extrudePolygonLayer);

    // 监听图层ID
    watch(
      () => props.id,
      newId => {
        if (extrudePolygonLayer && newId) {
          extrudePolygonLayer.setId(newId);
        }
      },
      { immediate: true }
    );

    // 监听图层配置
    watch(
      () => props.options,
      newVal => {
        if (extrudePolygonLayer && newVal) {
          extrudePolygonLayer.setOptions(newVal);
        }
      },
      { immediate: true, deep: true }
    );

    // 页面加载后执行
    onBeforeMount(() => {
      addExtrudePolygonLayer();
      initEvents();
    });

    // 页面元素销毁之前执行
    onBeforeUnmount(() => {
      removeAll();
    });

    // 添加三维多边形图层
    const addExtrudePolygonLayer = () => {
      // 获取上级组件中的地图对象
      let maptalks = inject("maptalks", null);
      let map = maptalks.value;
      // 判断地图是否存在
      if (map && map.isLoaded()) {
        // 判断更多图层...
        const groupGLLayer = inject("groupGLLayer", null);
        // 若是GL图层存在则优先添加到它里面
        if (groupGLLayer) {
          groupGLLayer.addLayer(extrudePolygonLayer);
          return;
        }
      }
    };

    // 初始化图层事件
    const initEvents = () => {
      if (extrudePolygonLayer) {
        // 图层地理数据添加时候触发
        extrudePolygonLayer.on("addgeo", event => {
          context.emit("addgeo", event);
        });
        // 图层地理数据被移除事件
        extrudePolygonLayer.on("removegeo", event => {
          context.emit("removegeo", event);
        });
        // 图层被清除事件
        extrudePolygonLayer.on("clear", event => {
          context.emit("clear", event);
        });
        // 图层ID改变事件
        extrudePolygonLayer.on("idchange", event => {
          context.emit("idchange", event);
        });
        // 图层高度改变事件
        extrudePolygonLayer.on("setzindex", event => {
          context.emit("setzindex", event);
        });
        // 图层透明度改变事件
        extrudePolygonLayer.on("setopacity", event => {
          context.emit("setopacity", event);
        });
        // 图层展示时候触发的事件
        extrudePolygonLayer.on("show", event => {
          context.emit("show", event);
        });
        // 图层隐藏时候触发的事件
        extrudePolygonLayer.on("hide", event => {
          context.emit("hide", event);
        });
        // visible改变事件
        extrudePolygonLayer.on("visiblechange", event => {
          context.emit("visiblechange", event);
        });
        // resource加载事件
        extrudePolygonLayer.on("resourceload", event => {
          context.emit("resourceload", event);
        });
        // canvas创建事件
        extrudePolygonLayer.on("canvascreate", event => {
          context.emit("canvascreate", event);
        });
        // 渲染创建事件。
        extrudePolygonLayer.on("renderercreate", event => {
          context.emit("renderercreate", event);
        });
        // 开始渲染事件。
        extrudePolygonLayer.on("renderstart", event => {
          context.emit("renderstart", event);
        });
        // 结束渲染事件
        extrudePolygonLayer.on("renderend", event => {
          context.emit("renderend", event);
        });
      }
    };

    // 移除并销毁图层对象
    const removeAll = () => {
      // 判断并删除Three图层
      if (extrudePolygonLayer) {
        extrudePolygonLayer.remove();
        extrudePolygonLayer = undefined;
      }
    };

    return {
      extrudePolygonLayer
    };
  }
});
</script>
