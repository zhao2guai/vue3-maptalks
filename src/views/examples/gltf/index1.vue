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
        <mt-gltf-layer >
          <mt-gltf-maker :point="[81.878822, 44.940405, 0]" :symbol="symbol" />
          <mt-gltf-maker :point="[81.878822, 44.930405, 0]" :symbol="symbol1" />
          <mt-gltf-maker :point="[81.878822, 44.950405, 0]" :symbol="symbol2" />
          <mt-gltf-maker :point="[81.878822, 44.960405, 0]" :symbol="symbol3" />
          <mt-gltf-maker :point="[81.868822, 44.940405, 0]" :symbol="symbol" />
          <mt-gltf-maker :point="[81.858822, 44.940405, 0]" :symbol="symbol" />
        </mt-gltf-layer>
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
  maxZoom: 20,
  bearing: 0,
  pitch: 45,

}

let symbol = {
  url: new URL('@/maptalks/assets/gltf/animal/pig.gltf', import.meta.url), //模型的url	
  visible: true, //模型是否可见	
  translationL:	[0, 0, 0], //模型在本地坐标系xyz轴上的偏移量
  rotation: [0, 0, 0], //模型在本地坐标系xyz轴上的旋转角度，单位角度
  scale: [1, 1, 1], //模型在本地坐标系xyz轴上的缩放倍数	
  animation: false, //是否开启动画
  animationName: 0, //动画序列名称
  loop: true, //是否开启动画循环
  speed: 1, //动画速度倍数
  fixSizeOnZoom: -1,//在给定级别上固定模型大小，不再随地图缩放而改变，设置为-1时取消
  anchorZ: 'bottom', //模型在z轴上的锚点或对齐点，可选的值： top， bottom
  shadow: true, //是否开启阴影
  bloom: true, //是否开启泛光	
  shader: 'pbr', //模型绘制的shader，可选值：pbr, phong, wireframe
  modelHeight: 240,
}

let symbol1 = {
  url: new URL('@/maptalks/assets/gltf/chicken_rig/scene.gltf', import.meta.url), //模型的url	
  visible: true, //模型是否可见	
  translationL:	[0, 0, 0], //模型在本地坐标系xyz轴上的偏移量
  rotation: [0, 0, 0], //模型在本地坐标系xyz轴上的旋转角度，单位角度
  scale: [1, 1, 1], //模型在本地坐标系xyz轴上的缩放倍数	
  animation: true, //是否开启动画
  loop: true, //是否开启动画循环
  speed: 1, //动画速度倍数
  fixSizeOnZoom: -1,//在给定级别上固定模型大小，不再随地图缩放而改变，设置为-1时取消
  anchorZ: 'bottom', //模型在z轴上的锚点或对齐点，可选的值： top， bottom
  shadow: true, //是否开启阴影
  bloom: true, //是否开启泛光	
  shader: 'pbr', //模型绘制的shader，可选值：pbr, phong, wireframe
  modelHeight: 240,
}

let symbol2 = {
  url: new URL('@/maptalks/assets/gltf/texas_longhorn/scene.gltf', import.meta.url), //模型的url	
  visible: true, //模型是否可见	
  translationL:	[0, 0, 0], //模型在本地坐标系xyz轴上的偏移量
  rotation: [0, 0, 0], //模型在本地坐标系xyz轴上的旋转角度，单位角度
  scale: [1, 1, 1], //模型在本地坐标系xyz轴上的缩放倍数	
  animation: true, //是否开启动画
  loop: true, //是否开启动画循环
  speed: 1, //动画速度倍数
  fixSizeOnZoom: -1,//在给定级别上固定模型大小，不再随地图缩放而改变，设置为-1时取消
  anchorZ: 'bottom', //模型在z轴上的锚点或对齐点，可选的值： top， bottom
  shadow: true, //是否开启阴影
  bloom: true, //是否开启泛光	
  shader: 'pbr', //模型绘制的shader，可选值：pbr, phong, wireframe
  modelHeight: 240,
}

let symbol3 = {
  url: new URL('@/maptalks/assets/gltf/sheep-test_non-commercial/scene.gltf', import.meta.url), //模型的url	
  visible: true, //模型是否可见	
  translationL:	[0, 0, 0], //模型在本地坐标系xyz轴上的偏移量
  rotation: [0, 0, 0], //模型在本地坐标系xyz轴上的旋转角度，单位角度
  scale: [.5, .5, .5], //模型在本地坐标系xyz轴上的缩放倍数	
  animation: true, //是否开启动画
  loop: true, //是否开启动画循环
  speed: 1, //动画速度倍数
  fixSizeOnZoom: -1,//在给定级别上固定模型大小，不再随地图缩放而改变，设置为-1时取消
  anchorZ: 'bottom', //模型在z轴上的锚点或对齐点，可选的值： top， bottom
  shadow: true, //是否开启阴影
  bloom: true, //是否开启泛光	
  shader: 'pbr', //模型绘制的shader，可选值：pbr, phong, wireframe
  scaleX: 80,
  scaleY: 80,
  scaleZ: 80
}

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
