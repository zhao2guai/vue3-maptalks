<template>
  <div>
    <slot />
  </div>
</template>

<script>
import { ViewshedAnalysis } from "@maptalks/gl-layers";
import {
  watch,
  inject,
  provide,
  onBeforeMount,
  onUnmounted,
  defineComponent
} from "vue";

export default defineComponent({
  /** 轨迹播放组件 */
  name: "mt-viewshed-analysis",

  props: {
    // 视点处坐标位置
    eyePos: {
      type: Array,
      default: () => []
    },

    // 目标点位置坐标
    lookPoint: {
      type: Array,
      default: () => []
    },

    // 水平张角
    horizontalAngle: {
      type: Number,
      default: 45
    },

    // 垂直张角
    verticalAngle: {
      type: Number,
      default: 45
    }
  },

  setup(props, context) {
    let point1 = props.eyePos ? props.eyePos : [0, 0, 0];

    let point2 = props.lookPoint ? props.lookPoint : [0, 0, 0];
    // 设置视线分析的属性
    let viewshedAnalysis = new ViewshedAnalysis({
      eyePos: point1,
      lookPoint: point2,
      horizontalAngle: props.horizontalAngle,
      verticalAngle: props.verticalAngle
    });
    // 向外提供viewshedAnalysis工具
    provide("viewshedAnalysis", viewshedAnalysis);

    // // 监听视点处坐标位置
    // watch(
    //   () => props.eyePos,
    //   newEyePos => {
    //     if (viewshedAnalysis && newEyePos) {
    //       viewshedAnalysis.update("eyePos", newEyePos);
    //     }
    //   },
    //   { deep: true }
    // );

    // // 监听目标点位置坐标
    // watch(
    //   () => props.lookPoint,
    //   newLookPoint => {
    //     if (viewshedAnalysis && newLookPoint) {
    //       viewshedAnalysis.update("lookPoint", newLookPoint);
    //     }
    //   },
    //   { deep: true }
    // );

    // 监听水平张角
    watch(
      () => props.horizontalAngle,
      newHorizontalAngle => {
        if (viewshedAnalysis && newHorizontalAngle) {
          viewshedAnalysis.update("horizontalAngle", newHorizontalAngle);
        }
      },
      { deep: true }
    );

    // 监听垂直张角
    watch(
      () => props.verticalAngle,
      newVerticalAngle => {
        if (viewshedAnalysis && newVerticalAngle) {
          viewshedAnalysis.update("verticalAngle", newVerticalAngle);
        }
      },
      { deep: true }
    );

    // 页面加载后执行
    onBeforeMount(() => {
      addViewshedAnalysis();
    });

    // 页面元素销毁之前执行
    onUnmounted(() => {
      removeAll();
    });

    const removeAll = () => {
      if (viewshedAnalysis) {
        viewshedAnalysis.remove();
      }
    };

    const addViewshedAnalysis = () => {
      const groupGLLayer = inject("groupGLLayer", null);
      if (groupGLLayer) {
        viewshedAnalysis.addTo(groupGLLayer);
        return;
      }
    };

    return {
      viewshedAnalysis
    };
  }
});
</script>

<style lang="scss" scoped></style>
