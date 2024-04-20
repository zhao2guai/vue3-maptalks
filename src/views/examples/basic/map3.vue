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
  center: [103.831741, 48.061685],
  zoom: 6,
  spatialReference: {
    projection: "EPSG:4326"
  },
  minZoom: 1,
  maxZoom: 18,
  bearing: 0,
  pitch: 0
};
let options = {
  urlTemplate: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
  subdomains: ["a", "b", "c", "d"],
  attribution:
    "&copy; <a href='http://osm.org'>OpenStreetMap</a> contributors, &copy; <a href='https://carto.com/'>CARTO</a>"
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
  height: calc(100vh - 86px);
  overflow: hidden;
}
</style>
