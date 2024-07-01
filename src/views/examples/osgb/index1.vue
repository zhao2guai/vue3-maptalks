<template>
  <div v-loading="loading" class="map-content">
    <mt-init-map ref="mapRef" :options="options" @getMap="getMap">
      <mt-group-gl-layer :sceneConfig="sceneConfig">
        <mt-tianditu-layer
          tk="ec89e7ba91633b147f76d47e08f9f1a1"
          layerType="img"
        />
        <mt-geo3d-tile-layer
          id="3dtiles"
          ref="geo3dRef"
          :options="layerOptions"
          @loadtileset="loadtileset"
          @renderstart="renderstart"
          @renderend="renderend"
        />
      </mt-group-gl-layer>
    </mt-init-map>
  </div>
</template>
<script setup>
import { Circle } from "maptalks";
import { ClipOutsideMask } from "@maptalks/gl-layers";
import { ref, onMounted, onBeforeUnmount } from "vue";
// 地图加载状态
let loading = ref(true);
// 地图组件名称
const mapRef = ref(null);
const geo3dRef = ref(null);
// 地图对象
let map = null;
// 初始化地图参数
let options = {
  center: [108.959296, 34.224304], // 西安市大雁塔
  zoom: 20,
  spatialReference: {
    projection: "EPSG:4326"
  },
  minZoom: 1,
  maxZoom: 20,
  bearing: -15,
  pitch: 45
};
// 场景配置
let sceneConfig = {
  environment: {
    enable: true,
    mode: 1,
    level: 0,
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
    enable: true
  },
  ground: {
    enable: true, // 开启地面配置
    renderPlugin: {
      type: "fill"
    },
    symbol: {
      polygonFill: [0.803921568627451, 0.803921568627451, 0.803921568627451, 1],
      polygonOpacity: 1
    }
  }
};
// 图层配置信息
let layerOptions = {
  maxGPUMemory: 512, //最大缓存数，单位 M bytes
  // loadingLimitOnInteracting : 3, //地图交互过程中瓦片请求最大数量
  // loadingLimit : 3, //瓦片请求最大数量
  services: [
    {
      url: "http://resource.dvgis.cn/data/3dtiles/dayanta/tileset.json",
      maximumScreenSpaceError: 16.0,
      heightOffset: -410
    }
  ]
};
// 设置圆心坐标和半径
const circle = new Circle([108.95938550816857, 34.219794047869385], 100);
// 获取圆边上的坐标集合测试
const coordinates = circle.getShell();
// ClipOutsideMask 是Polygon的子类,使用方式和Polygon一样
const mask = new ClipOutsideMask([coordinates]);
// 地图加载完毕回调
function getMap(e) {
  map = e;
}
// 图层加载完成后执行
function loadtileset(e) {
  if (!geo3dRef.value) return;
  const layer = geo3dRef.value.geo3DTilesLayer;
  // 设置layer mask
  // layer.setMask(mask);
  const extent = layer.getExtent(e.index);
  map.fitExtent(extent, 0, {
    animation: false
  });
}
function renderstart(e) {
  // loading.value = true;
}
function renderend(e) {
  loading.value = false;
}
// 页面加载后执行
onMounted(() => {});
// 页面销毁前执行
onBeforeUnmount(() => {
  if (map) map = undefined;
});
</script>

<style lang="scss" scoped>
.main-content {
  margin: 2px 0 0 !important;
}

.map-content {
  position: relative;
  width: 100%;
  height: calc(100vh - 0px);
  overflow: hidden;
}
</style>
