<template>
  <div v-loading="loading" class="map-content">
    <mt-init-map ref="mapRef" @getMap="getMap" :options="options">
      <mt-group-gl-layer
        :terrainSwitch="true"
        tk="ec89e7ba91633b147f76d47e08f9f1a1"
      >
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
        <mt-wms-tile-layer ref="wmstilelayer1" :options="wmsOptions"></mt-wms-tile-layer>
        <mt-wms-tile-layer ref="wmstilelayer2" :options="wmsOptions2"></mt-wms-tile-layer>
      </mt-group-gl-layer>
    </mt-init-map>
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, reactive } from "vue";

const loading = ref(true);
const mapRef = ref(null);
let map = null;

let options = {
  center: [81.878822,44.940405], // 甘肃省兰州市
  zoom: 14,
  spatialReference: {
    projection: "EPSG:4326"
  },
  minZoom: 1,
  maxZoom: 18,
  bearing: 0,
  pitch: 0,
}

const wmstilelayer1 = ref(null);
const wmstilelayer2 = ref(null);

let wmsOptions = reactive({
  tileSystem: [1, -1, -180, 90],
  urlTemplate: "http://10.18.27.132:28080/geoserver/agro/wms",
  crs: "EPSG:4326",
  layers: "agro:sql_gbznt_bole",
  styles: "",
  version: "1.1.0",
  format: "image/png",
  transparent: true,
  uppercase: true
})

let wmsOptions2 = reactive({
  tileSystem: [1, -1, -180, 90],
  urlTemplate: "http://10.18.27.132:28080/geoserver/agro/wms",
  crs: "EPSG:4326",
  layers: "agro:sql_nmc_bole",
  styles: "",
  version: "1.1.0",
  format: "image/png",
  transparent: true,
  uppercase: true
})

function getMap(e) {
  map = e;
  if (map.isLoaded()) {
    setTimeout(() => {
      loading.value = false;
    }, 3000);
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
  height: calc(100vh - 86px);
  overflow: hidden;
  
}
</style>
