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
import { Geo3DTilesLayer } from "@maptalks/gl-layers";
import "@maptalks/transcoders.draco";
import "@maptalks/transcoders.crn";
import "@maptalks/transcoders.ktx2";

export default defineComponent({
  // 3DTiles渲染图层
  name: "mt-geo3d-tile-layer",

  props: {
    // Geo3D图层id
    id: {
      type: [String, Number],
      default: ""
    },
    // Geo3D图层配置
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
    let geo3DTilesLayer = new Geo3DTilesLayer(id, options);
    // 向组件传送初始化完毕的layer
    context.emit("layerCreated", geo3DTilesLayer);
    // 将图层对象提供到后代组件里。在其他组件中，可以通过inject的方式访问到该属性
    provide("geo3DTilesLayer", geo3DTilesLayer);
    // 监听图层ID
    watch(
      () => props.id,
      newId => {
        if (geo3DTilesLayer && newId) {
          geo3DTilesLayer.setId(newId);
        }
      },
      { immediate: true }
    );

    // 监听图层配置
    watch(
      () => props.options,
      newVal => {
        if (geo3DTilesLayer && newVal) {
          geo3DTilesLayer.setOptions(newVal);
        }
      },
      { immediate: true, deep: true }
    );

    // 页面加载后执行
    onBeforeMount(() => {
      addGeo3DTilesLayer();
      initEvents();
    });

    // 页面元素销毁之前执行
    onBeforeUnmount(() => {
      removeAll();
    });

    // 添加Geo3D图层
    const addGeo3DTilesLayer = () => {
      // 判断更多图层...
      const groupGLLayer = inject("groupGLLayer", null);
      // 若是GL图层存在则优先添加到它里面
      if (groupGLLayer) {
        groupGLLayer.addLayer(geo3DTilesLayer);
        return;
      }
    };

    // 初始化图层事件
    const initEvents = () => {
      if (geo3DTilesLayer) {
        // 监听workerready事件
        geo3DTilesLayer.on("workerready", event => {
          context.emit("workerready", event);
        });
        // 初始化根节点结束事件。
        geo3DTilesLayer.on("rootready", event => {
          context.emit("rootready", event);
        });
        // 成功加载tileset.json事件。
        geo3DTilesLayer.on("loadtileset", event => {
          context.emit("loadtileset", event);
        });
        // 瓦片载入事件
        geo3DTilesLayer.on("tileload", event => {
          context.emit("tileload", event);
        });
        // 瓦片载入错误事件
        geo3DTilesLayer.on("tileerror", event => {
          context.emit("tileerror", event);
        });
        // 图层画布产生绘制的事件
        geo3DTilesLayer.on("canvasisdirty", event => {
          context.emit("canvasisdirty", event);
        });
        // 图层被清除事件
        geo3DTilesLayer.on("clear", event => {
          context.emit("clear", event);
        });
        // 图层id变化事件
        geo3DTilesLayer.on("idchange", event => {
          context.emit("idchange", event);
        });
        // renderer创建事件
        geo3DTilesLayer.on("renderercreate", event => {
          context.emit("renderercreate", event);
        });
        // canvas创建事件
        geo3DTilesLayer.on("canvascreate", event => {
          context.emit("canvascreate", event);
        });
        // 开始渲染事件。
        geo3DTilesLayer.on("renderstart", event => {
          context.emit("renderstart", event);
        });
        // 结束渲染事件
        geo3DTilesLayer.on("renderend", event => {
          context.emit("renderend", event);
        });
      }
    };

    // 移除并销毁图层对象
    const removeAll = () => {
      if (geo3DTilesLayer) {
        geo3DTilesLayer.remove();
        geo3DTilesLayer = undefined;
      }
    };

    return {
      geo3DTilesLayer
    };
  }
});
</script>
