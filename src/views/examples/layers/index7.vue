<template>
  <div id="gltf3" v-loading="loading" class="map-content">
    <mt-init-map @getMap="getMap" :options="options">
      <mt-group-gl-layer :sceneConfig="defaultSceneConfig">
        <mt-gltf-layer>
          <mt-gltf-maker
            :point="[-74.01026733935669, 40.710726717547544]"
            :symbol="symbol"
          />
        </mt-gltf-layer>
        <mt-video-layer
          ref="videoLayerRef"
          :options="videoOptions"
          :pointList="pointList"
          :videoSufaceConfig="videoSufaceConfig"
          :audioFlag="audioFlag"
        ></mt-video-layer>
      </mt-group-gl-layer>
    </mt-init-map>

    <!-- 右上角开关 -->
    <el-card class="map-operation-area">
      <el-switch
        v-model="playVideo"
        class="mb-2"
        active-text="暂停播放"
        inactive-text="播放视频"
        @change="playVideoChange"
      />
      <br />
      <el-switch
        v-model="audioFlag"
        class="mb-2"
        active-text="开启声音"
        inactive-text="关闭声音"
      />
    </el-card>
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
// 加载遮罩
const loading = ref(true);
// 地图对象
let map = null;

let videoLayerRef = ref(null);

let options = {
  center: [-74.01026733935669, 40.710726717547544], // 甘肃省兰州市
  zoom: 17.66,
  spatialReference: {
    projection: "EPSG:4326"
  },
  minZoom: 1,
  maxZoom: 18,
  bearing: 89.4,
  pitch: 80
};

let defaultSceneConfig = {
  environment: {
    enable: true,
    mode: 1,
    level: 0,
    brightness: 0
  },
  shadow: {
    type: "esm",
    enable: true,
    quality: "high",
    opacity: 0.5,
    color: [0, 0, 0],
    blurOffset: 1
  },
  ground: {
    enable: true,
    renderPlugin: { type: "fill" },
    symbol: {
      polygonFill: [
        0.5215686274509804, 0.5450980392156862, 0.5725490196078431, 1
      ],
      polygonOpacity: 1
    }
  }
};

let symbol = {
  shadow: true,
  url: new URL("../../../../public/gltf/ebc/scene.gltf", import.meta.url),
  scaleX: 24.7345,
  scaleY: 24.7345,
  scaleZ: 10.7345,
  shader: "pbr",
  uniforms: {
    polygonFill: [1, 1, 1, 1],
    polygonOpacity: 1,
    baseColorIntensity: 1.69,
    outputSRGB: 1
  }
};

let videoOptions = {
  doubleSide: false
};

let audioFlag = ref(false);
let playVideo = ref(false);

let pointList = [
  [-74.01162476336549, 40.712214182492374, 85],
  [-74.01162476336549, 40.712214182492374, 36],
  [-74.0116320237475, 40.7111789805343, 36],
  [-74.0116320237475, 40.7111789905343, 85]
];

let videoSufaceConfig = {
  url: "../../../../public/videos/test1.mp4",
  opacity: 1
};

// 获取地图对象
function getMap(e) {
  map = e;
  loading.value = false;
}
onMounted(() => {});

onBeforeUnmount(() => {
  map = undefined;
});

function playVideoChange(val) {
  if (val) {
    videoLayerRef.value.videoPause();
  } else {
    videoLayerRef.value.startPlay();
  }
}
</script>

<style lang="scss" scoped>
.main-content {
  margin: 2px 0 0 !important;
}
.map-content {
  position: relative;
  width: 100%;
  height: calc(100vh - 86px);
  overflow: hidden;

  .map-operation-area {
    position: absolute;
    top: 2%;
    right: 2%;
    max-width: 480px;
    z-index: 999;
  }
}
</style>

<style lang="scss">
#gltf3 {
  .infocontent {
    color: #fff;
    width: 20vw;
    height: 28vh;
    background-color: #051127;
    border: 1px solid #0c2c45;
  }
  .infopop_title {
    float: left;
    padding-left: 10px;
    width: 100%;
    height: 36px;
    line-height: 36px;
    background: url(title.png);
    font-weight: bold;
    font-size: 16px;
  }
  .infopop_time {
    width: 100%;
    height: 30px;
    margin: 0 10px;
    line-height: 36px;
  }
  .infopop_dept {
    padding: 5px;
    line-height: 15px;
    text-align: center;
    border: 1px solid #192b41;
    margin: 0 10px;
    position: absolute;
    bottom: 2vh;
    text-align: center;
  }
  .infopop_arrow {
    float: left;
    width: 15px;
    height: 24px;
    line-height: 24px;
  }
}
</style>
