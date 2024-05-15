<template>
  <div>
    <slot />
  </div>
</template>

<script>
import { onMounted, defineComponent, watch, onBeforeUnmount } from "vue";
import { RoutePlayer, formatRouteData } from "maptalks.routeplayer";

export default defineComponent({
  /** 轨迹播放组件 */
  name: "mt-route-player",

  props: {
    // 轨迹数据
    routeData: {
      type: Array,
      default: () => []
    },

    // 轨迹播放配置
    options: {
      type: Object,
      default: () => ({
        speed: 1, // 播放速度
        unitTime: 1, // 单位时间
        debug: false, // 调试
        autoPlay: false, // 自动播放
        repeat: false // 循环播放
      })
    }
  },

  setup(props, context) {
    let routeData = props.routeData ? props.routeData : [];
    let options = props.options ? props.options : {};
    let data = getFormatRouteData(routeData);

    // 创建轨迹播放器
    const routePlayer = new RoutePlayer(data, options);
    // 轨迹播放器创建后的回调
    context.emit("routePlayerCreated", routePlayer);

    // 监听轨迹数据
    watch(
      () => props.routeData,
      newRouteData => {
        if (routePlayer && newRouteData) {
          data = getFormatRouteData(newRouteData);
          routePlayer.setData(data);
        }
      },
      { deep: true, immediate: true }
    );

    // 监听轨迹播放配置
    watch(
      () => props.options,
      newOptions => {
        if (routePlayer && newOptions) {
          if (routePlayer.getSpeed() != newOptions.speed) {
            routePlayer.setSpeed(newOptions.speed);
          }
          if (routePlayer.getUnitTime() != newOptions.unitTime) {
            routePlayer.setUnitTime(newOptions.unitTime);
          }
        }
      },
      { deep: true, immediate: true }
    );

    onMounted(() => {
      initEvents();
    });

    // 轨迹播放器销毁
    onBeforeUnmount(() => {
      removeAll();
    });

    // 轨迹播放器销毁
    const removeAll = () => {
      routePlayer.remove();
    };

    // 初始化图层事件
    const initEvents = () => {
      if (routePlayer) {
        routePlayer.on("playstart playing playend vertex pause", event => {
          context.emit("playstart playing playend vertex pause", event);
        });
        routePlayer.on("playing", event => {
          context.emit("playing", event);
        });
        routePlayer.on("vertex", event => {
          context.emit("vertex", event);
        });
      }
    };

    // 格式化轨迹数据(为数据添加时间戳、当前节点相对于开始点的距离、当前节点是否被播放过方便播放时触发顶点时间)
    function getFormatRouteData(routeData) {
      return formatRouteData(routeData, { duration: 1000 * 60 * 10 });
    }

    // 开始播放
    const startPlay = () => {
      routePlayer.play();
    };
    // 暂停播放
    const pausePlay = () => {
      routePlayer.pause();
    };
    // 完成播放
    const finishPlay = () => {
      routePlayer.finish();
    };
    // 重置播放
    const resetPlay = () => {
      routePlayer.reset();
    };
    // 重播
    const replayRoutePlay = () => {
      routePlayer.replay();
    };
    // 定位到指定顶点
    const setIndex = (index) => {
      routePlayer.setIndex(index);
    };
    // 定位到指定时间
    const setTime = (time) => {
      routePlayer.setTime(time);
    };
    // 定位到指定距离
    const setPercent = (percent) => {
      routePlayer.setPercent(percent);
    };
    // 设置播放速度
    const setSpeed = speed => {
      routePlayer.setSpeed(speed);
    };

    return {
      routePlayer,
      startPlay,
      pausePlay,
      finishPlay,
      resetPlay,
      replayRoutePlay,
      setIndex,
      setTime,
      setPercent,
      setSpeed
    };
  }
});
</script>

<style lang="scss" scoped></style>
