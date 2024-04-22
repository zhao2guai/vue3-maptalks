<template>
  <div v-loading="loading" class="map-content">
    <mt-init-map
      ref="mapRef"
      :options="options"
      :darkAngleSwitch="darkAngleSwitch"
      @getMap="getMap"
    >
      <mt-group-gl-layer
        :terrainSwitch="terrainSwitch"
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
      </mt-group-gl-layer>
    </mt-init-map>
    <!-- 右上角开关 -->
    <el-card class="map-operation-area">
      <el-switch
        v-model="darkAngleSwitch"
        class="mb-2"
        active-text="开启暗角"
        inactive-text="关闭暗角"
      />
      <br />
      <el-switch
        v-model="terrainSwitch"
        class="mb-2"
        active-text="开启地形"
        inactive-text="关闭地形"
      />
    </el-card>
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
// 地图加载状态
const loading = ref(true);
// 地图组件名称
const mapRef = ref(null);
// webGL图层地形开关
const terrainSwitch = ref(false);
// 地图组件的暗角开关
const darkAngleSwitch = ref(false);
// 地图对象
let map = null;
// 初始化地图参数
let options = {
  center: [103.831741, 36.061685], // 甘肃省兰州市
  zoom: 14,
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
// 页面加载后执行
onMounted(() => {});
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
  .map-operation-area {
    position: absolute;
    top: 2%;
    right: 2%;
    max-width: 480px;
    z-index: 999;
  }
}
</style>
