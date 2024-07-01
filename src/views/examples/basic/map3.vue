<template>
  <div class="map-content">
    <mt-init-map :options="mapOptions" @getMap="getMap">
      <!-- 底图专用图层示例 -->
      <mt-base-layer>
        <!-- 底图插槽中只能放一个瓦片底图 -->
        <mt-tile-layer :options="options" />
      </mt-base-layer>
    </mt-init-map>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
// 地图对象
let map = null;
// 地图参数配置
let mapOptions = {
  center: [103.840784, 36.066764], // 兰州市
  zoom: 6,
  spatialReference: {
    projection: "baidu" // 百度地图专用坐标系(不建议项目中使用)
    // projection: "EPSG:4326"
  },
  minZoom: 1,
  maxZoom: 18,
  bearing: 0,
  pitch: 0,
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
// 图层配置信息
let options = {
  urlTemplate:
    "https://gss{s}.bdstatic.com/8bo_dTSlRsgBo1vgoIiO_jowehsv/tile/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=1&udt=20170927",
  subdomains: [0, 1, 2, 3],
  attribution: '&copy; <a target="_blank" href="http://map.baidu.com">Baidu</a>'
  // tileSystem: [1, -1, -180, 90],
  // urlTemplate: "https://ows.terrestris.de/osm/service",
  // crs: "EPSG:4326",
  // layers: "OSM-WMS",
  // styles: "",
  // version: "1.3.0",
  // format: "image/png",
  // transparent: true,
  // uppercase: true
};

function getMap(e) {
  map = e;
}

onMounted(() => {});

onUnmounted(() => {
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
