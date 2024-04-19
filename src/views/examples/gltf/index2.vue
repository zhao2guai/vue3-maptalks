<template>
  <div id="gltf2" v-loading="loading" class="map-content">
    <mt-init-map @getMap="getMap" :options="options">
      <mt-group-gl-layer :sceneConfig="defaultSceneConfig">
        <mt-gltf-layer>
          <mt-gltf-maker
            ref="camera1"
            :point="[81.863822, 44.940405]"
            :symbol="symbol1"
            :infoWindowOptions="infoWindowOptions"
          />
          <mt-gltf-maker
            ref="camera2"
            :point="[81.873822, 44.940405]"
            :symbol="symbol2"
            :infoWindowOptions="infoWindowOptions"
          />
          <mt-gltf-maker
            ref="camera3"
            :point="[81.868822, 44.945405]"
            :symbol="symbol3"
            :infoWindowOptions="cfOptions"
          />
        </mt-gltf-layer>
      </mt-group-gl-layer>
    </mt-init-map>
  </div>
</template>
<script setup>
import { title } from "process";
import { ref, onMounted, onBeforeUnmount, reactive } from "vue";

const loading = ref(true);

let map = null;

// 设置默认地图配置
let options = {
  center: [81.868822, 44.940405], // 博乐市小营盘镇
  zoom: 16,
  spatialReference: {
    projection: "EPSG:4326"
  },
  minZoom: 10,
  maxZoom: 20,
  bearing: -20,
  pitch: 75
};
// 设置默认场景配置信息
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
    opacity: 0.11,
    color: [0, 0, 0],
    blurOffset: 1
  },
  ground: {
    enable: true,
    renderPlugin: {
      type: "fill"
    },
    symbol: {
      polygonFill: [0.517647, 0.517647, 0.517647, 1]
    }
  },
  postProcess: {
    enable: false,
    antialias: {
      enable: true,
      taa: true,
      jitterRatio: 0.25
    },
    ssr: {
      enable: true
    },
    bloom: {
      enable: true,
      threshold: 0,
      factor: 0.2,
      radius: 0.105
    },
    ssao: {
      enable: true,
      bias: 0.08,
      radius: 0.08,
      intensity: 1.5
    },
    sharpen: {
      enable: false,
      factor: 0.2
    }
  }
};
// 摄像头杆子35
let symbol1 = {
  url: new URL("@/maptalks/assets/gltf/camera/pole35.gltf", import.meta.url), //模型的url
  visible: true, //模型是否可见
  translationL: [0, 0, 0], //模型在本地坐标系xyz轴上的偏移量
  rotation: [0, 0, 0], //模型在本地坐标系xyz轴上的旋转角度，单位角度
  scale: [1, 1, 1], //模型在本地坐标系xyz轴上的缩放倍数
  animation: true, //是否开启动画
  loop: true, //是否开启动画循环
  speed: 1, //动画速度倍数
  fixSizeOnZoom: -1, //在给定级别上固定模型大小，不再随地图缩放而改变，设置为-1时取消
  anchorZ: "bottom", //模型在z轴上的锚点或对齐点，可选的值： top， bottom
  shadow: true, //是否开启阴影
  bloom: true, //是否开启泛光
  shader: "pbr", //模型绘制的shader，可选值：pbr, phong, wireframe
  modelHeight: 240,
  translationZ: -120
};
// 摄像头杆子37
let symbol2 = {
  url: new URL("@/maptalks/assets/gltf/camera/pole37.gltf", import.meta.url), //模型的url
  visible: true, //模型是否可见
  translationL: [0, 0, 0], //模型在本地坐标系xyz轴上的偏移量
  rotation: [0, 0, 0], //模型在本地坐标系xyz轴上的旋转角度，单位角度
  scale: [1, 1, 1], //模型在本地坐标系xyz轴上的缩放倍数
  animation: true, //是否开启动画
  loop: true, //是否开启动画循环
  speed: 1, //动画速度倍数
  fixSizeOnZoom: -1, //在给定级别上固定模型大小，不再随地图缩放而改变，设置为-1时取消
  anchorZ: "bottom", //模型在z轴上的锚点或对齐点，可选的值： top， bottom
  shadow: true, //是否开启阴影
  bloom: true, //是否开启泛光
  shader: "pbr", //模型绘制的shader，可选值：pbr, phong, wireframe
  modelHeight: 240,
  translationZ: -120
};
// 厂房
let symbol3 = {
  url: new URL(
    "@/maptalks/assets/gltf/factory/changfang.gltf",
    import.meta.url
  ), //模型的url
  visible: true, //模型是否可见
  translationL: [0, 0, 0], //模型在本地坐标系xyz轴上的偏移量
  rotation: [0, 0, 0], //模型在本地坐标系xyz轴上的旋转角度，单位角度
  scale: [1, 1, 1], //模型在本地坐标系xyz轴上的缩放倍数
  animation: true, //是否开启动画
  loop: true, //是否开启动画循环
  speed: 1, //动画速度倍数
  fixSizeOnZoom: -1, //在给定级别上固定模型大小，不再随地图缩放而改变，设置为-1时取消
  anchorZ: "bottom", //模型在z轴上的锚点或对齐点，可选的值： top， bottom
  shadow: true, //是否开启阴影
  bloom: true, //是否开启泛光
  shader: "pbr", //模型绘制的shader，可选值：pbr, phong, wireframe
  modelHeight: 240,
  translationZ: -120
};
// 自定义弹窗内容
let infoWindowOptions = {
  custom: true,
  content:
    '<div class="infocontent" ref="infoWindowRef">' +
    '<i class="info-close"/>' +
    '<div class="infopop_title">这是一个摄像头</div>' +
    '<div class="infopop_time">当前时间: ' +
    new Date().toLocaleTimeString() +
    "</div><br>" +
    "</div>"
};

// 自定义弹窗内容
let cfOptions = {
  custom: true,
  content:
    '<div class="infocontent" ref="infoWindowRef">' +
    '<div class="infopop_title">青年牛2号圈舍</div>' +
    '<div class="infopop_title">圈舍编号: A103JHR89Y20</div>' +
    '<div class="infopop_title">圈舍容量: 30 (头)</div>' +
    '<div class="infopop_title">圈舍负责任: 林星宇</div>' +
    '<div class="infopop_dept">=> 点击进入 <=' +
    "</div>"
};

function getMap(e) {
  map = e;
  loading.value = false;
}

onMounted(() => {});

onBeforeUnmount(() => {
  map = undefined;
});
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
}
</style>

<style lang="scss">
#gltf2 {
  .infocontent {
    color: #fff;
    width: 20vw;
    height: 20vh;
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
    border: 1px solid #192b41;
    position: absolute;
    bottom: 1vh;
    width: 100%;
    text-align: center;
  }
  .infopop_arrow {
    float: left;
    width: 15px;
    height: 24px;
    line-height: 24px;
  }
  .icon-close {
    position: absolute;
    top: 0.2vh;
    right: 0.5vh;
    display: inline-block;
    width: 1.8519vh;
    height: 1.8519vh;
    background: url("../maptalksclone/assets/images/close-icon.png") no-repeat
      center/100% 100%;
    cursor: pointer;
  }
}
</style>
