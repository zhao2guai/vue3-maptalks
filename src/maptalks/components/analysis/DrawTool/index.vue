<template>
  <div>
    <slot />
  </div>
</template>

<script>
import { DrawTool } from "maptalks";
import {
  onBeforeMount,
  defineComponent,
  watch,
  onBeforeUnmount,
  inject
} from "vue";

export default defineComponent({
  /** 轨迹播放组件 */
  name: "mt-draw-tool",

  props: {
    mode: {
      type: String,
      default: "LineString"
    },

    symbol: {
      type: Object,
      default: () => {
        lineOpacity: 0;
      }
    }
  },

  setup(props, context) {
    let drawTool = new DrawTool({
      mode: props.mode,
      symbol: props.symbol
    });

    // 页面加载后执行
    onBeforeMount(() => {
      addDrawTool();
      initEvents();
    });

    // 页面元素销毁之前执行
    onBeforeUnmount(() => {
      removeAll();
    });

    const addDrawTool = () => {
      // 获取上级组件中的地图对象
      let maptalks = inject("maptalks", null);
      let map = maptalks.value;
      if (map && map.isLoaded()) {
        drawTool.addTo(map).disable();
      }
    };

    // 初始化图层事件
    const initEvents = () => {
      if (!drawTool) return;
      // 鼠标移动事件
      drawTool.on("mousemove", event => {
        context.emit("mousemove", event);
      });
      // 绘制顶点事件
      drawTool.on("drawvertex", event => {
        context.emit("drawvertex", event);
      });
      // 绘制开始事件
      drawTool.on("drawstart", event => {
        context.emit("drawstart", event);
      });
      // 绘制结束事件
      drawTool.on("drawend", event => {
        context.emit("drawend", event);
      });
    };

    // 移除地图所有图层销毁地图组件
    const removeAll = () => {
      if (drawTool) {
        drawTool.remove();
      }
    };

    return {
      drawTool
    };
  }
});
</script>

<style lang="scss" scoped></style>
