<template>
  <div>
    <slot />
  </div>
</template>

<script>
import {
  defineComponent,
  inject,
  onUnmounted,
  onBeforeMount,
  watch
} from "vue";
import { VideoLayer, VideoSurface } from "@maptalks/gl-layers";
import { buildUUID } from "@pureadmin/utils";
export default defineComponent({
  // 视频图层
  name: "mt-video-layer",

  props: {
    // 视频图层id
    id: {
      type: [String, Number],
      default: ""
    },
    // 视频图层配置信息
    options: {
      type: Object,
      default: () => ({})
    },
    // videoSuface的四个角的坐标
    pointList: {
      type: Array,
      default: () => []
    },

    // videoSurface的配置信息
    videoSufaceConfig: {
      type: Object,
      default: () => {}
    },

    // 视频声音是否打开
    audioFlag: {
      type: Boolean,
      default: false
    }
  },

  setup(props, context) {
    // 获取图层ID
    let id = props.id ? props.id : buildUUID();

    let videoSurface = null;

    if (props.pointList && props.videoSufaceConfig) {
      videoSurface = new VideoSurface(props.pointList, props.videoSufaceConfig);
    }

    // 接收图层配置信息并初始化图层对象
    let videoLayer = new VideoLayer(id, props.options);
    // 向组件传送初始化完毕的layer
    context.emit("layerCreated", videoLayer);

    // 页面加载后执行
    onBeforeMount(() => {
      addVideoLayer();
      initEvents();
    });

    // 页面元素销毁之前执行
    onUnmounted(() => {
      removeAll();
    });

    // 添加矢量瓦片图层
    const addVideoLayer = () => {
      if (videoSurface) videoSurface.addTo(videoLayer);
      // 判断更多图层...
      const groupGLLayer = inject("groupGLLayer", null);
      // 若是GL图层存在则优先添加到它里面
      if (groupGLLayer) {
        groupGLLayer.addLayer(videoLayer);
        return;
      }
    };

    // 初始化图层事件
    const initEvents = () => {
      if (!videoLayer) return;
    };

    // 移除并销毁图层对象
    const removeAll = () => {
      if (videoLayer) {
        videoLayer.remove();
      }
    };

    const startPlay = () => {
      if (videoSurface) {
        videoSurface.play();
      }
    };

    const videoPause = () => {
      if (videoSurface) {
        videoSurface.pause();
      }
    };

    const videoAudio = flag => {
      if (videoSurface && flag) {
        videoSurface.setAudio(true);
      } else if (videoSurface && !flag) {
        videoSurface.setAudio(false);
      }
    };

    return {
      videoLayer,
      videoSurface,
      startPlay,
      videoPause,
      videoAudio
    };
  }
});
</script>
