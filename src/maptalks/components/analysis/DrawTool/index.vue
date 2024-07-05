<template>
  <div>
    <slot />
  </div>
</template>

<script>
import { DrawTool } from "maptalks";
import { onMounted, defineComponent, onUnmounted, provide, inject } from "vue";

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
    // 创建一个新的绘制工具对象
    let drawTool = new DrawTool({
      mode: props.mode,
      symbol: props.symbol
    });
    // 提供drawTool,让父级可以访问到
    provide("drawTool", drawTool);

    // 页面加载后执行
    onMounted(() => {
      addDrawTool();
      initEvents();
    });

    // 页面元素销毁之前执行
    onUnmounted(() => {
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
