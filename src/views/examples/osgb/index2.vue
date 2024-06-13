<template>
  <div v-loading="loading" class="map-content">
    <mt-init-map
      ref="mapRef"
      :options="options"
      @getMap="getMap"
      @click="singleclick"
    >
      <mt-group-gl-layer :sceneConfig="sceneConfig">
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
        <mt-wms-tile-layer
          ref="gbzRef"
          :options="wmsOptions"
          :isFeatureInfo="true"
        ></mt-wms-tile-layer>
        <mt-geo3d-tile-layer
          ref="geo3dRef"
          id="3dtiles"
          :options="layerOptions"
          @loadtileset="loadtileset"
          @renderstart="renderstart"
          @renderend="renderend"
        ></mt-geo3d-tile-layer>
        <mt-gltf-layer>
          <mt-gltf-maker
            ref="symbol3"
            :point="[87.2836, 44.2208]"
            :symbol="symbol1"
          />
        </mt-gltf-layer>
      </mt-group-gl-layer>
    </mt-init-map>
    <!-- 右上角开关 -->
    <el-card class="map-operation-area">
      <el-row :gutter="24">
        <el-col :span="12"><el-text class="mx-1">高标准农田</el-text></el-col>
        <el-col :span="12">
          <el-switch
            v-model="layersSwitch"
            class="mb-2"
            active-text="开启"
            inactive-text="关闭"
            @change="changeLayer"
          />
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12"><el-text class="mx-1">倾斜摄影</el-text></el-col>
        <el-col :span="12">
          <el-switch
            v-model="osgbSwitch"
            class="mb-2"
            active-text="开启"
            inactive-text="关闭"
            @change="changeOsbg"
          />
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script setup>
import { Circle, ui } from "maptalks";
import { ClipOutsideMask } from "@maptalks/gl-layers";
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { getProductCategory } from "@/api/mapService";
// 地图加载状态
let loading = ref(true);
// 图层切换开关
let layersSwitch = ref(true);
let osgbSwitch = ref(true);
// 地图组件名称
const mapRef = ref(null);
const geo3dRef = ref(null);
const gbzRef = ref(null);
// 地图弹窗
let infoWindow = undefined;
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
// 高标准农田图层配置
let wmsOptions = reactive({
  tileSystem: [1, -1, -180, 90],
  urlTemplate: "http://10.18.27.132:28080/geoserver/agro/wms",
  crs: "EPSG:4326",
  layers: "agro:sql_gbznt_bole",
  styles: "",
  version: "1.1.0",
  format: "image/png",
  transparent: true,
  uppercase: true
});
// 图层配置信息
let layerOptions = {
  loadingLimit: 3,
  loadingLimitOnInteracting: 3,
  services: [
    {
      url: "http://mapgl.com/data/model/dikuai/tileset.json",
      maximumScreenSpaceError: 16.0,
      heightOffset: -310
    }
  ]
};
// 摄像头监测设备
let symbol1 = {
  url: new URL("@/assets/gltf/equipment/01.gltf", import.meta.url), //模型的url
  visible: true, //模型是否可见
  translationL: [0, 0, 0], //模型在本地坐标系xyz轴上的偏移量
  rotation: [0, 0, 0], //模型在本地坐标系xyz轴上的旋转角度，单位角度
  scale: [1, 1, 1], //模型在本地坐标系xyz轴上的缩放倍数
  animation: true, //是否开启动画
  loop: true, //是否开启动画循环
  speed: 1, //动画速度倍数
  fixSizeOnZoom: -1, //在给定级别上固定模型大小，不再随地图缩放而改变，设置为-1时取消
  anchorZ: "bottom", //模型在z轴上的锚点或对齐点，可选的值： top， bottom
  shadow: true, //是否开启阴影
  bloom: true, //是否开启泛光
  shader: "pbr", //模型绘制的shader，可选值：pbr, phong, wireframe
  modelHeight: 200,
  translationZ: -120
};
// 气象监测设备
let symbol2 = {
  url: new URL("@/assets/gltf/equipment/02.gltf", import.meta.url), //模型的url
  visible: true, //模型是否可见
  translationL: [0, 0, 0], //模型在本地坐标系xyz轴上的偏移量
  rotation: [0, 0, 0], //模型在本地坐标系xyz轴上的旋转角度，单位角度
  scale: [1, 1, 1], //模型在本地坐标系xyz轴上的缩放倍数
  animation: true, //是否开启动画
  loop: true, //是否开启动画循环
  speed: 1, //动画速度倍数
  fixSizeOnZoom: -1, //在给定级别上固定模型大小，不再随地图缩放而改变，设置为-1时取消
  anchorZ: "bottom", //模型在z轴上的锚点或对齐点，可选的值： top， bottom
  shadow: true, //是否开启阴影
  bloom: true, //是否开启泛光
  shader: "pbr", //模型绘制的shader，可选值：pbr, phong, wireframe
  modelHeight: 240,
  translationZ: -120
};
// 虫情设备
let symbol4 = {
  url: new URL("@/assets/gltf/equipment/03.gltf", import.meta.url), //模型的url
  visible: true, //模型是否可见
  translationL: [0, 0, 0], //模型在本地坐标系xyz轴上的偏移量
  rotation: [0, 0, 0], //模型在本地坐标系xyz轴上的旋转角度，单位角度
  scale: [1, 1, 1], //模型在本地坐标系xyz轴上的缩放倍数
  animation: true, //是否开启动画
  loop: true, //是否开启动画循环
  speed: 1, //动画速度倍数
  fixSizeOnZoom: -1, //在给定级别上固定模型大小，不再随地图缩放而改变，设置为-1时取消
  anchorZ: "bottom", //模型在z轴上的锚点或对齐点，可选的值： top， bottom
  shadow: true, //是否开启阴影
  bloom: true, //是否开启泛光
  shader: "pbr", //模型绘制的shader，可选值：pbr, phong, wireframe
  modelHeight: 240,
  translationZ: -120
};
// 水肥一体机
let symbol5 = {
  url: new URL("@/assets/gltf/equipment/04.gltf", import.meta.url), //模型的url
  visible: true, //模型是否可见
  translationL: [0, 0, 0], //模型在本地坐标系xyz轴上的偏移量
  rotation: [0, 0, 0], //模型在本地坐标系xyz轴上的旋转角度，单位角度
  scale: [1, 1, 1], //模型在本地坐标系xyz轴上的缩放倍数
  animation: true, //是否开启动画
  loop: true, //是否开启动画循环
  speed: 1, //动画速度倍数
  fixSizeOnZoom: -1, //在给定级别上固定模型大小，不再随地图缩放而改变，设置为-1时取消
  anchorZ: "bottom", //模型在z轴上的锚点或对齐点，可选的值： top， bottom
  shadow: true, //是否开启阴影
  bloom: true, //是否开启泛光
  shader: "pbr", //模型绘制的shader，可选值：pbr, phong, wireframe
  modelHeight: 240,
  translationZ: -120
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
  // loading.value = true;
}
function renderend(e) {
  loading.value = false;
}
// 图层点击事件
function singleclick(e) {
  if (infoWindow) {
    infoWindow.remove();
    infoWindow = undefined;
  }
  // console.log(e.coordinate);
  if (!e.coordinate) return;
  let coordinate = {};
  coordinate.x = e.coordinate.x;
  coordinate.y = e.coordinate.y;
  let wmstilelayerRefList = [gbzRef.value.getOlLayer()];
  // console.log(map.getExtent());
  for (let i = 0; i < wmstilelayerRefList.length; i++) {
    if (wmstilelayerRefList[i]) {
      let url = wmstilelayerRefList[i]
        .getSource()
        .getFeatureInfoUrl(
          [coordinate.x, coordinate.y],
          map.getExtent(),
          wmstilelayerRefList[i].getSource().getProjection(),
          {
            REQUEST: "GetFeatureInfo",
            INFO_FORMAT: "application/json"
          }
        );
      if (!url) return;
      url = url.replace(import.meta.env.VITE_GEOSERVER_BASEURL, "");
      getMapServeData(url, coordinate);
    }
  }
}
// 请求geoserver获取图层信息
function getMapServeData(url, coordinate) {
  getProductCategory(url).then(res => {
    // 若是本次请求是自定义则返回值取data，若不是就用geoserver的features
    if (res.features && res.features.length > 0) {
      let properties = res.features[0].properties;
      infoWindow = new ui.InfoWindow({
        title: properties.xmmc,
        content:
          "所属地区：" +
          properties.region_code +
          "</br>项目编号：" +
          properties.xmbh +
          "</br>项目面积（亩）：" +
          properties.xmmj_m
      });
      infoWindow.addTo(map).show(coordinate);
    }
  });
}
// 图层切换开关
function changeLayer(e) {
  let layer = gbzRef.value.wmsLayer;
  if (!layer) return;
  if (e) {
    layer.show();
  } else {
    layer.hide();
  }
}
// 倾斜摄影开关
function changeOsbg(e) {
  let layer = geo3dRef.value.geo3DTilesLayer;
  if (!layer) return;
  if (e) {
    layer.show();
  } else {
    layer.hide();
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
  height: calc(100vh - 0px);
  overflow: hidden;
  .map-operation-area {
    position: absolute;
    top: 38px;
    right: 10px;
    width: 320px;
    max-width: 640px;
    z-index: 999;
  }
}
</style>
