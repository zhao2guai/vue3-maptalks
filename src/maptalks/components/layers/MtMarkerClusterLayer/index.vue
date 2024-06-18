<template>
  <div>
    <slot />
  </div>
</template>

<script>
import {
  defineComponent,
  inject,
  provide,
  onBeforeUnmount,
  onBeforeMount,
  watch
} from "vue";
import MarkerClusterLayerModel from "./MakerClusterLayerModel";
import { ui } from "maptalks";

export default defineComponent({
  // 初始化点聚合图层
  name: "mt-maker-cluster-layer",

  props: {
    // 点聚合数据geojson
    geoJsonData: {
      type: Object,
      default: () => ({
        type: "FeatureCollection",
        features: []
      })
    },
    // marker点的样式
    options: {
      type: Object,
      default: () => ({})
    },
    // 第一个分界点数据
    sizeOne: {
      type: Number,
      default: 100
    },
    // 第二个分界点数据
    sizeTwo: {
      type: Number,
      default: 1000
    }
  },

  setup(props, context) {
    let marker;
    const createIcon = feature => {
      const cluster = feature.properties.cluster;
      const coordinate = feature.geometry.coordinates;
      if (!cluster) {
        marker = new ui.UIMarker(coordinate, props.options);
      } else {
        const count = feature.properties.point_count;
        const id = feature.id;
        const index = markerClusterLayer.getIndex();
        const features = index.getLeaves(id, 10);
        const size =
          count < props.sizeOne
            ? "small"
            : count < props.sizeTwo
              ? "medium"
              : "large";
        marker = new ui.UIMarker(coordinate, {
          content: `<div class="marker-cluster marker-cluster-${size}">${count}</div>`
        });
      }
      // 图层创建后的回调
      marker.on("click", markerClick);
      return marker;
    };

    const markerClick = e => {
      if (e.target.feature.properties.cluster) {
        // console.log("我是一个聚合点");
      } else {
        context.emit("getMarkData", e.target.feature.properties);
      }
    };

    let markerClusterLayer = new MarkerClusterLayerModel({ createIcon });
    // 向组件传送初始化完毕的layer
    context.emit("layerCreated", markerClusterLayer);
    // 向外部提供markerClusterLayer对象
    provide("markerClusterLayer", markerClusterLayer);
    // 点聚合数据geojson
    watch(
      () => props.geoJsonData,
      newGeoJsonData => {
        if (markerClusterLayer && newGeoJsonData) {
          markerClusterLayer.setData(newGeoJsonData);
        }
      },
      { deep: true, immediate: true }
    );

    // 点聚合数据geojson
    watch(
      () => props.options,
      newOptions => {
        if (marker && newOptions) {
          marker.setOptions(newOptions);
        }
      },
      { deep: true, immediate: true }
    );

    // 将点添加到地图上
    const addUIMarker = () => {
      // 获取上级组件中的地图对象
      let maptalks = inject("maptalks", null);
      let map = maptalks.value;
      // 若不存在任何图层组则判断地图对象是否加载并添加至map的layers数组中
      if (map && map.isLoaded()) {
        markerClusterLayer.addTo(map);
        let geoJsonData = props.geoJsonData
          ? props.geoJsonData
          : {
              type: "FeatureCollection",
              features: []
            };
        markerClusterLayer.setData(geoJsonData);
        return;
      }
    };

    // 页面加载后执行
    onBeforeMount(() => {
      addUIMarker();
    });

    // 页面元素销毁之前执行
    onBeforeUnmount(() => {
      removeAll();
    });

    // 移除地图gltf三维模型绘制图层
    const removeAll = () => {
      if (markerClusterLayer) {
        markerClusterLayer.clear();
        markerClusterLayer.remove();
        markerClusterLayer = undefined;
      }
    };

    return {
      createIcon
    };
  }
});
</script>

<style lang="scss">
.marker-cluster-small {
  background-color: rgba(181, 226, 140, 1);
}

.marker-cluster-small div {
  background-color: rgba(110, 204, 57, 1);
}

.marker-cluster-medium {
  background-color: rgba(241, 211, 87, 1);
  animation: highlightpoint 2s infinite;
}

.marker-cluster-medium div {
  background-color: rgba(240, 194, 12, 1);
}

.marker-cluster-large {
  background-color: rgba(253, 156, 115, 1);
}

.marker-cluster-large div {
  background-color: rgba(241, 128, 23, 1);
}

.marker-cluster {
  background-clip: padding-box;
  border-radius: 20px;
}

.marker-cluster div {
  width: 30px;
  height: 30px;
  margin-left: 5px;
  margin-top: 5px;

  text-align: center;
  border-radius: 15px;
  font:
    12px "Helvetica Neue",
    Arial,
    Helvetica,
    sans-serif;
}

.marker-cluster span {
  line-height: 30px;
}

.marker-cluster {
  width: 40px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 12px;
  cursor: pointer;
}

@keyframes highlightpoint {
  0% {
    transform: scale(1);
    opacity: 0.9;
  }

  100% {
    transform: scale(1.5);
    opacity: 0.1;
  }
}
</style>
