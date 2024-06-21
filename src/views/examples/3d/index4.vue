<template>
  <div id="threeMapId" v-loading="loading" class="map-content">
    <mt-init-map ref="mapRef" :options="options" @getMap="getMap">
      <mt-group-gl-layer ref="glRef" :sceneConfig="sceneConfig">
        <mt-tianditu-layer
          tk="695a9bebe4c75d64d9cada2be2789425"
          layerType="img"
          @layerCreated="getImgLayer"
        />
        <mt-tianditu-layer
          tk="695a9bebe4c75d64d9cada2be2789425"
          layerType="ter"
          @layerCreated="getVecLayer"
        />
        <mt-polygon-layer
          id="polygonId"
          ref="polygonRef"
          :options="polygonOptions"
          @layerCreated="addPolygon"
        />
        <mt-three-layer
          id="threeLayerId"
          ref="geoRef"
          :options="layerOptions"
          @layerCreated="loadData"
        />
        <mt-point-layer
          id="pointId"
          ref="pointRef"
          :options="pointOptions"
          @layerCreated="addPoints"
        />
      </mt-group-gl-layer>
    </mt-init-map>
    <!-- 右上角开关 -->
    <el-card class="map-operation-area">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-text class="mx-1">图层开关</el-text>
        </el-col>
        <el-col :span="16">
          <el-switch
            v-model="layersSwitch"
            class="mb-2"
            active-text="地形"
            inactive-text="影像"
            @change="changeMap"
          />
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-text class="mx-1">边界颜色</el-text>
        </el-col>
        <el-col :span="16">
          <el-color-picker
            v-model="lineColor"
            show-alpha
            @active-change="changeLineColor"
          />
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { buildUUID } from "@pureadmin/utils";
import { getGeojsonData, getShadowData, getCityData } from "@/api/geojson";
import {
  MeshLambertMaterial,
  DirectionalLight,
  AmbientLight,
  TextureLoader,
  MeshPhongMaterial,
  RepeatWrapping
} from "three";
import LineMaterial from "@/maptalks/lib/LineMaterial.js";
import { Marker, Polygon, GeoJSON, animate } from "maptalks";
// 地图加载状态
let loading = ref(true);
// 地图组件名称
const mapRef = ref(null);
const glRef = ref(null);
// geojson矢量瓦片图层名称
const geoRef = ref(null);
const pointRef = ref(null);
const polygonRef = ref(null);
const lineStringRef = ref(null);
// 图层切换开关
let layersSwitch = ref(false);
// 地图数据
let geojsonData = ref(null);
// 地图对象
let map = null;
// 底图图层
let imgLayer = ref(undefined);
let vecLayer = ref(undefined);
// THREE图层
let threeLayer = ref(null);
// 初始化地图参数
let options = {
  center: [82.22105, 44.708094], // 新疆博州
  zoom: 9,
  spatialReference: {
    projection: "EPSG:4326"
  },
  minZoom: 8,
  maxZoom: 18,
  bearing: 0,
  pitch: 45
};
// 场景配置
let sceneConfig = {
  environment: {
    enable: true,
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
    enable: true,
    renderPlugin: {
      type: "fill"
    },
    symbol: {
      polygonFill: [0.803921568627451, 0.803921568627451, 0.803921568627451, 1],
      polygonOpacity: 1
    }
  }
};
// 黑色遮罩图层配置
let polygonOptions = {
  enableAltitude: true,
  altitudeProperty: "altitude", // altitude property in properties, default by 'altitude'
  geometryEvents: false,
  collisionDelay: 250,
  collisionBufferSize: 6,
  collision: false
};
// 线图层配置
let lineStringOptions = {
  enableAltitude: true,
  altitudeProperty: "altitude", // altitude property in properties, default by 'altitude'
  geometryEvents: false,
  collisionDelay: 250,
  collisionBufferSize: 6,
  collision: false
};
// 文字标注图层配置
let pointOptions = {
  enableAltitude: true,
  altitudeProperty: "altitude", // altitude property in properties, default by 'altitude'
  geometryEvents: false,
  collisionDelay: 250,
  collisionBufferSize: 6,
  // zIndex: 99,
  collision: false
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
// 线条材质
var linematerial = new LineMaterial({
  color: "#3C9696", // 边界线颜色
  // transparent: true,
  // vertexColors: THREE.VertexColors,
  // side: THREE.BackSide,
  linewidth: 5 // in pixels
  // vertexColors: THREE.VertexColors,
  // dashed: false
});
// 3D区划块的材质光照效果
const material = new MeshPhongMaterial({
  color: "rgb(255, 255, 255)",
  specular: "rgb(255, 255, 255)",
  shininess: 100
});
const color = "rgb(255,255,1)";
let lineColor = ref("#3C9696");
const height = 10000;
const offset = 100;
const polygonLinkLine = new Map();
// 获取3D行政区划背景
const mapbg = new URL("@public/texture/xj-bozhou.png", import.meta.url);
// 页面加载后执行
onMounted(() => {});
// 页面销毁前执行
onBeforeUnmount(() => {
  if (map) map = undefined;
  imgLayer.value = undefined;
  vecLayer.value = undefined;
});
// 获取影像图层
function getImgLayer(e) {
  imgLayer.value = e;
}
// 获取矢量图层
function getVecLayer(e) {
  vecLayer.value = e;
  vecLayer.value.hide();
}
// 改变地图
function changeMap(e) {
  if (e) {
    imgLayer.value.hide();
    vecLayer.value.show();
  } else {
    imgLayer.value.show();
    vecLayer.value.hide();
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
    let light = new DirectionalLight("rgb(255, 255, 255)", 0.85);
    light.position.set(0, -10, 10).normalize();
    scene.add(light);
    scene.add(new AmbientLight("rgb(255, 255, 255)", 0.65));
    loadTexture(layer);
    animation(layer);
  };
}
/** 地图背景图 */
function loadTexture(layer) {
  const textureLoader = new TextureLoader();
  textureLoader.load(mapbg, texture => {
    texture.needsUpdate = true; //使用贴图时进行更新
    texture.wrapS = texture.wrapT = RepeatWrapping;
    // texture.repeat.set(0.002, 0.002);
    texture.repeat.set(1, 1);
    material.map = texture;
    material.needsUpdate = true;
    addAreas(layer);
  });
}
/** 加载区划块 */
async function addAreas(threeLayer) {
  try {
    // 这里开始模拟查询后台获取geosjon数据当然也可以从本页面import中获取
    const { data } = await getGeojsonData({ code: "65" });
    geojsonData.value = data;
    const polygons = GeoJSON.toGeometry(data);
    const geojsonLines = polygonToLine(data);
    const lines = GeoJSON.toGeometry(geojsonLines);
    const fatlines = lines.map(line => {
      return threeLayer.toFatLine(
        line,
        { altitude: height + offset, bloom: true },
        linematerial
      );
    });

    const extrudePolygons = polygons.map((p, index) => {
      const id = buildUUID();
      const extrudePolygon = threeLayer.toExtrudePolygon(
        p,
        { height, topColor: "rgb(255, 255, 255)", asynchronous: true },
        material
      );
      extrudePolygon.on("mouseover", polygonUp);
      extrudePolygon.on("mouseout", polygonDown);
      extrudePolygon.setId(id);
      polygonLinkLine.set(id, fatlines[index]);
      return extrudePolygon;
    });
    let idx = 0;
    extrudePolygons.forEach(extrudePolygon => {
      extrudePolygon.on("workerload", e => {
        idx++;
        if (idx === extrudePolygons.length) {
          resetTopUV(extrudePolygons);
        }
      });
    });
    // 这个fatlines报错
    threeLayer.addMesh(fatlines);
    threeLayer.addMesh(extrudePolygons);
  } catch (e) {
    console.log(e);
  } finally {
    setTimeout(() => {
      loading.value = false;
    }, 1000);
  }
}

function resetTopUV(extrudePolygons) {
  // console.log(geometries);
  //计算所有区域的总的包围盒
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
  //计算每个子区域的每个轮廓坐标点的在这个包围盒的百分比
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

function syncAltitude(id, altitude) {
  const line = polygonLinkLine.get(id);
  line.setAltitude(altitude + height + offset);
}

function polygonUp(e) {
  const polygon = e.target;
  if (polygon._showPlayer) {
    polygon._showPlayer.cancel();
  }
  const duration = 1000,
    easing = "out";
  const player = (polygon._showPlayer = animate(
    {
      altitude: 8000
    },
    {
      duration: duration,
      easing: easing
    },
    frame => {
      const altitude = frame.styles.altitude;
      if (altitude > 0) {
        this.setAltitude(altitude);
        syncAltitude(polygon.getId(), altitude);
      }
    }
  ));
  player.play();
}

function polygonDown(e) {
  const polygon = e.target;
  if (polygon._showPlayer) {
    polygon._showPlayer.cancel();
  }
  polygon.setAltitude(0);
  syncAltitude(polygon.getId(), 0);
}

function polygonToLine(geojson) {
  return geojson.features.map(f => {
    const { type, coordinates } = f.geometry;
    if (type === "MultiPolygon") {
      return {
        type: "Feature",
        geometry: {
          type: "MultiLineString",
          coordinates: coordinates.map(c => {
            return c[0];
          })
        }
      };
    }
    return {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: coordinates[0]
      }
    };
  });
}

function animation(threeLayer) {
  // layer animation support Skipping frames
  if (!threeLayer) return;
  // threeLayer._needsUpdate = !threeLayer._needsUpdate;
  if (threeLayer._needsUpdate) {
    threeLayer.redraw();
  }
  requestAnimationFrame(animation);
}

function initGui() {
  var params = {
    add: true,
    color: linematerial.color.getStyle(),
    show: true,
    opacity: 1,
    altitude: 0
  };
  var gui = new lil.GUI();
  gui
    .addColor(params, "color")
    .name("line color")
    .onChange(function () {
      linematerial.color.set(params.color);
    });
}

// 更换边界线颜色
function changeLineColor(e) {
  linematerial.color.set(e);
  lineColor.value = e;
}

// 添加打点
async function addPoints(layer) {
  // 这里开始模拟查询后台获取geosjon数据当然也可以从本页面import中获取
  const { data } = await getGeojsonData({ code: "65" });
  let features = data.features;
  if (!features || features.length === 0) return;
  let points = [];
  const blue = new URL("@public/marker/icon-blue.png", import.meta.url).href;
  const oprange = new URL("@public/marker/icon-orange.png", import.meta.url)
    .href;
  features.forEach(item => {
    const name = item.properties.name;
    const point = item.properties.centroid;
    points.push({
      point: point,
      name: name,
      color: "#FFF",
      icon: ""
    });
    new Marker(point, {
      properties: {
        name: name,
        altitude: 10000
      },
      symbol: [
        {
          markerFile: name === "博乐市" ? oprange : blue,
          markerWidth: 65,
          markerHeight: 78,
          markerOpacity: 1
        },
        {
          textName: "{name}",
          textFill: "#FFFFFF",
          textSize: 14,
          textDy: -67
        }
      ]
    }).addTo(layer);
  });
}

// 添加遮罩
async function addPolygon(layer) {
  const { data } = await getShadowData();
  let coordinates = data.features[0].geometry.coordinates;
  // console.log(coordinates);
  // let polygon = GeoJSON.toGeometry(data);
  // polygon.setSymbol({
  //   symbol: {
  //     lineColor: "#34495e",
  //     lineWidth: 2,
  //     polygonFill: "#2F4F4F",
  //     polygonOpacity: 0.85
  //   }
  // });
  const polygon = new Polygon(coordinates[0], {
    symbol: {
      lineBloom: true,
      linePatternAnimSpeed: 0.5,
      lineColor: "#00FFFF",
      lineOpacity: 0.5,
      lineWidth: 6,
      polygonFill: "#2F4F4F",
      polygonOpacity: 0.85
    }
  }).addTo(layer);
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
    width: 280px;
    top: 2%;
    right: 2%;
    max-width: 480px;
    z-index: 999;
  }
}
</style>
