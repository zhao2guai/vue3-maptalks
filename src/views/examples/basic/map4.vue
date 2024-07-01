<template>
  <div class="map-content">
    <mt-init-map :options="mapOptions" @getMap="getMap">
      <mt-base-layer>
        <!-- 瓦片图层组(底图插槽中只能放一个图层) -->
        <mt-group-tile-layer>
          <!-- 天地图影像 -->
          <mt-tianditu-layer
            tk="695a9bebe4c75d64d9cada2be2789425"
            layerType="img"
          />
          <!-- 天地图注记 -->
          <mt-tianditu-layer
            tk="695a9bebe4c75d64d9cada2be2789425"
            layerType="cia"
          />
          <!-- 天地图边界 -->
          <mt-tianditu-layer
            tk="695a9bebe4c75d64d9cada2be2789425"
            layerType="ibo"
          />
        </mt-group-tile-layer>
        <!-- 测试底图插槽中放入第二个则会覆盖其他图层 -->
        <!-- <mt-tianditu-layer
          tk="695a9bebe4c75d64d9cada2be2789425"
          layerType="vec"
        /> -->
      </mt-base-layer>
    </mt-init-map>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
// 地图对象
let map = null;
// 地图配置参数
let mapOptions = {
  center: [103.840784, 36.066764], // 兰州市
  zoom: 6,
  spatialReference: {
    projection: "EPSG:4326"
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
