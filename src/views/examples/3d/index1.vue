<template>
  <div id="threeMapId" class="map-content" v-loading="loading">
    <mt-init-map ref="mapRef" :options="options" @getMap="getMap">
      <mt-tianditu-layer
        tk="695a9bebe4c75d64d9cada2be2789425"
        layerType="vec"
        cssFilter="sepia(100%) invert(90%)"
      />
      <mt-tianditu-layer
        tk="695a9bebe4c75d64d9cada2be2789425"
        layerType="cva"
        cssFilter="sepia(100%) invert(90%)"
      />
      <mt-tianditu-layer
        tk="695a9bebe4c75d64d9cada2be2789425"
        layerType="ibo"
        cssFilter="sepia(100%) invert(90%)"
      />
      <mt-group-gl-layer ref="glRef" :sceneConfig="sceneConfig">
        <mt-three-layer
          ref="geoRef"
          id="threeLayerId"
          :options="layerOptions"
          @layerCreated="loadData"
        ></mt-three-layer>
      </mt-group-gl-layer>
      <mt-vector-layer
        ref="vectorRef"
        id="vectorId"
        :options="vectorOptions"
      ></mt-vector-layer>
    </mt-init-map>
  </div>
</template>
<script setup>
import { ColorIn } from "colorin";
import { GeoJSON } from "maptalks";
import { DirectionalLight, AmbientLight, MeshPhongMaterial } from "three";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { getGeojsonData } from "@/api/geojson";
// 地图组件名称
const mapRef = ref(null);
// geojson矢量瓦片图层名称
const geoRef = ref(null);
const glRef = ref(null);
const vectorRef = ref(null);
// 地图数据
let geojsonData = null;
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
  [3000, "lightskyblue"],
  [5000, "yellow"],
  [7000, "orangered"]
  // [3000, "#40E0D0"],
  // [5000, "#FF8C00"],
  // [7000, "#FF0000"]
];
// 创建颜色插值库
const ci = new ColorIn(colors);
// 高亮材质
const highMaterial = new MeshPhongMaterial({
  color: "#FFFFF",
  vertexColors: 2
});
// 页面加载后执行
onMounted(() => {});
// 页面销毁前执行
onBeforeUnmount(() => {
  if (map) map = undefined;
});
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
  let threeLayer = e;
  // 为three图层设置场景和光照参数
  threeLayer.prepareToDraw = (gl, scene, camera) => {
    var light = new DirectionalLight(0xffffff);
    light.position.set(0, -10, 10).normalize();
    scene.add(light);
    scene.add(new AmbientLight("#FFFFF", 0.8));
    addPolygons(threeLayer);
  };
}
// 添加多边形区划块
async function addPolygons(layer) {
  try {
    // 这里开始模拟查询后台获取geosjon数据当然也可以从本页面import中获取
    const { data } = await getGeojsonData({ code: "62" });
    // console.log(data);
    // 将查询到的geojson数据赋值给全局属性
    geojsonData = data;
    const polygons = GeoJSON.toGeometry(geojsonData);
    const extrudePolygons = polygons.map(p => {
      const { value } = p.getProperties();
      const [r, g, b] = ci.getColor(value);
      const color = `rgb(${r},${g},${b}),0.5`;
      const extrudePolygon = layer.toExtrudePolygon(
        p,
        { height, altitude: -height, topColor: "#fff" },
        new MeshPhongMaterial({ color })
      );
      extrudePolygon.on("mouseover mouseout", mouseEventFunc);
      return extrudePolygon;
    });
    layer.addMesh(extrudePolygons);
    addOutLines(polygons);
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
    polygon.setSymbol({
      polygonOpacity: 0.25,
      lineWidth: 3.5,
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
  const points = GeoJSON.toGeometry(geojsonData);
  points.forEach(point => {
    const { name } = point.getProperties();
    point.setSymbol({
      textName: name,
      textFaceName: "sans-serif",
      textFill: "#FFFFF",
      textHorizontalAlignment: "right",
      textSize: 18,
      textHaloRadius: 0.5,
      textHaloFill: "#00FFF"
    });
  });
  let vectorLayer = vectorRef.value.vectorLayer;
  if (vectorLayer) vectorLayer.addGeometry(points);
}
// 鼠标挪入挪出事件
function mouseEventFunc(e) {
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
  height: calc(100vh - 86px);
  overflow: hidden;
}
</style>
