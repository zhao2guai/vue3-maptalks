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
  ref
} from "vue";
import { VectorTileLayer } from "@maptalks/gl-layers";
import { buildUUID } from "@pureadmin/utils";
export default defineComponent({
  // 初始化矢量瓦片图层
  name: "mt-vector-tile-layer",

  props: {
    // 矢量瓦片图层id
    id: {
      type: String,
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
    });

    // 页面元素销毁之前执行
    onBeforeUnmount(() => {
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

    // 移除并销毁图层对象
    const removeAll = () => {
      if (vectorTileLayer) {
        vectorTileLayer.reomve();
        vectorTileLayer = undefined;
      }
    };

    return {
      vectorTileLayer
    };
  }
});
</script>
