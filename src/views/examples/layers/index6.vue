<template>
  <div v-loading="loading" id="clusterId" class="map-content">
    <mt-init-map ref="mapRef" @getMap="getMap" :options="options">
      <mt-tianditu-layer
        tk="ec89e7ba91633b147f76d47e08f9f1a1"
        layerType="img"
      />
      <mt-maker-cluster-layer
        :geoJsonData="geojsonData"
        :options="clusterOptions"
      />
    </mt-init-map>
  </div>
</template>
<script setup>
import { ref, onBeforeMount, onBeforeUnmount, reactive, nextTick } from "vue";
import { getmarkerClusterData } from "@/api/geojson";

const loading = ref(true);
const mapRef = ref(null);

let map = null;

// 点聚合数据
let geojsonData = ref(null);

let options = {
  center: [121.5337426, 31.3232268], // 上海市
  zoom: 14,
  spatialReference: {
    projection: "EPSG:4326"
  },
  minZoom: 1,
  maxZoom: 19,
  bearing: 0,
  pitch: 0
};

let clusterOptions = {
  content: '<div class="marker-style"><div>'
};

function getMap(e) {
  map = e;
  if (map.isLoaded()) {
    loading.value = false;
  }
}

onBeforeMount(() => {
  nextTick(() => {
    addPolygons();
  });
});

onBeforeUnmount(() => {});

onBeforeUnmount(() => {});

// 查询点聚合数据
async function addPolygons(layer) {
  try {
    // 这里开始模拟查询后台获取geosjon数据当然也可以从本页面import中获取
    const { data } = await getmarkerClusterData();
    // 将查询到的geojson数据赋值给全局属性
    geojsonData.value = data;
  } catch (e) {
    console.log(e);
  } finally {
    setTimeout(() => {
      loading.value = false;
    }, 1000);
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
}
</style>

<style lang="scss">
#clusterId {
  .marker-style {
    background: url("../../../assets/marker/point1.png") no-repeat;
    background-size: 100% 100%;
    width: 30px;
    height: 30px;
  }
}
</style>
