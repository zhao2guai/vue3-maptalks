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
  onBeforeMount
} from "vue";
export default defineComponent({
  // 初始化地图底图专用图层
  name: "mt-base-layer",

  setup(props, context) {
    // 获取上级组件中的地图对象
    let maptalks = inject("maptalks", null);
    // 获取地图对象
    let map = maptalks.value;
    // 接收图层配置信息并初始化图层对象
    let baseLayer = map && map.isLoaded() ? map.getBaseLayer() : null;
    // 图层对象创建完毕后的回调
    context.emit("layerCreated", baseLayer);
    // 使用provide注入图层对象，这样父组件就可以访问到图层对象了。
    provide("baseLayer", baseLayer);

    // 页面加载后执行
    onBeforeMount(() => {});

    // 页面元素销毁之前执行
    onUnmounted(() => {
      removeAll();
    });

    // 移除并销毁图层对象
    const removeAll = () => {
      if (map && map.isLoaded()) {
        map.removeBaseLayer();
        baseLayer = undefined;
      }
    };

    return {
      baseLayer
    };
  }
});
</script>
