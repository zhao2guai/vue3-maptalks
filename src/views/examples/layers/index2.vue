<template>
  <div id="geoMapId" class="map-content" v-loading="loading">
    <mt-init-map
      ref="mapRef"
      :options="options"
      @getMap="getMap"
      @mousemove="mousemove"
    >
      <mt-group-gl-layer :sceneConfig="sceneConfig">
        <mt-tianditu-layer
          tk="ec89e7ba91633b147f76d47e08f9f1a1"
          layerType="img"
        />
        <mt-geojson-vector-tile-layer
          ref="geoRef"
          :options="layerOptions"
        ></mt-geojson-vector-tile-layer>
      </mt-group-gl-layer>
    </mt-init-map>
  </div>
</template>
<script setup>
import { ui } from "maptalks";
import { ref, onMounted, onBeforeUnmount } from "vue";
import geojson62 from "../../../geojson/62/甘肃省_市.json";
// 地图组件名称
const mapRef = ref(null);
// geojson矢量瓦片图层名称
const geoRef = ref(null);
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
  pitch: 0
};
// 场景配置
let sceneConfig = {
  environment: {
    enable: true,
    mode: 1,
    level: 0,
    brightness: 0
  },
  postProcess: {
    enable: true,
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
// 图层样式信息
const style = {
  style: [
    {
      name: "area-fill",
      filter: true,
      renderPlugin: {
        dataConfig: {
          type: "fill"
        },
        sceneConfig: {},
        type: "fill"
      },
      symbol: {
        polygonFill: "#996247",
        polygonOpacity: 1
      }
    },
    {
      name: "area-border",
      filter: true,
      renderPlugin: {
        dataConfig: {
          type: "line"
        },
        sceneConfig: {},
        type: "line"
      },
      symbol: {
        lineColor: "#E2E2E2",
        lineOpacity: 1,
        lineWidth: 2
      }
    }
  ]
};
// 图层配置信息
let layerOptions = {
  style,
  data: geojson62
};
// 高亮颜色参数
let params = {
  color: "#2e7e57",
  bloom: false,
  lineColor: "#000",
  opacity: 1
};
// 高亮类型
const highLightKey = "test";
// 创建点位对象
var uiMarker = null;

// 页面加载后执行
onMounted(() => {
  // loadData();
});
// 页面销毁前执行
onBeforeUnmount(() => {
  if (map) map = undefined;
});

// 地图加载完毕回调
function getMap(e) {
  map = e;
  if (map.isLoaded()) {
    loading.value = false;
    // 创建弹窗对象
    uiMarker = new ui.UIMarker(map.getCenter(), {
      content: '<div class="text_marker">maptalks</div>',
      dy: 30
    });
  }
}
// 高亮后的要素变色
function highLight(feature, layer) {
  // 开启高亮
  params.bloom = true;
  // 设置图层中要素样式
  layer.highlight([
    {
      name: getHighLightKey("fill"),
      id: feature.id,
      plugin: "area-fill", //only effect 'area-fill' render plugin
      ...params
    },
    {
      name: getHighLightKey("border"),
      id: feature.id,
      plugin: "area-border",
      color: params.lineColor
    }
  ]);
}
// 获取高亮类型
function getHighLightKey(key) {
  return `${highLightKey}_${key}`;
}
// 取消要素变色
function cancel(layer) {
  // 取消高亮
  params.bloom = false;
  // 还原要素样式
  layer.cancelHighlight([getHighLightKey("fill"), getHighLightKey("border")]);
}
// 鼠标挪入事件
function mousemove(e) {
  if (!geoRef.value) return;
  let geo = geoRef.value.geoJSONVectorTileLayer;
  // console.log(e.coordinate);
  if (geo && e.coordinate) {
    const data = geo.identify(e.coordinate);
    if (!data || !data.length) {
      cancel(geo);
      uiMarker.remove();
      return;
    }
    const feature = data[data.length - 1].data.feature;
    highLight(feature, geo);
    showInfo(e.coordinate, feature);
    // console.log(data[0]);
  }
}
// 根据要素数据设置点位弹窗内容
function getMarkerContent(feature) {
  return `<div class="marker-info">${feature.properties.name}</div>`;
}
// 添加弹窗并弹出
function showInfo(coordinate, feature) {
  if (!uiMarker.getMap()) {
    uiMarker.addTo(map);
  }
  uiMarker.setContent(getMarkerContent(feature));
  uiMarker.setCoordinates(coordinate);
}
</script>

<style lang="scss">
#geoMapId {
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
