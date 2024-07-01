<template>
  <div v-loading="loading" class="map-content">
    <mt-init-map ref="mapRef" :options="mapOptions" @getMap="getMap">
      <mt-tianditu-layer
        tk="695a9bebe4c75d64d9cada2be2789425"
        layerType="img"
      />
      <mt-tianditu-layer
        tk="695a9bebe4c75d64d9cada2be2789425"
        layerType="cia"
      />
      <mt-tianditu-layer
        tk="695a9bebe4c75d64d9cada2be2789425"
        layerType="ibo"
      />
    </mt-init-map>
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const loading = ref(true);
const mapRef = ref(null);
let map = null;
let mapOptions = {
  center: [103.831741, 36.061685], // 甘肃省兰州市
  zoom: 14,
  spatialReference: {
    projection: "EPSG:4326"
  },
  minZoom: 1,
  maxZoom: 18,
  bearing: 0,
  pitch: 45,
  // 是否显示中心十字
  centerCross: false,
  // 是否使用无缝缩放模式
  seamlessZoom: true,
  // 是否启用地图缩放
  zoomable: true,
  // 是否禁用贴图拖动
  draggable: true,
  // 地图左下角署名
  attribution: true,
  // add zoom control
  zoomControl: true,
  // add scale control
  scaleControl: true
  // add overview control
  // overviewControl: true
};
function getMap(e) {
  map = e;
  if (map.isLoaded()) {
    loading.value = false;
  }
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
  height: calc(100vh);
  overflow: hidden;
}
</style>
