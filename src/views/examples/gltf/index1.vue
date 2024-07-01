<template>
  <div id="gltf2" v-loading="loading" class="map-content">
    <mt-init-map :options="mapOptions" @getMap="getMap">
      <mt-group-gl-layer :sceneConfig="defaultSceneConfig">
        <mt-gltf-layer>
          <mt-gltf-maker
            v-for="(item, index) in makerList"
            :id="item.id"
            :key="index"
            :ref="el => setPointRef(el, index)"
            :coordinates="item.coordinates"
            :options="item.options"
            :content="item.content"
            @click="changeMaker(item, index)"
          />
        </mt-gltf-layer>
      </mt-group-gl-layer>
    </mt-init-map>
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const loading = ref(true);

let map = null;

// 设置默认地图配置
let mapOptions = {
  center: [81.868822, 44.940405], // 博乐市小营盘镇
  zoom: 16,
  spatialReference: {
    projection: "EPSG:4326"
  },
  minZoom: 10,
  maxZoom: 20,
  bearing: -20,
  pitch: 75
};
// 设置默认场景配置信息
let defaultSceneConfig = {
  environment: {
    enable: true,
    mode: 1,
    level: 0,
    brightness: 0
  },
  shadow: {
    type: "esm",
    enable: true,
    quality: "high",
    opacity: 0.11,
    color: [0, 0, 0],
    blurOffset: 1
  },
  ground: {
    enable: true,
    renderPlugin: {
      type: "fill"
    },
    symbol: {
      polygonFill: [0.517647, 0.517647, 0.517647, 1]
    }
  },
  postProcess: {
    enable: false,
    antialias: {
      enable: true,
      taa: true,
      jitterRatio: 0.25
    },
    ssr: {
      enable: true
    },
    bloom: {
      enable: true,
      threshold: 0,
      factor: 0.2,
      radius: 0.105
    },
    ssao: {
      enable: true,
      bias: 0.08,
      radius: 0.08,
      intensity: 1.5
    },
    sharpen: {
      enable: false,
      factor: 0.2
    }
  }
};
// 模型数组
let makerList = [
  {
    name: "厂房",
    coordinates: [81.868822, 44.945405],
    options: {
      id: 10,
      cursor: "pointer",
      symbol: {
        url: new URL("@public/gltf/farm/scene.gltf", import.meta.url), //模型的url
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
        modelHeight: 300,
        translationZ: 125,
        rotationZ: 180
      }
    },
    content:
      '<div class="infocontent" ref="infoWindowRef">' +
      '<div class="infopop_title">2号种植大棚</div>' +
      '<div class="infopop_title">大棚编号: A103JHR89Y20</div>' +
      '<div class="infopop_title">大棚占地（亩）: 10</div>' +
      '<div class="infopop_title">种植作物: 辣椒</div>' +
      '<div class="infopop_title">作物苗量（株）: 2000</div>' +
      '<div class="infopop_dept">=> 点击进入 <=' +
      "</div>"
  },
  {
    name: "摄像头监测设备",
    coordinates: [81.863822, 44.940405],
    options: {
      id: 11,
      cursor: "pointer",
      symbol: {
        url: new URL("@public/gltf/equipment/01.gltf", import.meta.url), //模型的url
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
      }
    },
    content:
      '<div class="infocontent" ref="infoWindowRef">' +
      '<div class="infopop_title">这是一个虫情设备</div>' +
      '<div class="infopop_time">当前时间: ' +
      new Date().toLocaleTimeString() +
      "</div><br>" +
      '<div class="infopop_dept">' +
      "</div>"
  },
  {
    name: "气象监测设备",
    coordinates: [81.873822, 44.940405],
    options: {
      id: 12,
      cursor: "pointer",
      symbol: {
        url: new URL("@public/gltf/equipment/02.gltf", import.meta.url), //模型的url
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
      }
    },
    content:
      '<div class="infocontent" ref="infoWindowRef">' +
      '<div class="infopop_title">这是一个虫情设备</div>' +
      '<div class="infopop_time">当前时间: ' +
      new Date().toLocaleTimeString() +
      "</div><br>" +
      '<div class="infopop_dept">' +
      "</div>"
  },
  {
    name: "虫情设备",
    coordinates: [81.863822, 44.950405],
    options: {
      id: 13,
      cursor: "pointer",
      symbol: {
        url: new URL("@public/gltf/equipment/02.gltf", import.meta.url), //模型的url
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
      }
    },
    content:
      '<div class="infocontent" ref="infoWindowRef">' +
      '<div class="infopop_title">这是一个虫情设备</div>' +
      '<div class="infopop_time">当前时间: ' +
      new Date().toLocaleTimeString() +
      "</div><br>" +
      '<div class="infopop_dept">' +
      "</div>"
  },
  {
    name: "水肥一体机",
    coordinates: [81.873822, 44.950405],
    options: {
      id: 14,
      symbol: {
        url: new URL("@public/gltf/equipment/04.gltf", import.meta.url), //模型的url
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
      }
    },
    content:
      '<div class="infocontent" ref="infoWindowRef">' +
      '<div class="infopop_title">这是一个虫情设备</div>' +
      '<div class="infopop_time">当前时间: ' +
      new Date().toLocaleTimeString() +
      "</div><br>" +
      '<div class="infopop_dept">' +
      "</div>"
  }
];
// 摄像头监测设备
let symbol1 = {
  url: new URL("@public/gltf/equipment/01.gltf", import.meta.url), //模型的url
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
// 气象监测设备
let symbol2 = {
  url: new URL("@public/gltf/equipment/02.gltf", import.meta.url), //模型的url
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
  url: new URL("@public/gltf/equipment/03.gltf", import.meta.url), //模型的url
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
  url: new URL("@public/gltf/equipment/04.gltf", import.meta.url), //模型的url
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
// 厂房
let symbol3 = {
  url: new URL("@public/gltf/farm/scene.gltf", import.meta.url), //模型的url
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
  modelHeight: 300,
  translationZ: 125,
  rotationZ: 180
};
// 自定义弹窗内容
let infoWindowOptions = {
  custom: true,
  content:
    '<div class="infocontent" ref="infoWindowRef">' +
    '<div class="infopop_title">这是一个虫情设备</div>' +
    '<div class="infopop_time">当前时间: ' +
    new Date().toLocaleTimeString() +
    "</div><br>" +
    '<div class="infopop_dept">' +
    "</div>"
};
// 获取组件返回的地图对象
function getMap(e) {
  map = e;
  loading.value = false;
}

// 定义ref存储数组
let swipeCellRefList = ref([]);
// 动态设置ref
function setPointRef(el, index) {
  if (el) {
    swipeCellRefList.value[index] = el;
  }
}
// 添加点击弹窗事件
function changeMaker(item, index) {
  const gltfMarker = swipeCellRefList.value[index].gltfMarker;
  const infoWindow = gltfMarker.getInfoWindow();
  // id为10就是大棚房子
  if (item.id === 10) {
    infoWindow.setContent(
      '<div class="infocontent" ref="infoWindowRef">' +
        '<div class="infopop_title">2号种植大棚</div>' +
        '<div class="infopop_title">大棚编号: A103JHR89Y20</div>' +
        '<div class="infopop_title">大棚占地（亩）: 10</div>' +
        '<div class="infopop_title">种植作物: 辣椒</div>' +
        '<div class="infopop_title">作物苗量（株）: 2000</div>' +
        '<div class="infopop_dept">=> 点击进入 <=' +
        "</div>"
    );
  } else {
    infoWindow.setContent(infoWindowOptions.content);
  }
}
onMounted(() => {});

onBeforeUnmount(() => {
  map = undefined;
  swipeCellRefList.value = undefined;
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
}
</style>

<style lang="scss">
#gltf2 {
  .infocontent {
    color: #fff;
    width: 20vw;
    height: 28vh;
    background-color: #051127;
    border: 1px solid #0c2c45;
  }
  .infopop_title {
    float: left;
    padding-left: 10px;
    width: 100%;
    height: 36px;
    line-height: 36px;
    background: url(title.png);
    font-weight: bold;
    font-size: 16px;
  }
  .infopop_time {
    width: 100%;
    height: 30px;
    margin: 0 10px;
    line-height: 36px;
  }
  .infopop_dept {
    padding: 5px;
    line-height: 15px;
    text-align: center;
    border: 1px solid #192b41;
    margin: 0 10px;
    position: absolute;
    bottom: 2vh;
    text-align: center;
  }
  .infopop_arrow {
    float: left;
    width: 15px;
    height: 24px;
    line-height: 24px;
    background: url(arrow.png) no-repeat center center;
  }
}
</style>
