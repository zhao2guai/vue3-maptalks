<template>
  <div v-loading="loading" class="map-content">
    <!-- 地图部分 -->
    <div class="map-div" :style="{ width: mapDivWidth + '%' }">
      <mt-init-map ref="mapRef" @getMap="getMap">
        <mt-group-gl-layer
          :terrainSwitch="terrainSwitch"
          :tk="tk"
          :sceneConfig="sceneConfig"
        >
          <mt-tianditu-layer
            tk="695a9bebe4c75d64d9cada2be2789425"
            layerType="img"
          />
        </mt-group-gl-layer>
      </mt-init-map>
    </div>

    <!-- 操作部分 -->
    <div
      class="operation-div"
      :style="{ width: operationWidth + '%' }"
      :class="[showOperation ? '' : 'hide-operation-div']"
    >
      <p class="title-style" v-if="showOperation">地图中的操作</p>
      <el-row style="margin-top: 2vh" v-if="showOperation">
        <el-col :span="24" style="margin-top: 2.5vh">
          <span class="label-style">地形：</span
          ><el-switch
            v-model="terrainSwitch"
            active-text="打开"
            inactive-text="关闭"
          />
        </el-col>
        <el-col :span="24" style="margin-top: 2.5vh">
          <span class="label-style">雨：</span
          ><el-switch
            v-model="isAutoCenter"
            active-text="打开"
            inactive-text="关闭"
            @change="autoCenterChange"
          />
        </el-col>
        <el-col
          :span="24"
          style="margin-top: 2.5vh; display: flex; justify-content: flex-start"
        >
          <span class="label-style" style="width: 5.5vw">涟漪半径：</span>
          <el-slider
            v-model="rippleRadius"
            style="position: relative; top: -0.5vh"
            @input="rippleRadiusChange"
            :min="1"
            :max="50"
            :step="1"
          ></el-slider>
        </el-col>
        <el-col
          :span="24"
          style="margin-top: 2.5vh; display: flex; justify-content: flex-start"
        >
          <span class="label-style" style="width: 5.5vw">雨滴宽度：</span>
          <el-slider
            v-model="rainWidth"
            style="position: relative; top: -0.5vh"
            @input="rainWidthChange"
            :min="0.1"
            :max="5"
            :step="0.11"
          ></el-slider>
        </el-col>
        <el-col
          :span="24"
          style="margin-top: 2.5vh; display: flex; justify-content: flex-start"
        >
          <span class="label-style" style="width: 5.5vw">雨滴高度：</span>
          <el-slider
            v-model="rainHeight"
            style="position: relative; top: -0.5vh"
            @input="rainHeightChange"
            :min="0.1"
            :max="5"
            :step="0.1"
          ></el-slider>
        </el-col>
        <el-col
          :span="24"
          style="margin-top: 2.5vh; display: flex; justify-content: flex-start"
        >
          <span class="label-style" style="width: 5.5vw">雨滴速度：</span>
          <el-slider
            v-model="speed"
            style="position: relative; top: -0.5vh"
            @input="speedChange"
            :min="1"
            :max="10"
            :step="1"
          ></el-slider>
        </el-col>
        <el-col
          :span="24"
          style="margin-top: 2.5vh; display: flex; justify-content: flex-start"
        >
          <span class="label-style" style="width: 5.5vw">雨量：</span>
          <el-slider
            v-model="density"
            style="position: relative; top: -0.5vh"
            @input="densityChange"
            :min="1000"
            :max="5000"
            :step="1"
          ></el-slider>
        </el-col>
        <el-col
          :span="24"
          style="margin-top: 2.5vh; display: flex; justify-content: flex-start"
        >
          <span class="label-style" style="width: 5.5vw">风向X：</span>
          <el-slider
            v-model="windDirectionX"
            style="position: relative; top: -0.5vh"
            @input="windDirectionXChange"
            :min="-30"
            :max="30"
            :step="1"
          ></el-slider>
        </el-col>
        <el-col
          :span="24"
          style="margin-top: 2.5vh; display: flex; justify-content: flex-start"
        >
          <span class="label-style" style="width: 5.5vw">风向Y：</span>
          <el-slider
            v-model="windDirectionY"
            style="position: relative; top: -0.5vh"
            @input="windDirectionYChange"
            :min="-30"
            :max="30"
            :step="1"
          ></el-slider>
        </el-col>
      </el-row>
      <div class="show-operation-div" @click="isShowOperation">
        <i class="right-icon" v-if="showOperation"></i>
        <i class="left-icon" v-else></i>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const loading = ref(true);
const mapRef = ref(null);
let map = null;

let mapDivWidth = ref(80);
let operationWidth = ref(20);

let showOperation = ref(true);

let terrainSwitch = ref(false);
let tk = ref("695a9bebe4c75d64d9cada2be2789425");
let isAutoCenter = ref(true);
let rippleRadius = ref(11);
let rainWidth = ref(1);
let rainHeight = ref(1);
let speed = ref(1);
let density = ref(2000);
let windDirectionX = ref(0);
let windDirectionY = ref(0);
const rainTexture = new URL(
  "../../../../public/marker/rain1.png",
  import.meta.url
);
let sceneConfig = ref({
  environment: {
    enable: true,
    mode: 1,
    level: 3,
    brightness: 0.489
  },
  shadow: {
    type: "esm",
    enable: true,
    quality: "high",
    opacity: 0.5,
    color: [0, 0, 0],
    blurOffset: 1
  },
  postProcess: {
    enable: true,
    antialias: {
      enable: true,
      taa: true,
      jitterRatio: 0.25
    },
    ssr: {
      enable: true
    }
  },
  weather: {
    enable: true,
    fog: {
      enable: true,
      start: 3,
      end: 70,
      color: [0.9, 0.9, 0.9]
    },
    rain: {
      enable: true,
      windDirectionX: 0,
      windDirectionY: 0,
      rippleRadius: 11,
      rainWidth: 1,
      rainHeight: 1,
      speed: 1,
      density: 2000,
      rainTexture: rainTexture
    }
  },
  ground: {
    enable: true,
    renderPlugin: {
      type: "fill"
    },
    symbol: {
      polygonFill: [0.803921568627451, 0.803921568627451, 0.803921568627451, 1],
      polygonOpacity: 1
    }
  }
});

function getMap(e) {
  map = e;
  map.setPitch(90);
  if (map.isLoaded()) {
    loading.value = false;
  }
}

onMounted(() => {});

onBeforeUnmount(() => {
  map = undefined;
});

function rippleRadiusChange(val) {
  if (sceneConfig.value.weather.rain)
    sceneConfig.value.weather.rain.rippleRadius = val;
}

function rainWidthChange(val) {
  if (sceneConfig.value.weather.rain)
    sceneConfig.value.weather.rain.rainWidth = val;
}

function rainHeightChange(val) {
  if (sceneConfig.value.weather.rain)
    sceneConfig.value.weather.rain.rainHeight = val;
}

function autoCenterChange(val) {
  if (sceneConfig.value.weather.rain)
    sceneConfig.value.weather.rain.enable = val;
}

function speedChange(val) {
  if (sceneConfig.value.weather.rain)
    sceneConfig.value.weather.rain.speed = val;
}

function densityChange(val) {
  if (sceneConfig.value.weather.rain)
    sceneConfig.value.weather.rain.density = val;
}

function windDirectionXChange(val) {
  if (sceneConfig.value.weather.rain)
    sceneConfig.value.weather.rain.windDirectionX = val;
}

function windDirectionYChange(val) {
  if (sceneConfig.value.weather.rain)
    sceneConfig.value.weather.rain.windDirectionY = val;
}

// 改变大雾颜色
function changeColor(e) {
  let colorArray = e
    .replace("rgba(", "")
    .replace(")", "")
    .split(", ")
    .map(parseFloat);
  let rgbValues = e.match(/\d+/g); // 使用正则表达式匹配数字
  let r = parseInt("0x" + rgbValues[0]);
  let g = parseInt("0x" + rgbValues[1]);
  let b = parseInt("0x" + rgbValues[2]);
  if (sceneConfig.value.weather.fog)
    sceneConfig.value.weather.fog.color = [
      r / 255,
      g / 255,
      b / 255,
      colorArray[3]
    ];
}
</script>

<style lang="scss" scoped>
.main-content {
  margin: 2px 0 0 !important;
}

.map-content {
  width: 100%;
  height: calc(100vh - 0px);
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: flex-start;

  .map-div {
    height: 100%;
  }

  .operation-div {
    height: 100%;
    background: #fff;
    padding: 1vh 1vw;
    box-sizing: border-box;
    position: relative;

    .title-style {
      width: 100%;
      text-align: center;
      font-size: 2.5vh;
      font-weight: 700;
    }

    .label-style {
      font-size: 1.6vh;
      font-weight: 700;
    }

    .show-operation-div {
      width: 5vh;
      height: 5vh;
      background: rgb(64, 158, 255);
      position: absolute;
      top: 50%;
      left: -5vh;
      transform: translateY(-50%);
      cursor: pointer;
      border-top-left-radius: 0.5vw;
      border-bottom-left-radius: 0.5vw;

      .right-icon {
        width: 3vh;
        height: 3vh;
        background: url(../../../assets/imgs/right-icon.png) no-repeat center
          center;
        background-size: 100% 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      .left-icon {
        width: 3vh;
        height: 3vh;
        background: url(../../../assets/imgs/left-icon.png) no-repeat center
          center;
        background-size: 100% 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }

  .hide-operation-div {
    padding: 0;
    box-sizing: border-box;
  }
}
</style>
