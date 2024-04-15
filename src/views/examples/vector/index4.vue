<template>
  <div v-loading="loading" class="map-content">
    <mt-init-map ref="mapRef" @getMap="getMap" :options="options">
      <mt-group-gl-layer
        :terrainSwitch="false"
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
        <mt-wms-tile-layer ref="wmstilelayer1" :options="wmsOptions" :isFeatureInfo="true"></mt-wms-tile-layer>
        <mt-wms-tile-layer ref="wmstilelayer2" :options="wmsOptions2" :isFeatureInfo="false"></mt-wms-tile-layer>
      </mt-group-gl-layer>
      <!-- <mt-wms-tile-layer ref="wmstilelayer1" :options="wmsOptions"></mt-wms-tile-layer> -->
    </mt-init-map>
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, reactive } from "vue";
import { getProductCategory } from "@/api/mapService";
import { ui } from "maptalks";

const loading = ref(true);
const mapRef = ref(null);
const wmstilelayer1 = ref(null);
const wmstilelayer2 = ref(null);

let map = null;
let infoWindow = undefined; 

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
    loading.value = false;
    map.on('click', singleclick)  
  }
}

onMounted(() => {});

onBeforeUnmount(() => {
  map = undefined;
  infoWindow.remove();
  infoWindow = undefined;
});

// 图层点击事件
const singleclick = (e) => {
  if(infoWindow) {
    infoWindow.remove();
    infoWindow = undefined;
  }
    let coordinate = {};
    coordinate.x = e.coordinate.x;
    coordinate.y = e.coordinate.y;
    let wmstilelayerRefList = [wmstilelayer1.value.getOlLayer(), wmstilelayer2.value.getOlLayer()];
    console.log(map.getExtent());
    for(let i = 0; i < wmstilelayerRefList.length; i++) {
      if(wmstilelayerRefList[i]) {
        let url = wmstilelayerRefList[i].getSource().getFeatureInfoUrl([coordinate.x, coordinate.y], map.getExtent(), wmstilelayerRefList[i].getSource().getProjection(), {
          REQUEST: "GetFeatureInfo",
          INFO_FORMAT: "application/json"
        });
        if(!url) return;
        url = url.replace(import.meta.env.VITE_GEOSERVER_BASEURL, "");
        getMapServeData(url, coordinate);
      }
    }
};

const getMapServeData = (url, coordinate) => {
  getProductCategory(url).then(res => {
    // 若是本次请求是自定义则返回值取data，若不是就用geoserver的features
    if(res.features && res.features.length > 0) {
      let properties = res.features[0].properties;
      infoWindow = new ui.InfoWindow({
        title: properties.xmmc,
        content: "所属地区：" + properties.region_code + '</br>项目编号：' + properties.xmbh + '</br>项目面积（亩）：' + properties.xmmj_m
      });
      infoWindow.addTo(map).show(coordinate);
    }
  })
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
