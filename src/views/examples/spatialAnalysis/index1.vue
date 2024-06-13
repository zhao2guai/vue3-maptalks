<template>
  <div v-loading="loading" class="map-content">
    <mt-init-map ref="mapRef" :options="options" @getMap="getMap">
      <mt-group-gl-layer :sceneConfig="sceneConfig">
        <mt-tianditu-layer
          tk="ec89e7ba91633b147f76d47e08f9f1a1"
          layerType="img"
        />
        <mt-geo3d-tile-layer
          ref="geo3dRef"
          id="3dtiles"
          :options="layerOptions"
          @loadtileset="loadtileset"
          @renderstart="renderstart"
          @renderend="renderend"
        ></mt-geo3d-tile-layer>
      </mt-group-gl-layer>
    </mt-init-map>

    <!-- 右上角开关 -->
    <el-card class="map-operation-area">
      <el-row>
        <el-col :span="24">
          <el-button type="primary" @click="measuringDistance"
            >测量距离</el-button
          >
        </el-col>
        <el-col :span="24" style="margin-top: 0.8vh">
          <el-button type="primary" @click="measuringArea">测量面积</el-button>
        </el-col>
        <el-col :span="24" style="margin-top: 0.8vh">
          <el-button type="primary" @click="gaugeAltitude">测量高度</el-button>
        </el-col>
        <el-col :span="24" style="margin-top: 0.8vh">
          <el-button type="primary" @click="clearAll">清除全部</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script setup>
import { Circle } from "maptalks";
import {
  ClipOutsideMask,
  Area3DTool,
  Distance3DTool,
  Height3DTool
} from "@maptalks/gl-layers";
import { ref, onMounted, onBeforeUnmount } from "vue";
// 地图加载状态
let loading = ref(true);
// 地图组件名称
const mapRef = ref(null);
const geo3dRef = ref(null);

let measureTool = ref(null);

const toolOptions = {
  once: false,
  symbol: {
    lineColor: "#e8542b",
    lineWidth: 2,
    polygonFill: "#eee",
    polygonOpacity: 0.5
  },
  vertexSymbol: {
    markerType: "ellipse",
    markerFill: "#e8542b",
    markerLineColor: "#fff",
    markerLineWidth: 2,
    markerWidth: 10,
    markerHeight: 10,
    markerDy: 0
  },
  labelSymbol: {
    boxStyle: {
      padding: [15, 6],
      verticalAlignment: "top",
      horizontalAlignment: "left",
      minWidth: 150,
      minHeight: 30,
      symbol: {
        markerType: "square",
        markerFill: "rgb(60, 60, 60)",
        markerFillOpacity: 0.8,
        markerLineColor: "#fff",
        markerLineWidth: 1,
        textDx: -110
      }
    },
    textSymbol: {
      textFill: "#fff",
      textSize: 16,
      textVerticalAlignment: "center"
    }
  }
};

// 地图对象
let map = null;
// 初始化地图参数
let options = {
  center: [108.959296, 34.224304], // 西安市大雁塔
  zoom: 20,
  spatialReference: {
    projection: "EPSG:4326"
  },
  minZoom: 1,
  maxZoom: 20,
  bearing: -15,
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
  shadow: {
    type: "esm",
    enable: true,
    quality: "high",
    opacity: 0.5,
    color: [0, 0, 0],
    blurOffset: 1
  },
  postProcess: {
    enable: true
  },
  ground: {
    enable: true, // 开启地面配置
    renderPlugin: {
      type: "fill"
    },
    symbol: {
      polygonFill: [0.803921568627451, 0.803921568627451, 0.803921568627451, 1],
      polygonOpacity: 1
    }
  }
};

// 图层配置信息
let layerOptions = {
  geometryEvents: true,
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
// 设置圆心坐标和半径
const circle = new Circle([108.95938550816857, 34.219794047869385], 100);
// 获取圆边上的坐标集合测试
const coordinates = circle.getShell();
// ClipOutsideMask 是Polygon的子类,使用方式和Polygon一样
const mask = new ClipOutsideMask([coordinates]);
// 地图加载完毕回调
function getMap(e) {
  map = e;
}
// 图层加载完成后执行
function loadtileset(e) {
  if (!geo3dRef.value) return;
  const layer = geo3dRef.value.geo3DTilesLayer;
  // 设置layer mask
  layer.setMask(mask);
  const extent = layer.getExtent(e.index);
  map.fitExtent(extent, 0, {
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

// 测量距离
function measuringDistance() {
  if (measureTool.value) {
    measureTool.value.remove();
  }
  measureTool.value = new Distance3DTool(toolOptions).addTo(map);
}

// 测量面积
function measuringArea() {
  if (measureTool.value) {
    measureTool.value.remove();
  }
  measureTool.value = new Area3DTool(toolOptions).addTo(map);
}

// 测量高度
function gaugeAltitude() {
  if (measureTool.value) {
    measureTool.value.remove();
  }
  measureTool.value = new Height3DTool(toolOptions).addTo(map);
}

// 全部清除
function clearAll() {
  if (measureTool.value) {
    measureTool.value.remove();
  }
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
    max-width: 130px;
    z-index: 999;
  }
}
</style>
