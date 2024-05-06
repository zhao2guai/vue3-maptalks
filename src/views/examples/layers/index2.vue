<template>
  <div v-loading="loading" class="map-content">
    <mt-init-map ref="mapRef" :options="options" @getMap="getMap">
      <mt-group-gl-layer>
        <mt-tianditu-layer
          tk="ec89e7ba91633b147f76d47e08f9f1a1"
          layerType="img"
        />
        <mt-tianditu-layer
          tk="ec89e7ba91633b147f76d47e08f9f1a1"
          layerType="cia"
        />
        <mt-tianditu-layer
          tk="ec89e7ba91633b147f76d47e08f9f1a1"
          layerType="ibo"
        />
        <mt-geojson-vector-tile-layer
          :options="layerOptions"
        ></mt-geojson-vector-tile-layer>
      </mt-group-gl-layer>
    </mt-init-map>
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, reactive } from "vue";
import geojson62 from "../../../geojson/62/甘肃省_市.json";
// 地图组件名称
const mapRef = ref(null);
// 地图对象
let map = null;
// 地图加载状态
let loading = ref(true);
// 初始化地图参数
let options = {
  center: [100.30088, 37.668009], // 海北藏族自治州
  zoom: 6.8,
  spatialReference: {
    projection: "EPSG:4326"
  },
  minZoom: 1,
  maxZoom: 18,
  bearing: 0,
  pitch: 0
};
// 地图加载完毕回调
function getMap(e) {
  map = e;
  if (map.isLoaded()) {
    loading.value = false;
  }
}
// 图层配置信息
let layerOptions = {
  style: [
    {
      name: "area-fill",
      filter: true,
      renderPlugin: {
        dataConfig: {
          type: "fill"
        },
        sceneConfig: {},
        type: "fill"
      },
      symbol: {
        polygonFill: "green",
        polygonOpacity: 0.7
      }
    },
    {
      name: "area-border",
      filter: true,
      renderPlugin: {
        dataConfig: {
          type: "line"
        },
        sceneConfig: {},
        type: "line"
      },
      symbol: {
        lineColor: "#000",
        lineOpacity: 1,
        lineWidth: 2
      }
    }
  ],
  data: geojson62
};
// 页面加载后执行
onMounted(() => {
  // loadData();
});
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
  height: calc(100vh - 86px);
  overflow: hidden;
}
</style>
