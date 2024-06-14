<template>
  <div v-loading="loading" class="map-content">
    <mt-init-map ref="mapRef" :options="options" @getMap="getMap">
      <mt-group-gl-layer ref="glLayerRef" :sceneConfig="sceneConfig">
        <mt-geo3d-tile-layer
          ref="geo3dRef"
          :options="layerOptions"
          @loadtileset="loadtileset"
          @renderstart="renderstart"
          @renderend="renderend"
        ></mt-geo3d-tile-layer>
        <mt-viewshed-analysis
          ref="viewshedAnalysisRef"
          :eyePos="eyePos"
          :lookPoint="lookPoint"
          :verticalAngle="verticalAngle"
          :horizontalAngle="horizontalAngle"
        ></mt-viewshed-analysis>
      </mt-group-gl-layer>
      <mt-draw-tool
        ref="drawToolRef"
        :mode="'LineString'"
        :symbol="{ lineOpacity: 0 }"
        @mousemove="drawMousemove"
        @drawvertex="drawVertex"
        @drawstart="drawStart"
      ></mt-draw-tool>
    </mt-init-map>

    <!-- 右上角开关 -->
    <el-card class="map-operation-area">
      <el-row>
        <el-col :span="24">
          <el-button type="primary" @click="drawVisibleArea"
            >绘制可视区域</el-button
          >
        </el-col>
        <el-col :span="24" style="margin-top: 2vh">
          水平角度<el-slider
            v-model="horizontalAngle"
            :min="0"
            :max="90"
            :step="1"
          />
        </el-col>
        <el-col :span="24" style="margin-top: 0.8vh">
          垂直角度<el-slider
            v-model="verticalAngle"
            :min="0"
            :max="90"
            :step="1"
          />
        </el-col>
        <el-col :span="24" style="margin-top: 0.8vh">
          方向<el-slider
            v-model="direction"
            :min="0"
            :max="360"
            :step="1"
            @input="directionChange"
          />
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
// 地图加载状态
let loading = ref(true);
// 地图组件名称
const mapRef = ref(null);
const geo3dRef = ref(null);
const drawToolRef = ref(null);
const glLayerRef = ref(null);
const viewshedAnalysisRef = ref(null);

// 地图对象
let map = null;

let eyePos = ref(null);
let lookPoint = ref(null);
let verticalAngle = ref(30);
let horizontalAngle = ref(60);
let direction = ref(180);
let coordinates = ref([]);
let first = ref(true);
let distance = ref(null);

// 初始化地图参数
let options = {
  center: [108.95965, 34.21776], // 西安市大雁塔
  zoom: 18.865,
  spatialReference: {
    projection: "EPSG:4326"
  },
  minZoom: 1,
  maxZoom: 20,
  bearing: -90,
  pitch: 40
};

// 场景配置
let sceneConfig = {
  environment: {
    enable: true,
    mode: 1,
    level: 0,
    brightness: 0.915
  },
  postProcess: {
    enable: true
  },
  ground: {
    enable: true,
    renderPlugin: {
      type: "lit"
    },
    symbol: {
      polygonOpacity: 1,
      material: {
        baseColorFactor: [0.48235, 0.48235, 0.48235, 1],
        hsv: [0, 0, -0.532],
        roughnessFactor: 0.22,
        metallicFactor: 0.58
      }
    }
  }
};

// 图层配置信息
let layerOptions = {
  services: [
    {
      url: "http://resource.dvgis.cn/data/3dtiles/dayanta/tileset.json",
      maximumScreenSpaceError: 1.0,
      pointOpacity: 0.5,
      pointSize: 3,
      heightOffset: -400
    }
  ]
};

// 地图加载完毕回调
function getMap(e) {
  map = e;
}

// 图层加载完成后执行
function loadtileset(e) {
  if (!geo3dRef.value) return;
  const layer = geo3dRef.value.geo3DTilesLayer;
  const extent = layer.getExtent(e.index);
  map.fitExtent(extent, 1, {
    animation: false
  });
}

function renderstart(e) {
  loading.value = true;
}

function renderend(e) {
  loading.value = false;
}

// 页面加载后执行
onMounted(() => {});
// 页面销毁前执行
onBeforeUnmount(() => {
  if (map) map = undefined;
});

function drawMousemove(e) {
  let coordinate = getPickedCoordinate(e.coordinate);
  if (!coordinate) {
    return;
  }
  if (first.value) {
    coordinates.value.push(coordinate);
  } else {
    coordinates.value[coordinates.value.length - 1] = coordinate;
  }
  e.geometry.setCoordinates(coordinates.value);
  lookPoint.value = coordinate;
  viewshedAnalysisRef.value.viewshedAnalysis.update(
    "lookPoint",
    lookPoint.value
  );
  first.value = false;
}

function drawVertex(e) {
  let coordinate = getPickedCoordinate(e.coordinate);
  if (!coordinate) {
    return;
  }
  if (first) {
    coordinates.value.push(coordinate);
    first.value = false;
  } else {
    coordinates.value[coordinates.value.length - 1] = coordinate;
    first.value = true;
  }
  e.geometry.setCoordinates(coordinates.value);
  lookPoint.value = coordinate;
  viewshedAnalysisRef.value.viewshedAnalysis.update(
    "lookPoint",
    lookPoint.value
  );
  drawToolRef.value.drawTool.disable();
}

function drawStart(e) {
  distance.value = null;
  let coordinate = getPickedCoordinate(e.coordinate);
  if (!coordinate) {
    return;
  }
  coordinates.value.push(coordinate);
  e.geometry.setCoordinates(coordinates.value);
  eyePos.value = coordinate;
  viewshedAnalysisRef.value.viewshedAnalysis.update("eyePos", eyePos.value);
  first.value = true;
}

function getPickedCoordinate(coordinate) {
  let identifyData = glLayerRef.value.groupGLLayer.identify(coordinate)[0];
  return (
    (identifyData && identifyData.coordinate) || [
      coordinate.x,
      coordinate.y,
      coordinate.z || 0
    ]
  );
}

function drawVisibleArea() {
  if (drawToolRef.value) {
    drawToolRef.value.drawTool.enable();
  }
}

function directionChange(val) {
  if (distance.value === null) {
    distance.value = Math.sqrt(
      Math.pow(eyePos.value[0] - lookPoint.value[0], 2) +
        Math.pow(eyePos.value[1] - lookPoint.value[1], 2)
    );
  }
  let x = eyePos.value[0] + distance.value * Math.cos((val / 180) * Math.PI);
  let y = eyePos.value[1] + distance.value * Math.sin((val / 180) * Math.PI);
  lookPoint.value[0] = x;
  lookPoint.value[1] = y;
  viewshedAnalysisRef.value.viewshedAnalysis.update(
    "lookPoint",
    lookPoint.value
  );
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

  .map-operation-area {
    position: absolute;
    top: 2%;
    right: 2%;
    max-width: 300px;
    z-index: 999;
  }
}
</style>
