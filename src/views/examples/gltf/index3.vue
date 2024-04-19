<template>
  <div id="gltf3" v-loading="loading" class="map-content">
    <mt-init-map @getMap="getMap" :options="options">
      <mt-group-gl-layer :sceneConfig="defaultSceneConfig">
        <mt-gltf-layer>
          <mt-gltf-maker
            ref="symbol3"
            :point="[81.863822, 44.940405]"
            :symbol="barn"
          />
          <mt-gltf-maker
            ref="farm"
            :point="[81.882822, 44.940405]"
            :symbol="farm"
          />
          <mt-gltf-maker
            ref="cowRef1"
            :point="[81.857522, 44.944405]"
            :symbol="cow1"
            :infoWindowOptions="cowOptions"
            @load="cowLoad"
          />
          <mt-gltf-maker
            ref="cowRef2"
            :point="[81.857522, 44.936805]"
            :symbol="cow2"
            :infoWindowOptions="cowOptions"
            @load="cowLoad"
          />
          <mt-gltf-maker :point="[81.870522, 44.944405]" :symbol="pig1" />
          <mt-gltf-maker :point="[81.869922, 44.936805]" :symbol="pig2" />
          <mt-gltf-maker
            ref="sheepRef1"
            :point="[81.881422, 44.940405]"
            :symbol="sheep1"
            @click="handlerClick()"
          />
          <mt-gltf-maker
            ref="sheepRef2"
            :point="[81.884222, 44.944405]"
            :symbol="sheep2"
            @click="handlerClick()"
          />
          <mt-gltf-maker
            ref="sheepRef3"
            :point="[81.884222, 44.940405]"
            :symbol="sheep3"
            @click="handlerClick()"
          />
          <mt-gltf-maker
            ref="jiRef"
            :point="[81.876222, 44.935405]"
            :symbol="chicken"
          />
        </mt-gltf-layer>
      </mt-group-gl-layer>
    </mt-init-map>
  </div>
</template>
<script setup>
import { title } from "process";
import { ref, onMounted, onBeforeUnmount, reactive } from "vue";

const loading = ref(true);

let map = null;
const cowRef1 = ref(null);
const cowRef2 = ref(null);

// 设置默认地图配置
let options = {
  center: [81.868822, 44.940405], // 博乐市小营盘镇
  zoom: 14,
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
// 大角牛
let cow1 = {
  url: new URL(
    "@/maptalks/assets/gltf/texas_longhorn/scene.gltf",
    import.meta.url
  ), //模型的url
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
  modelHeight: 320,
  translationZ: -100,
  rotationZ: 90
};
let cow2 = {
  url: new URL(
    "@/maptalks/assets/gltf/texas_longhorn/scene.gltf",
    import.meta.url
  ), //模型的url
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
  modelHeight: 320,
  translationZ: -100,
  rotationZ: 90
};
// 黑猪
let pig1 = {
  url: new URL("@/maptalks/assets/gltf/black_pig/scene.gltf", import.meta.url), //模型的url
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
  modelHeight: 280,
  translationZ: -160,
  rotationZ: 180
};
// 白猪
let pig2 = {
  url: new URL("@/maptalks/assets/gltf/animal/pig.gltf", import.meta.url), //模型的url
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
  modelHeight: 280,
  translationZ: -160,
  rotationZ: 45
};
// 牛围栏
let barn = {
  url: new URL(
    "@/maptalks/assets/gltf/farm_cow_barn/scene.gltf",
    import.meta.url
  ), //模型的url
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
  modelHeight: 1384,
  rotationX: 90,
  translationZ: -420
};
// 棚子
let farm = {
  url: new URL(
    "@/maptalks/assets/gltf/farm_pigsty/scene.gltf",
    import.meta.url
  ), //模型的url
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
// 鸡
let chicken = {
  url: new URL(
    "@/maptalks/assets/gltf/chicken_rig/scene.gltf",
    import.meta.url
  ), //模型的url
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
  modelHeight: 120,
  translationZ: -60,
  rotationZ: 45
};

let sheep1 = {
  url: new URL(
    "@/maptalks/assets/gltf/sheep-test_non-commercial/scene.gltf",
    import.meta.url
  ), //模型的url
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
  modelHeight: 70,
  rotationZ: 90
};

let sheep2 = {
  url: new URL(
    "@/maptalks/assets/gltf/sheep-test_non-commercial/scene.gltf",
    import.meta.url
  ), //模型的url
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
  modelHeight: 70,
  rotationZ: 240
};

let sheep3 = {
  url: new URL(
    "@/maptalks/assets/gltf/sheep-test_non-commercial/scene.gltf",
    import.meta.url
  ), //模型的url
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
  modelHeight: 70,
  rotationZ: 30
};

function getMap(e) {
  map = e;
  loading.value = false;
}

let cowOptions = {
  custom: true,
  content:
    '<div class="infocontent" ref="infoWindowRef">' +
    '<div class="infopop_title">牛只信息</div>' +
    '<div class="infopop_title">耳标号: A103JHR89Y20</div>' +
    '<div class="infopop_title">牛只品种: 平凉红牛</div>' +
    '<div class="infopop_title">生长阶段: 青年牛</div>' +
    '<div class="infopop_title">上次饲喂: 48小时以前</div>' +
    '<div class="infopop_title">健康状况: 良好</div>' +
    '<div class="infopop_title">当前状态: 正常</div>' +
    "</div>"
};

// 模型加载完成后执行
function cowLoad() {
  const options = {
    items: [
      {
        item: "发起转群任务",
        click: () => {}
      },
      "-",
      {
        item: "发起饲喂任务",
        click: () => {}
      }
    ]
  };
  // 为该模型添加右键菜单
  cowRef1.value.gltfMarker.setMenu(options);
  // 为该模型添加右键菜单
  cowRef2.value.gltfMarker.setMenu(options);
}

// 点击事件
function handlerClick(e) {
  alert("这是一只小绵羊！");
}

onMounted(() => {});

onBeforeUnmount(() => {
  map = undefined;
});
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
}
</style>

<style lang="scss">
#gltf3 {
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
  }
}
</style>
