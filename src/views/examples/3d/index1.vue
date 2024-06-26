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
        <mt-three-layer
          id="threeLayerId"
          ref="geoRef"
          :options="layerOptions"
          @layerCreated="loadData"
        />
        <mt-vector-layer
          id="vectorId"
          ref="vectorRef"
          :options="vectorOptions"
        />
      </mt-group-gl-layer>
    </mt-init-map>
    <!-- 右上角开关 -->
    <el-card class="map-operation-area">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-text class="mx-1">图层切换</el-text>
        </el-col>
        <el-col :span="16">
          <el-switch
            v-model="layersSwitch"
            class="mb-2"
            active-text="蓝黑"
            inactive-text="影像"
            @change="changeMap"
          />
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-text class="mx-1">更新数据</el-text>
        </el-col>
        <el-col :span="16">
          <IconifyIconOffline
            style="cursor: pointer"
            height="20"
            :icon="EpRefresh"
            @click="refreshData"
          />
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script setup>
import EpRefresh from "@iconify-icons/ep/refresh";
import { ColorIn } from "colorin";
import { GeoJSON } from "maptalks";
// import {
//   DirectionalLight,
//   AmbientLight,
//   MeshPhongMaterial
// } from "three";
import * as THREE from "three";
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
  center: [100.30088, 37.668009], // 海北藏族自治州
  zoom: 6.8,
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
    enable: false,
    mode: 1,
    level: 0,
    brightness: 0.489
  },
  postProcess: {
    enable: true,
    ntialias: { enable: true },
    bloom: {
      enable: true,
      threshold: 0,
      factor: 0.6,
      radius: 1
    }
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
  // enableAltitude: true,
  // altitudeProperty: "altitude", // altitude property in properties, default by 'altitude'
  geometryEvents: false,
  collisionDelay: 250,
  collisionBufferSize: 6,
  collision: false
};
// THREE图层配置信息
let layerOptions = {
  identifyCountOnEvent: 1,
  animation: true
  // forceRenderOnMoving: true,
  // forceRenderOnRotating: true
};
// 区划块饼子厚度
const height = 25000;
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
// 高亮材质
const highMaterial = new THREE.MeshPhongMaterial({
  color: "#00FA9A",
  vertexColors: 2
});
// 底图图层
let imgLayer = undefined;
let vecLayer = undefined;
let threeLayer = ref(undefined);
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
  // console.log(e);
  if (e) {
    imgLayer.hide();
    vecLayer.show();
  } else {
    imgLayer.show();
    vecLayer.hide();
  }
}
// 更新地图数据
function refreshData() {
  if (!threeLayer.value) return;
  addPolygons(threeLayer.value);
}
// 地图加载完毕回调
function getMap(e) {
  map = e;
  if (map.isLoaded()) {
    // loading.value = false;
  }
}
// 加载行政区划数据
function loadData(e) {
  // 获取组件中的THREE图层
  threeLayer.value = e;
  // 为three图层设置场景和光照参数
  threeLayer.value.prepareToDraw = (gl, scene, camera) => {
    let light = new THREE.DirectionalLight("#F0FFFF", 0.9);
    light.position.set(0, -10, 10).normalize();
    light.uuid = "light1";
    scene.add(light);
    let ambientLight = new THREE.AmbientLight("#87CEFA", 0.8);
    ambientLight.uuid = "light2";
    scene.add(ambientLight);
    addPolygons(threeLayer.value);
  };
}
// 添加多边形区划块
async function addPolygons(layer) {
  try {
    // 这里开始模拟查询后台获取geosjon数据当然也可以从本页面import中获取
    const { data } = await getGeojsonData({ code: "62" });
    // console.log(data);
    // 将查询到的geojson数据赋值给全局属性
    geojsonData.value = data;
    // 将geojson数据转为geometry对象并提取每个区划的面信息赋值给polygons数组
    const polygons = GeoJSON.toGeometry(geojsonData.value);
    const extrudePolygons = polygons.map(p => {
      const { value } = p.getProperties();
      const [r, g, b] = ci.getColor(value);
      const color = `rgb(${r},${g},${b}),0.5`;
      const extrudePolygon = layer.toExtrudePolygon(
        p,
        { height, altitude: -height, topColor: "#fff" },
        new THREE.MeshPhongMaterial({
          color,
          transparent: true,
          opacity: 0.5,
          side: 0
        })
      );
      extrudePolygon.uuid = p.getProperties().gb;
      extrudePolygon.on("mouseover mouseout", mouseEventFunc);
      return extrudePolygon;
    });
    // 获取图层中所有meshes，若存在则清除
    let meshes = layer.getMeshes();
    // console.log(meshes);
    // 判断材质数据
    if (layer && meshes.length > 0) {
      meshes.forEach(m => {
        // 外层场景环境材质不删除，奇遇没UUID的业务相关的全删
        if (m.uuid == "light1" || m.uuid == "light2") {
          // 获取场景并重新添加
          let scene = layer.getScene();
          scene.add(m);
        } else {
          layer.removeMesh(m);
        }
      });
    }
    // 添加新的meshe
    layer.addMesh(extrudePolygons);
    // 添加区划边界线
    addOutLines(polygons);
    // 添加地区文字标签
    addLabels();
  } catch (e) {
    console.log(e);
  } finally {
    setTimeout(() => {
      loading.value = false;
    }, 1000);
  }
}
// 添加区划边界线
function addOutLines(polygons) {
  polygons.forEach(polygon => {
    //polygon.setZIndexSilently(999);
    polygon.setSymbol({
      polygonOpacity: 0.25,
      lineWidth: 3.5,
      lineOpacity: 0.75,
      lineColor: "#00FFFF"
    });
  });
  let vectorLayer = vectorRef.value.vectorLayer;
  if (vectorLayer) {
    vectorLayer.addGeometry(polygons);
  }
}
// 添加地区名称
function addLabels() {
  if (!geojsonData.value) return;
  const points = GeoJSON.toGeometry(geojsonData.value);
  points.forEach(point => {
    const { name } = point.getProperties();
    point.setSymbol({
      textName: name,
      textFaceName: "sans-serif",
      textFill: "#F0FFFF",
      textHorizontalAlignment: "right",
      textSize: 18,
      textHaloRadius: 0.5,
      textHaloFill: "#2F4F4F"
    });
  });
  let vectorLayer = vectorRef.value.vectorLayer;
  if (vectorLayer) vectorLayer.addGeometry(points);
}
// 鼠标挪入挪出事件
function mouseEventFunc(e) {
  console.log(e);
  const polygon = e.target;
  if (e.type === "mouseover") {
    if (!polygon._oldSymbol) {
      polygon._oldSymbol = polygon.getObject3d().material;
    }
    polygon.getObject3d().material = highMaterial;
  } else if (e.type === "mouseout") {
    if (polygon._oldSymbol) {
      polygon.getObject3d().material = polygon._oldSymbol;
    }
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
    width: 320px;
    max-width: 480px;
    z-index: 999;
  }
}
</style>
