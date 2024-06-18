<template>
  <div id="threeMapId" v-loading="loading" class="map-content">
    <mt-init-map ref="mapRef" :options="options" @getMap="getMap">
      <mt-tianditu-layer
        tk="695a9bebe4c75d64d9cada2be2789425"
        layerType="vec"
        cssFilter="sepia(100%) invert(90%)"
        @layerCreated="getVecLayer"
      />
      <mt-tianditu-layer
        tk="695a9bebe4c75d64d9cada2be2789425"
        layerType="img"
        @layerCreated="getImgLayer"
      />
      <mt-group-gl-layer ref="glRef" :sceneConfig="sceneConfig">
        <mt-extrude-polygon-layer
          id="extrudeId"
          ref="geoRef"
          :options="layerOptions"
          @layerCreated="loadData"
        />
        <mt-vector-layer
          id="vectorId"
          ref="vectorRef"
          :options="vectorOptions"
          @layerCreated="loadLabels"
        />
      </mt-group-gl-layer>
    </mt-init-map>
    <!-- 右上角开关 -->
    <el-card class="map-operation-area">
      <el-switch
        v-model="layersSwitch"
        class="mb-2"
        active-text="蓝黑底图"
        inactive-text="影像底图"
        @change="changeMap"
      />
    </el-card>
  </div>
</template>
<script setup>
import { ColorIn } from "colorin";
import { GeoJSON } from "maptalks";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { getGeojsonData } from "@/api/geojson";
// 地图组件名称
const mapRef = ref(null);
// geojson矢量瓦片图层名称
const geoRef = ref(null);
const glRef = ref(null);
const vectorRef = ref(null);
// 图层切换开关
let layersSwitch = ref(false);
// 地图数据
let geojsonData = ref(null);
// 地图对象
let map = null;
// 地图加载状态
let loading = ref(true);
// 初始化地图参数
let options = {
  center: [82.22105, 44.708094], // 新疆博州
  zoom: 9,
  spatialReference: {
    projection: "EPSG:4326"
  },
  minZoom: 1,
  maxZoom: 18,
  bearing: 0,
  pitch: 45
};
// 场景配置
let sceneConfig = {
  environment: {
    enable: false, // 环境必须关闭否则底图不出
    mode: 1,
    level: 0,
    brightness: 0
  },
  postProcess: {
    enable: true,
    ntialias: { enable: true }
    // bloom: {
    //   enable: true,
    //   threshold: 0,
    //   factor: 0.6,
    //   radius: 1
    // }
  },
  shadow: {
    type: "esm",
    enable: true,
    quality: "high",
    opacity: 0.5,
    color: [0, 0, 0],
    blurOffset: 1
  },
  ground: {
    enable: false, // 一定要关闭地面否则蓝黑色地图被盖在GLLayer下面看不到
    renderPlugin: {
      type: "fill"
    },
    symbol: {
      polygonFill: [0.803921568627451, 0.803921568627451, 0.803921568627451, 1],
      polygonOpacity: 1
    }
  }
};
// 文字边界图层配置
let vectorOptions = {
  // enableAltitude: true
  geometryEvents: false,
  collision: true,
  collisionDelay: 250,
  collisionBufferSize: 6,
  zIndex: 99
};
const dataConfig = {
  type: "3d-extrusion",
  altitudeProperty: "height",
  altitudeScale: 5,
  defaultAltitude: 0,
  top: true,
  side: true
  // sideVerticalUVMode: 1
  // textureYOrigin: 'bottom'
};

const material = {
  baseColorFactor: [1, 1, 1, 1],
  emissiveFactor: [1, 1, 1],
  roughnessFactor: 0,
  metalnessFactor: 0,
  outputSRGB: 0,
  uvScale: [0.001, 0.0013]
};
// 三维多边形图层配置信息
let layerOptions = {
  dataConfig,
  material,
  geometryEvents: false
};
// 定义颜色值范围
const colors = [
  // [3000, "lightskyblue"],
  // [5000, "yellow"],
  // [7000, "orangered"]
  [3000, "#008B8B"],
  [5000, "#FF8C00"],
  [7000, "#8B0000"]
];
// 创建颜色插值库
const ci = new ColorIn(colors);
// 底图图层
let imgLayer = undefined;
let vecLayer = undefined;
// 页面加载后执行
onMounted(() => {});
// 页面销毁前执行
onBeforeUnmount(() => {
  if (map) map = undefined;
  imgLayer = undefined;
  vecLayer = undefined;
});
// 获取影像图层
function getImgLayer(e) {
  imgLayer = e;
}
// 获取矢量图层
function getVecLayer(e) {
  vecLayer = e;
}
// 改变地图
function changeMap(e) {
  if (e) {
    imgLayer.hide();
    vecLayer.show();
  } else {
    imgLayer.show();
    vecLayer.hide();
  }
}
// 地图加载完毕回调
function getMap(e) {
  map = e;
  if (map.isLoaded()) {
    // loading.value = false;
  }
}
// 加载行政区划数据
async function loadData(layer) {
  try {
    loading.value = true;
    // 这里开始模拟查询后台获取geosjon数据当然也可以从本页面import中获取
    const { data } = await getGeojsonData({ code: "65" });
    // console.log(data);
    // 将查询到的geojson数据赋值给全局属性
    geojsonData.value = data;
    const polygons = GeoJSON.toGeometry(data);
    polygons.forEach(polygon => {
      // console.log(polygon.getProperties());
      // 获取行政区划中的value
      const { value, name } = polygon.getProperties();
      const [r, g, b] = ci.getColor(value);
      const color = `rgb(${r},${g},${b})`;
      polygon.setSymbol({
        lineColor: "#00FFFF",
        // lineDasharray: [10, 5, 5],
        lineWidth: 6,
        polygonFill: color,
        polygonOpacity: 0.5,
        // topPolygonFill: "#DAA520",
        // bottomPolygonFill: "#FF8C00"
        textName: name ? name : "",
        textPitchAlignment: "map",
        textRotationAlignment: "map"
      });
      polygon.setProperties({
        height: 1000
      });
    });
    layer.addGeometry(polygons);
  } catch (e) {
    console.log(e);
  } finally {
    setTimeout(() => {
      loading.value = false;
    }, 1000);
  }
}
// 加载文字标注
async function loadLabels(layer) {
  try {
    loading.value = true;
    // 这里开始模拟查询后台获取geosjon数据当然也可以从本页面import中获取
    const { data } = await getGeojsonData({ code: "65" });
    // console.log(data);
    // 将查询到的geojson数据赋值给全局属性
    geojsonData.value = data;
    const polygons = GeoJSON.toGeometry(data);
    polygons.forEach(polygon => {
      // console.log(polygon.getProperties());
      // 获取行政区划中的value
      const { name } = polygon.getProperties();
      polygon.setSymbol({
        lineColor: "#00FFFF",
        // lineDasharray: [10, 5, 5],
        lineWidth: 6,
        textName: name ? name : "",
        textPitchAlignment: "map",
        textRotationAlignment: "map"
      });
    });
    layer.addGeometry(polygons);
  } catch (e) {
    console.log(e);
  } finally {
    setTimeout(() => {
      loading.value = false;
    }, 1000);
  }
}
</script>

<style lang="scss">
#threeMapId {
  .marker-info {
    font-size: 14px;
    color: #fff;
    /* text-shadow: 2px 0 white; */
    background-color: rgba(0, 0, 0, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.7);
    /* width: 120px; */
    min-width: 60px;
    height: auto;
    line-height: 20px;
    text-align: center;
  }
}
</style>

<style lang="scss" scoped>
.main-content {
  margin: 2px 0 0 !important;
}

.map-content {
  position: relative;
  width: 100%;
  height: calc(100vh - 0px);
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
