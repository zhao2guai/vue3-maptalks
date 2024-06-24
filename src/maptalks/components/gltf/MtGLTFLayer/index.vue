<template>
  <div v-if="false" />
</template>

<script>
import {
  defineComponent,
  onBeforeUnmount,
  onBeforeMount,
  inject,
  provide
} from "vue";
import { buildUUID } from "@pureadmin/utils";
import { GLTFLayer } from "@maptalks/gl-layers";

export default defineComponent({
  /** 初始化webgl图层组件 */
  name: "mt-gltf-layer",

  props: {
    // gltf图层id
    id: {
      type: String,
      default: ""
    },
    //gltf图层配置
    options: {
      type: Object,
      default: () => ({
        attribution: "",
        minZoom: 1,
        maxZoom: 18,
        visible: true,
        opacity: 1
        // ... 更多参照OverlayLayer文档
      })
    },
    //gltf图层样式
    style: {
      type: Array,
      default: () => []
    }
  },

  setup(props, context) {
    // 获取图层ID
    let id = props.id ? props.id : buildUUID();

    // 初始化gltf三维模型绘制图层
    let gltfLayer = new GLTFLayer(props.id);

    // 判断如果含有图层配置
    if (props.options) {
      gltfLayer.setOptions(props.options);
    }

    // 判断是否含有图层样式
    if (props.style.length > 0) {
      gltfLayer.setStyle(props.style);
    }

    // 将gltf图层添加到注册组件中提供给子组件调用
    provide("gltfLayer", gltfLayer);
    // 向组件传送初始化完毕的layer
    context.emit("layerCreated", gltfLayer);

    // 页面加载后执行
    onBeforeMount(() => {
      addGLTFLayer();
      initEvents();
    });

    // 页面元素销毁之前执行
    onBeforeUnmount(() => {
      removeAll();
    });

    // 添加gltf三维模型绘制图层
    const addGLTFLayer = () => {
      // 判断更多图层...
      const groupGLLayer = inject("groupGLLayer", null);
      // 若是GL图层存在则优先添加到它里面
      if (groupGLLayer) {
        groupGLLayer.addLayer(gltfLayer);
        return;
      }
    };

    // 初始化图层事件
    const initEvents = () => {
      if (!gltfLayer) return;
      // 更新Layer的style中序号为index的symbol的updatesymbol事件
      gltfLayer.on("updatesymbol", event => {
        context.emit("updatesymbol", event);
      });
      // worker准备就绪事件
      gltfLayer.on("workerready", event => {
        context.emit("workerready", event);
      });
      // 模型加载错误事件
      gltfLayer.on("modelerror", event => {
        context.emit("modelerror", event);
      });
      // 模型加载成功事件
      gltfLayer.on("modelload", event => {
        context.emit("modelload", event);
      });
      // 添加Geometry事件
      gltfLayer.on("addgeo", event => {
        context.emit("addgeo", event);
      });
      // 移除Geometry事件
      gltfLayer.on("removegeo", event => {
        context.emit("removegeo", event);
      });
      // 调用图层setStyle设置图层样式后的事件
      gltfLayer.on("setstyle", event => {
        context.emit("setstyle", event);
      });
      // 调用图层removeStyle清除图层样式后的事件
      gltfLayer.on("removestyle", event => {
        context.emit("removestyle", event);
      });
      // 图层被清除事件
      gltfLayer.on("clear", event => {
        context.emit("clear", event);
      });
      // 图层id变化事件
      gltfLayer.on("idchange", event => {
        context.emit("idchange", event);
      });
      // renderer创建事件
      gltfLayer.on("renderercreate", event => {
        context.emit("renderercreate", event);
      });
      // canvas创建事件
      gltfLayer.on("canvascreate", event => {
        context.emit("canvascreate", event);
      });
      // 开始渲染事件
      gltfLayer.on("renderstart", event => {
        context.emit("renderstart", event);
      });
      // 结束渲染事件
      gltfLayer.on("renderend", event => {
        context.emit("renderend", event);
      });
    };

    // 移除地图gltf三维模型绘制图层
    const removeAll = () => {
      if (gltfLayer) {
        gltfLayer.clear();
        gltfLayer.remove();
        gltfLayer = undefined;
      }
    };

    return {
      gltfLayer
    };
  }
});
</script>

<style lang="scss" scoped></style>
