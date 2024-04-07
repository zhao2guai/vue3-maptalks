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
import { Map, TileLayer } from "maptalks";
import { GroupGLLayer } from "@maptalks/gl-layers";
import "@maptalks/transcoders.draco";
import "@maptalks/transcoders.crn";
import "@maptalks/transcoders.ktx2";
import { tiandituApi } from "../../config/tianditu.js";
export default defineComponent({
  /** 初始化地图组件 */
  name: "mt-gl-map",
  props: {
    // 天地图用的Key
    tk: {
      type: String,
      default: ""
    },

    // 绑定地图dom的id
    container: {
      type: String,
      default: "mapId"
    },

    // GL图层id
    groupId: {
      type: String,
      default: "group"
    },

    // 地图配置
    options: {
      type: Object,
      default: () => ({
        center: [103.831741, 36.061685], // 甘肃省兰州市
        zoom: 14,
        spatialReference: {
          projection: "EPSG:4326"
        },
        minZoom: 1,
        maxZoom: 18,
        bearing: -15,
        pitch: 45,
        // 是否显示中心十字
        centerCross: false,
        // 是否使用无缝缩放模式
        seamlessZoom: true,
        // 是否启用地图缩放
        zoomable: true,
        // 是否禁用贴图拖动
        draggable: true,
        // 地形开关
        terrainSwitch: false,
        // 晴天开关
        sunnySwitch: false,
        // 默认底图
        defaultBaseLayer: "img"
      })
    },

    // 光照配置
    lights: {
      type: Object,
      default: () => ({
        directional: {
          direction: [0.5, 0, -1],
          color: [1, 1, 1]
        },
        ambient: {
          resource: {
            url: {
              front: new URL(
                "@/maptalks/assets/imgs/weather/446/front.jpg",
                import.meta.url
              ),
              back: new URL(
                "@/maptalks/assets/imgs/weather/446/back.jpg",
                import.meta.url
              ),
              left: new URL(
                "@/maptalks/assets/imgs/weather/446/left.jpg",
                import.meta.url
              ),
              right: new URL(
                "@/maptalks/assets/imgs/weather/446/right.jpg",
                import.meta.url
              ),
              top: new URL(
                "@/maptalks/assets/imgs/weather/446/top.jpg",
                import.meta.url
              ),
              bottom: new URL(
                "@/maptalks/assets/imgs/weather/446/bottom.jpg",
                import.meta.url
              )
            },
            prefilterCubeSize: 1024
          },
          exposure: 0.787,
          hsv: [0, 0, 0],
          orientation: 0
        }
      })
    },

    // 场景配置
    sceneConfig: {
      type: Object,
      default: () => ({
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
          enable: false, // 关闭地面配置
          renderPlugin: {
            type: "fill"
          },
          symbol: {
            polygonFill: [
              0.803921568627451, 0.803921568627451, 0.803921568627451, 1
            ],
            polygonOpacity: 1
          }
        }
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
      { deep: true, immediate: true }
    );
    // 监听地图光照配置
    watch(
      () => props.lights,
      (newLights, oldLights) => {
        if (newLights) {
          map.setLights(newLights);
        }
      },
      { deep: true }
    );
    // 监听GL场景配置
    watch(
      () => props.sceneConfig,
      (newSceneConfig, oldSceneConfig) => {
        let groupLayer = map.getLayer(props.groupId);
        if (groupLayer) {
          groupLayer.setSceneConfig(newSceneConfig);
        }
      },
      { deep: true }
    );

    // 页面加载后执行
    onBeforeMount(() => {
      nextTick(() => {
        if (props.container && props.tk && props.groupId) {
          initMap();
        } else {
          console.warn("当前地图没有天地图的key,无法初始化地图!");
        }
        console.info("当前地图绑定的HTMLElement容器的ID:" + props.container);
        console.info("当前地图加载的GroupGLLayer图层的ID:" + props.groupId);
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
      // 设置光照
      map.setLights(props.lights);
      // 获取坐标系
      const proj = props.options.spatialReference.projection;
      // 设置地图范围
      map.setSpatialReference({
        projection: proj ? proj : "EPSG:4326",
        resolutions: getResolutions(props.options.maxZoom)
      });
      // 添加GL图层组
      addGLLayer();
      // 默认添加影像底图
      changeBaseMap(map.config().defaultBaseLayer);
      // 获取地图初始化状态来更新插槽状态
      if (map.isLoaded()) {
        mapload.value = true;
        // 向父组件方法传送初始化完毕的map
        context.emit("update:maptalks", map);
      }
    };

    // 添加GL图层组
    const addGLLayer = () => {
      let groupLayer = null;
      if (map.config().terrainSwitch) {
        // 设置天地图3D地形
        const terrain = tiandituApi.getTerrain(props.tk);
        groupLayer = new GroupGLLayer(props.groupId, [], { terrain });
      } else {
        // 添加图层组
        groupLayer = new GroupGLLayer(props.groupId, [], {});
      }
      // 设置晴天场景
      if (props.sceneConfig) {
        groupLayer.setSceneConfig(props.sceneConfig);
      }
      groupLayer.addTo(map);
      // 将GL图层组ID存储在map对象中
      map.config("groupId", props.groupId);
    };

    // 切换地形开关
    const changeTerrain = status => {
      let groupGLLayer = map.getLayer(props.groupId);
      if (!groupGLLayer) return;
      if (status) {
        // 设置天地图3D地形
        const terrain = tiandituApi.getTerrain(props.tk);
        groupGLLayer.setTerrain(terrain);
      } else {
        groupGLLayer.setTerrain(null);
      }
    };

    // 添加天地图
    const changeBaseMap = type => {
      // 清除天地图
      clearTiandituLayer();
      // 获取坐标系
      if (projection !== "EPSG:4326") return;
      let proj = projection;
      // 获取GL图层对象
      let groupGLLayer = map.getLayer(props.groupId);
      // 创建底图图层组
      let baseGroup = null;
      // 矢量底图
      if (type === "vec") {
        // 矢量底图瓦片
        groupGLLayer.addLayer(
          new TileLayer(
            "baseId",
            tiandituApi.getTdtTileLayer("vec_c", props.tk, proj)
          )
        );
        // 矢量注记
        groupGLLayer.addLayer(
          new TileLayer(
            "noteId",
            tiandituApi.getTdtTileLayer("cva_c", props.tk, proj)
          )
        );
        // 全球境界-经纬度投影
        groupGLLayer.addLayer(
          new TileLayer(
            "iboId",
            tiandituApi.getTdtTileLayer("ibo_c", props.tk, proj)
          )
        );
      }
      // 地形底图
      else if (type === "ter") {
        // 地形晕渲-经纬度投影
        groupGLLayer.addLayer(
          new TileLayer(
            "baseId",
            tiandituApi.getTdtTileLayer("ter_c", props.tk, proj)
          )
        );
        // 地形注记-经纬度投影
        groupGLLayer.addLayer(
          new TileLayer(
            "noteId",
            tiandituApi.getTdtTileLayer("cta_c", props.tk, proj)
          )
        );
        // 全球境界-经纬度投影
        groupGLLayer.addLayer(
          new TileLayer(
            "iboId",
            tiandituApi.getTdtTileLayer("ibo_c", props.tk, proj)
          )
        );
      }
      // 影像底图
      else {
        // 影像底图-经纬度投影
        groupGLLayer.addLayer(
          new TileLayer(
            "baseId",
            tiandituApi.getTdtTileLayer("img_c", props.tk, proj)
          )
        );
        // 影像注记-经纬度投影
        groupGLLayer.addLayer(
          new TileLayer(
            "noteId",
            tiandituApi.getTdtTileLayer("cia_c", props.tk, proj)
          )
        );
        // 全球境界-经纬度投影
        groupGLLayer.addLayer(
          new TileLayer(
            "iboId",
            tiandituApi.getTdtTileLayer("ibo_c", props.tk, proj)
          )
        );
      }
    };

    // 清除底图
    const clearTiandituLayer = () => {
      let groupGLLayer = map.getLayer(props.groupId);
      if (groupGLLayer) {
        groupGLLayer.removeLayer(groupGLLayer.getLayer("baseId"));
        groupGLLayer.removeLayer(groupGLLayer.getLayer("noteId"));
        groupGLLayer.removeLayer(groupGLLayer.getLayer("iboId"));
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
        map.removeLayer(map.getLayer(props.groupId));
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
      changeTerrain
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
