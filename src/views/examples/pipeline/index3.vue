<template>
  <div id="trajectoryBaseId" v-loading="loading" class="map-content">
    <!-- 地图部分 -->
    <div class="map-div">
      <mt-init-map :options="options" @getMap="getMap">
        <mt-group-gl-layer>
          <mt-tianditu-layer
            tk="ec89e7ba91633b147f76d47e08f9f1a1"
            layerType="img"
            :zIndex="1"
          />
          <mt-geojson-vector-tile-layer
            ref="geoRef"
            :layerStyle="layerStyle"
            :layerData="layerData"
          />
        </mt-group-gl-layer>
      </mt-init-map>
    </div>
  </div>
</template>
<script setup>
import { ref, onBeforeMount, nextTick } from "vue";
import { getPipelineData } from "@/api/geojson";

const loading = ref(true);

let map = null;

// 地图map配置
let options = {
  center: [120.25309501242282, 30.231192256436856], // 苏州
  zoom: 17.5,
  spatialReference: {
    projection: "EPSG:4326"
  },
  minZoom: 1,
  maxZoom: 20,
  bearing: -15.299999999999274,
  pitch: 72.0000000000002
};

let layerData = ref(null);
let snow = new URL("@public/gltf/ylk/ylk.gltf", import.meta.url);
let layerStyle = {
  style: [
    {
      filter: true,
      renderPlugin: {
        type: "gltf-lit",
        dataConfig: {
          type: "native-point"
        },
        sceneConfig: {
          gltfAnimation: {
            enable: true
          }
        }
      },
      symbol: {
        markerFill: "#0f0",
        markerRotationAlignment: "line",
        url: snow,
        markerPlacement: "vertex-last",
        rotationZ: 90,
        anchorZ: "middle",
        translationX: -120,
        scaleX: 6,
        scaleY: 6,
        scaleZ: 6
      }
    },
    {
      filter: true,
      renderPlugin: {
        dataConfig: {
          type: "round-tube",
          radialSegments: 16,
          metric: "cm"
        },
        sceneConfig: {},
        type: "tube"
      },
      symbol: {
        lineColor: [1, 1, 1, 1],
        lineWidth: {
          type: "identity",
          property: "断面尺寸"
        },
        lineHeight: 60,
        uvScale: [1, 1],
        metallicFactor: 1,
        roughnessFactor: 0.3
      }
    }
  ]
};

function getMap(e) {
  map = e;
  if (map.isLoaded()) {
    loading.value = false;
  }
}

onBeforeMount(() => {
  nextTick(() => {
    queryPipelineData();
  });
});

// 查询管线数据
async function queryPipelineData() {
  try {
    // 这里开始模拟查询后台获取geosjon数据当然也可以从本页面import中获取
    const { data } = await getPipelineData();
    // 将查询到的geojson数据赋值给全局属性
    layerData.value = data;
  } catch (e) {
    console.log(e);
  } finally {
    setTimeout(() => {
      loading.value = false;
    }, 1000);
  }
}
</script>

<style lang="scss" scoped>
.main-content {
  margin: 2px 0 0 !important;
}

.map-content {
  width: 100%;
  height: calc(100vh - 0px);
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: flex-start;

  .map-div {
    height: 100%;
    width: 100%;
  }
}
</style>
