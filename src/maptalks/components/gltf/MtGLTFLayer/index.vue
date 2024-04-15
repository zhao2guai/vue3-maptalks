<template>
  <div>
    <slot />
  </div>
</template>

<script>
import {
  defineComponent,
  inject,
  onBeforeUnmount,
  onBeforeMount,
  watch,
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
      default: []
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

    // 页面加载后执行
    onBeforeMount(() => {
      addGLTFLayer();
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
