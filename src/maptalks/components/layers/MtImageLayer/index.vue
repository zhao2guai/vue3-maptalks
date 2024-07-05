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
import { ImageLayer } from "maptalks";
import { buildUUID } from "@pureadmin/utils";
export default defineComponent({
  // 加载图片的图层
  name: "mt-image-layer",

  props: {
    // 图片图层id
    id: {
      type: [String, Number],
      default: ""
    },
    // 图片数组
    images: {
      type: Array,
      default: null
    },
    // 图片图层配置信息
    options: {
      type: Object,
      default: null
    }
  },

  setup(props, context) {
    // 获取图层ID和配置
    let id = props.id ? props.id : buildUUID();
    let images = props.images ? props.images : null;
    let options = props.options ? props.options : null;
    // 接收图层配置信息并初始化图层对象
    let imageLayer = new ImageLayer(id, images, options);
    // 图层对象创建完毕后的回调
    context.emit("layerCreated", imageLayer);
    // 使用provide注入图层对象，这样父组件就可以访问到图层对象了。
    provide("imageLayer", imageLayer);

    // 监听图片图层ID
    watch(
      () => props.id,
      newId => {
        if (imageLayer && newId) {
          imageLayer.setId(newId);
        }
      },
      { immediate: true }
    );
    // 监听图片数组
    watch(
      () => props.images,
      newImg => {
        if (imageLayer && newImg) {
          imageLayer.setImages(newImg);
        }
      },
      { immediate: true, deep: true }
    );
    // 监听图片图层配置信息
    watch(
      () => props.options,
      newOptions => {
        if (imageLayer && newOptions) {
          imageLayer.setOptions(newOptions);
        }
      },
      { immediate: true, deep: true }
    );

    // 页面加载后执行
    onBeforeMount(() => {
      addImageLayer();
      initEvents();
    });

    // 页面元素销毁之前执行
    onUnmounted(() => {
      removeAll();
    });

    // 添加图片图层
    const addImageLayer = () => {
      // 获取上级组件中的地图对象
      let maptalks = inject("maptalks", null);
      // 获取地图对象
      let map = maptalks.value;
      // 若不存在任何图层组则判断地图对象是否加载并添加至map的layers数组中
      if (map) {
        imageLayer.addTo(map);
        return;
      }
    };

    // 初始化图层事件
    const initEvents = () => {
      if (!imageLayer) return;
      // 监听id改变事件
      imageLayer.on("idchange", event => {
        context.emit("idchange", event);
      });
      // 图层高度改变事件
      imageLayer.on("setzindex", event => {
        context.emit("setzindex", event);
      });
      // 图层透明度改变事件
      imageLayer.on("setopacity", event => {
        context.emit("setopacity", event);
      });
      // 图层显示时候触发事件
      imageLayer.on("show", event => {
        context.emit("show", event);
      });
      // 图层显示时候触发事件
      imageLayer.on("hide", event => {
        context.emit("hide", event);
      });
      // renderer创建事件
      imageLayer.on("renderercreate", event => {
        context.emit("renderercreate", event);
      });
      // 关闭图层触发事件
      imageLayer.on("visiblechange", event => {
        context.emit("visiblechange", event);
      });
      // 数据源加载时候触发事件。
      imageLayer.on("resourceload", event => {
        context.emit("resourceload", event);
      });
      // canvas创建时候触发事件。
      imageLayer.on("canvascreate", event => {
        context.emit("canvascreate", event);
      });
      // 开始渲染事件
      imageLayer.on("renderstart", event => {
        context.emit("renderstart", event);
      });
      // 结束渲染事件
      imageLayer.on("renderend", event => {
        context.emit("renderend", event);
      });
    };

    // 移除并销毁图层对象
    const removeAll = () => {
      if (imageLayer) {
        imageLayer.remove();
        imageLayer = undefined;
      }
    };

    return {
      imageLayer
    };
  }
});
</script>
