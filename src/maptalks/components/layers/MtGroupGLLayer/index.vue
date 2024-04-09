<template>
  <div><slot /></div>
</template>
<script>
import {
  ref,
  provide,
  inject,
  onBeforeUnmount,
  onBeforeMount,
  watch,
  defineComponent
} from "vue";
import { GroupGLLayer } from "@maptalks/gl-layers";
import "@maptalks/transcoders.draco";
import "@maptalks/transcoders.crn";
import "@maptalks/transcoders.ktx2";
import { tiandituApi } from "@/maptalks/config/tianditu.js";
export default defineComponent({
  /** 初始化webgl图层组件 */
  name: "mt-group-gl-layer",
  props: {
    map: {
      type: Object,
      default: undefined
    },
    // GL图层id
    groupId: {
      type: String,
      default: "group"
    },
    // 地形开关
    terrainSwitch: {
      type: Boolean,
      default: false
    },
    // 天地图密匙
    tk: {
      type: String,
      default: undefined
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
    // 获取上级组件中的地图对象
    let maptalks = inject("maptalks", null);
    let map = maptalks.value;
    // 定义GL图层组对象
    let groupGLLayer = null;
    // 监听GL场景配置
    watch(
      () => props.sceneConfig,
      (newSceneConfig, oldSceneConfig) => {
        let groupGLLayer = map.getLayer(props.groupId);
        if (groupGLLayer) {
          groupGLLayer.setSceneConfig(newSceneConfig);
        }
      },
      { deep: true }
    );

    // 页面加载后执行
    onBeforeMount(() => {
      if (props.groupId) {
        addGLLayer();
      } else {
        console.error("当前webgl图层组id为空, 无法添加图层!");
      }
    });

    // 页面元素销毁之前执行
    onBeforeUnmount(() => {
      removeAll();
    });

    // 添加GL图层组
    const addGLLayer = () => {
      // 首先检测地图中是否已经存在GL图层
      if (map.config().groupId) return;
      // 判断地形开关是否开启，天地图密匙是否存在
      if (props.terrainSwitch === true && props.tk) {
        // 设置天地图3D地形
        const terrain = tiandituApi.getTerrain(props.tk);
        groupGLLayer = new GroupGLLayer(props.groupId, [], { terrain });
      } else {
        // 添加图层组
        groupGLLayer = new GroupGLLayer(props.groupId, [], {});
      }
      // 设置场景配置
      if (props.sceneConfig) {
        groupGLLayer.setSceneConfig(props.sceneConfig);
      }
      groupGLLayer.addTo(map);
      // 将GL图层组ID存储在map对象中
      map.config("groupId", props.groupId);
      // 将GL图层添加到注册组件中提供给子组件调用
      provide("groupGLLayer", groupGLLayer);
    };

    // 切换地形开关
    const changeTerrain = status => {
      if (map && map.isLoaded()) {
        // 获取地图对象中存储的图层组ID
        const id = map.config().groupId;
        // 获取当前地图的GL图层组
        let groupGLLayer = map.getLayer(id);
        // 若没有的到图层则返回
        if (!groupGLLayer) return;
        // 打开后添加terrain对象关闭则是设置为空
        if (status) {
          // 设置天地图3D地形
          const terrain = tiandituApi.getTerrain(props.tk);
          groupGLLayer.setTerrain(terrain);
        } else {
          groupGLLayer.setTerrain(null);
        }
      }
    };

    // 清除GL中的所有图层
    const clearAllLayer = () => {
      if (map && map.isLoaded()) {
        let groupGLLayer = map.getLayer(map.config().groupId);
        let layers = groupGLLayer.getLayers();
        if (layers && layers.length > 0) {
          for (let i = 0; i < layers.length; i++) {
            groupGLLayer.removeLayer(layers[i]);
          }
        }
      }
    };

    // 移除地图所有图层销毁地图组件
    const removeAll = () => {
      // 删除图层和地图对象
      if (map && map.isLoaded()) {
        let groupGLLayer = map.getLayer(map.config().groupId);
        if (groupGLLayer) map.removeLayer();
      }
    };

    return {
      groupGLLayer,
      changeTerrain,
      clearAllLayer,
      removeAll
    };
  }
});
</script>
