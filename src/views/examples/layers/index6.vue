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
        @getMarkData="getMarkData"
      />
    </mt-init-map>

    <div class="dialog-div" v-if="markerDataDialog">
      <i class="close-icon" @click="closeMarkerDataDialog"></i>
      <p class="point-title">点聚合单个点数据弹框</p>
      <div
        class="content-div"
        v-for="(value, key, index) in markerData"
        :key="index"
      >
        <p class="content-style" :title="value ? value : '--'">
          {{ key ? key : "未知" }}：{{ value ? value : "--" }}
        </p>
      </div>
    </div>
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
let markerData = reactive({});
let markerDataDialog = ref(false);

let options = {
  center: [121.5337426, 31.3232268], // 上海市
  zoom: 14,
  spatialReference: {
    projection: "EPSG:4326"
  },
  minZoom: 1,
  maxZoom: 20,
  bearing: 0,
  pitch: 0
};

let clusterOptions = {
  cursor: "pointer",
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

function getMarkData(e) {
  markerData = e;
  markerDataDialog.value = true;
}

function closeMarkerDataDialog() {
  markerDataDialog.value = false;
}
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

<style lang="scss">
#clusterId {
  .marker-style {
    background: url("../../../assets/marker/point1.png") no-repeat;
    background-size: 100% 100%;
    width: 30px;
    height: 30px;
    cursor: pointer;
  }
}

.dialog-div {
  width: 20vw;
  height: 30vh;
  background: url("../../../maptalks/assets/imgs/dialog/tooltipBg1.png")
    no-repeat;
  background-size: 100% 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 1vh 1vw;
  box-sizing: border-box;

  .close-icon {
    width: 2vh;
    height: 2vh;
    background: url("../../../maptalks/assets/imgs/dialog/modalClose.png")
      no-repeat;
    background-size: 100% 100%;
    position: absolute;
    top: 1vh;
    right: 1vh;
    cursor: pointer;
  }

  .point-title {
    color: #fff;
    text-align: center;
    font-size: 2.2vh;
  }

  .content-div {
    margin-top: 1vh;
  }

  .content-style {
    color: #fff;
    font-size: 2vh;
  }
}
</style>
