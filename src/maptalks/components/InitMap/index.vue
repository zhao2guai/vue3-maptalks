<template>
  <div class="map-content">
    <!-- 地图加载区域 -->
    <div :id="container" class="maptalks-content" />
    <!-- 地图子组件插槽区域 -->
    <slot v-if="mapload" />
  </div>
</template>
<script>
import {
  ref,
  nextTick,
  onBeforeUnmount,
  onBeforeMount,
  watch,
  defineComponent
} from "vue";
import { Map, TileLayer, GroupTileLayer } from "maptalks";
import "@maptalks/transcoders.draco";
import "@maptalks/transcoders.crn";
import "@maptalks/transcoders.ktx2";
import { tiandituApi } from "../../config/tianditu.js";
export default defineComponent({
  /** 初始化地图组件 */
  name: "mt-tianditu-map",
  props: {
    // 天地图用的tk
    tk: {
      type: String,
      default: ""
    },

    // 绑定地图dom的id
    container: {
      type: String,
      default: "mapId"
    },

    // baseId-底图id
    baseId: {
      type: String,
      default: "baseId"
    },

    // 地图配置
    options: {
      type: Object,
      default: () => ({
        center: [103.82591437579072, 36.05400583727757], // 兰州坐标
        zoom: 10,
        spatialReference: {
          projection: "EPSG:4326"
        },
        minZoom: 1,
        maxZoom: 18,
        bearing: 0,
        pitch: 0,
        // 是否显示中心十字
        centerCross: false,
        // 是否使用无缝缩放模式
        seamlessZoom: true,
        // 是否启用地图缩放
        zoomable: true,
        // 是否禁用贴图拖动
        draggable: true,
        // 默认底图
        defaultBaseLayer: "img"
      })
    }
  },

  setup(props, context) {
    // 获取本项目坐标系
    const projection = props.options.spatialReference.projection;
    // 地图对象
    let map = null;
    // 地图加载状态
    let mapload = ref(false);

    // 监听地图配置
    watch(
      () => props.options,
      (newOptions, oldOptions) => {
        if (map && map.isLoaded()) {
          map.setOptions(newOptions);
        }
      },
      { deep: true }
    );

    // 页面加载后执行
    onBeforeMount(() => {
      nextTick(() => {
        if (props.tk) {
          initMap();
        } else {
          console.warn("当前地图没有tk, 无法初始化地图!");
        }
        console.info("当前地图绑定的HTMLElement容器的ID:" + props.container);
        console.info("当前地图加载的baseLayer图层的ID:" + props.baseId);
      });
    });

    // 页面元素销毁之前执行
    onBeforeUnmount(() => {
      removeAll();
    });

    // 初始化地图容器
    const initMap = () => {
      // 加载地图配置参数
      map = new Map(props.container, props.options);
      // 获取坐标系
      const proj = map.getProjection().code;
      // 设置地图范围
      map.setSpatialReference({
        projection: proj ? proj : "EPSG:4326",
        resolutions: getResolutions(props.options.maxZoom)
      });
      // 默认添加影像底图
      changeBaseMap(map.config().defaultBaseLayer);
      // 获取地图初始化状态来更新插槽状态
      if (map.isLoaded()) {
        mapload.value = true;
        // 向父组件方法传送初始化完毕的map
        context.emit("update:maptalks", map);
      }
    };

    // 根据URL添加底图
    const changeBaseMap = type => {
      removeBaseLayer();
      let proj = projection;
      // 创建底图图层组
      let baseGroup = null;
      // 矢量底图
      if (type === "vec") {
        baseGroup = new GroupTileLayer("baseId", [
          // 矢量底图瓦片
          new TileLayer(
            "vecId",
            tiandituApi.getTdtTileLayer("vec_c", props.tk, proj)
          ),
          // 矢量注记
          new TileLayer(
            "cvaId",
            tiandituApi.getTdtTileLayer("cva_c", props.tk, proj)
          ),
          // 全球境界-经纬度投影
          new TileLayer(
            "iboId",
            tiandituApi.getTdtTileLayer("ibo_c", props.tk, proj)
          )
        ]);
      }
      // 地形底图
      else if (type === "ter") {
        baseGroup = new GroupTileLayer("baseId", [
          // 地形晕渲-经纬度投影
          new TileLayer(
            "terId",
            tiandituApi.getTdtTileLayer("ter_c", props.tk, proj)
          ),
          // 地形注记-经纬度投影
          new TileLayer(
            "ctaId",
            tiandituApi.getTdtTileLayer("cta_c", props.tk, proj)
          ),
          // 全球境界-经纬度投影
          new TileLayer(
            "iboId",
            tiandituApi.getTdtTileLayer("ibo_c", props.tk, proj)
          )
        ]);
      }
      // 影像底图
      else {
        baseGroup = new GroupTileLayer("baseId", [
          // 影像底图-经纬度投影
          new TileLayer(
            "imgId",
            tiandituApi.getTdtTileLayer("img_c", props.tk, proj)
          ),
          // 影像注记-经纬度投影
          new TileLayer(
            "ciaId",
            tiandituApi.getTdtTileLayer("cia_c", props.tk, proj)
          ),
          // 全球境界-经纬度投影
          new TileLayer(
            "iboId",
            tiandituApi.getTdtTileLayer("ibo_c", props.tk, proj)
          )
        ]);
      }
      // 最后将图层组添加到map专用底图图层中
      map.setBaseLayer(baseGroup);
    };

    // 移除底图图层
    const removeBaseLayer = () => {
      if (map && map.isLoaded()) {
        map.removeBaseLayer();
      }
    };

    // 获取地图范围
    const getResolutions = num => {
      const resolutions = [];
      let zoom = num > 0 ? num : 19;
      for (let i = 0; i < zoom; i++) {
        resolutions[i] = 180 / (Math.pow(2, i) * 128);
      }
      return resolutions;
    };

    // 移除地图所有图层销毁地图组件
    const removeAll = () => {
      // 删除图层和地图对象
      if (map) {
        map.removeBaseLayer();
        map.remove();
        // 修改地图加载状态清除子组件
        if (map.isRemoved()) mapload.value = false;
        map = undefined;
      }
    };

    return {
      map,
      mapload,
      changeBaseMap,
      removeAll
    };
  }
});
</script>
<style lang="scss" scoped>
.map-content {
  position: absolute;
  z-index: 0;
  width: 100%;
  height: 100%;
}

.maptalks-content {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
