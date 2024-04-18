<template>
  <div class="map-content">
    <mt-init-map :options="mapOptions" @getMap="getMap">
      <mt-tile-layer :options="options"></mt-tile-layer>
    </mt-init-map>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";

let map = null;
let mapOptions = {
  center: [105.08052356963802, 36.04231948670001],
  zoom: 5,
  minZoom: 1,
  maxZoom: 19,
  spatialReference: {
    projection: "baidu"
  }
};
let options = {
  urlTemplate:
    "https://gss{s}.bdstatic.com/8bo_dTSlRsgBo1vgoIiO_jowehsv/tile/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=1&udt=20170927",
  subdomains: [0, 1, 2, 3],
  attribution: '&copy; <a target="_blank" href="http://map.baidu.com">Baidu</a>'
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
  height: 100%;
  overflow: hidden;
}
</style>
