<template>
  <div id="threeMapId" class="map-content" v-loading="loading">
    <mt-init-map ref="mapRef" :options="options" @getMap="getMap">
      <mt-tianditu-layer
        tk="695a9bebe4c75d64d9cada2be2789425"
        layerType="img"
        @layerCreated="getImgLayer"
      />
      <mt-tianditu-layer
        tk="695a9bebe4c75d64d9cada2be2789425"
        layerType="vec"
        cssFilter="sepia(100%) invert(90%)"
        @layerCreated="getVecLayer"
      />
      <mt-group-gl-layer ref="glRef" :sceneConfig="sceneConfig">
        <mt-three-layer
          ref="geoRef"
          id="threeLayerId"
          :options="layerOptions"
          @layerCreated="loadData"
        ></mt-three-layer>
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
import { ref, onMounted, onBeforeUnmount } from "vue";
import { getGeojsonData } from "@/api/geojson";
import {
  MeshLambertMaterial,
  DirectionalLight,
  AmbientLight,
  TextureLoader,
  RepeatWrapping
} from "three";
import { GeoJSON } from "maptalks";
// 地图加载状态
let loading = ref(true);
// 地图组件名称
const mapRef = ref(null);
const glRef = ref(null);
// geojson矢量瓦片图层名称
const geoRef = ref(null);
// 图层切换开关
let layersSwitch = ref(true);
// 地图数据
let geojsonData = ref(null);
// 地图对象
let map = null;
// 底图图层
let imgLayer = undefined;
let vecLayer = undefined;
// THREE图层
let threeLayer = ref(null);
// 初始化地图参数
let options = {
  center: [85.510272, 40.84152], // 新疆
  zoom: 6,
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
// THREE图层配置信息
let layerOptions = {
  identifyCountOnEvent: 1,
  animation: true
};
// 高亮材质
var planeMaterial = new MeshLambertMaterial({
  color,
  transparent: true,
  opacity: 0.8,
  side: 0
});
var material = new MeshLambertMaterial({
  color,
  transparent: true,
  opacity: 0.8
});
const height = 10000;
const color = "rgb(255,255,255)";
const lineColor = "#fff";
// 页面加载后执行
onMounted(() => {
  getXinjiangData();
});
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
async function getXinjiangData() {
  try {
    // 这里开始模拟查询后台获取geosjon数据当然也可以从本页面import中获取
    const { data } = await getGeojsonData({ code: "65" });
    geojsonData.value = data;
  } catch (e) {
    console.log(e);
  } finally {
    setTimeout(() => {
      loading.value = false;
    }, 1000);
  }
}
// 地图加载完毕回调
function getMap(e) {
  map = e;
  if (map.isLoaded()) {
    loading.value = false;
  }
}
// 加载行政区划数据
function loadData(layer) {
  // 获取组件中的THREE图层
  threeLayer.value = layer;
  // 为three图层设置场景和光照参数
  threeLayer.value.prepareToDraw = (gl, scene, camera) => {
    var light = new DirectionalLight(0xffffff);
    light.position.set(0, -10, 10).normalize();
    scene.add(light);
    scene.add(new AmbientLight("#fff", 0.3));
    addAreaPlane(threeLayer.value);
    // addPolygons(threeLayer.value);
  };
}
// 添加多边形数据
async function addAreaPlane(threeLayer) {
  // 这里开始模拟查询后台获取geosjon数据当然也可以从本页面import中获取
  const { data } = await getGeojsonData({ code: "65" });
  let geojson = data;
  const extrudePolygons = geojson.features.map(feature => {
    return threeLayer.toExtrudePolygon(feature, { height: 1 }, planeMaterial);
  });
  resetTopUV(extrudePolygons);
  const texture = new TextureLoader().load(getImgBg(), texture => {
    planeMaterial.map = texture;
    planeMaterial.needsUpdate = true;
    threeLayer.addMesh(extrudePolygons);
    // threeLayer.addMesh(plane);
  });
  texture.needsUpdate = true; //使用贴图时进行更新
  texture.wrapS = texture.wrapT = RepeatWrapping;
  // texture.repeat.set(0.002, 0.002);
  texture.repeat.set(1.03, 1.001);
}
function resetTopUV(extrudePolygons) {
  // console.log(geometries);
  // 计算所有区域的总的包围盒
  let minx = Infinity,
    miny = Infinity,
    maxx = -Infinity,
    maxy = -Infinity,
    maxZ = -Infinity;
  extrudePolygons.forEach(extrudePolygon => {
    const geometry = extrudePolygon.getObject3d().geometry;
    const center = extrudePolygon.getObject3d().position;
    const px = center.x,
      py = center.y;
    const position = geometry.attributes.position.array;
    for (let i = 0, len = position.length; i < len; i += 3) {
      const x = position[i] + px,
        y = position[i + 1] + py,
        z = position[i + 2];
      minx = Math.min(minx, x);
      miny = Math.min(miny, y);
      maxx = Math.max(maxx, x);
      maxy = Math.max(maxy, y);
      maxZ = Math.max(maxZ, z);
    }
  });
  // console.log(minx, miny, maxx, maxy);
  // 计算每个子区域的每个轮廓坐标点的在这个包围盒的百分比
  const dx = maxx - minx,
    dy = maxy - miny;
  extrudePolygons.forEach(extrudePolygon => {
    const geometry = extrudePolygon.getObject3d().geometry;
    const position = geometry.attributes.position.array;
    const center = extrudePolygon.getObject3d().position;
    const px = center.x,
      py = center.y;
    const uv = geometry.attributes.uv.array;
    let idx = 0;
    for (let i = 0, len = position.length; i < len; i += 3) {
      const x = position[i] + px,
        y = position[i + 1] + py,
        z = position[i + 2];
      if (z === maxZ) {
        const u = (x - minx) / dx;
        const v = (y - miny) / dy;
        const index = idx * 2;
        uv[index] = u;
        uv[index + 1] = v;
      }
      idx++;
    }
  });
}
function flatPolygon2Lines(geojson) {
  const results = {
    type: "FeatureCollection",
    features: []
  };
  geojson.features.forEach(f => {
    const { geometry, properties } = f;
    const { coordinates, type } = geometry;
    let polygons = [];
    if (type.includes("Multi")) {
      polygons = coordinates;
    } else {
      polygons.push(coordinates);
    }
    polygons.forEach(p => {
      results.features.push({
        type: "Feature",
        geometry: {
          type: "MultiLineString",
          coordinates: p
        },
        properties
      });
    });
  });
  return results;
}
async function addPolygons(threeLayer) {
  // 这里开始模拟查询后台获取geosjon数据当然也可以从本页面import中获取
  const { data } = await getGeojsonData({ code: "65" });
  let geojson = data;
  const geojson1 = flatPolygon2Lines(geojson);
  const lines = GeoJSON.toGeometry(geojson1);
  lines.forEach(line => {
    const extrudeLine = threeLayer.toExtrudeLine(
      line,
      { height, altitude: -height, topColor: "#fff" },
      material
    );
    threeLayer.addMesh(extrudeLine);
  });
  // addOutLines();
}
function addOutLines() {
  let geojson = geojsonData.value;
  const polygons = GeoJSON.toGeometry(geojson);
  polygons.forEach(polygon => {
    polygon.setSymbol({
      polygonOpacity: 0,
      lineWidth: 1,
      lineColor
    });
  });
  layer.addGeometry(polygons);
}
/** 地图背景图 */
function getImgBg() {
  return new URL("../../../../public/imgs/xinjiang.png", import.meta.url).href;
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
