<template>
  <div><slot /></div>
</template>
<script>
import {
  provide,
  inject,
  onBeforeUnmount,
  onBeforeMount,
  watch,
  defineComponent
} from "vue";
import { GroupGLLayer } from "@maptalks/gl-layers";
import { buildUUID } from "@pureadmin/utils";
import { tiandituApi } from "./tianditu.ts";
export default defineComponent({
  /** 初始化webgl图层组件 */
  name: "mt-group-gl-layer",
  props: {
    // GL图层id
    id: {
      type: [String, Number],
      default: "group"
    },
    // 地形开关
    terrainSwitch: {
      type: Boolean,
      default: false
    },
    // 地形配置
    terrain: {
      type: Object,
      default: undefined
    },
    // 天地图密匙
    tk: {
      type: String,
      default: undefined
    },
    // 图层配置
    options: {
      type: Object,
      default: () => ({
        attribution: "",
        minZoom: 1,
        maxZoom: 20,
        visible: true,
        opacity: 1
        // ... 更多参照GroupGLLayer文档
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
    // 获取图层ID
    let id = props.id ? props.id : buildUUID();
    // 定义GL图层组对象
    let groupGLLayer = new GroupGLLayer(id, []);
    // 设置天地图3D地形(天地图密匙是否存在, 存在则优先更换天地图地形)
    let terrain = props.tk ? tiandituApi.getTerrain(props.tk) : props.terrain;
    // 设置GL图层配置选项
    if (props.options) groupGLLayer.setOptions(props.options);
    // 判断地形开关是否开启
    if (props.terrainSwitch === true) {
      if (terrain) groupGLLayer.setTerrain(terrain);
    }
    // 设置场景配置
    if (props.sceneConfig) groupGLLayer.setSceneConfig(props.sceneConfig);
    // 图层创建后的回调
    context.emit("layerCreated", groupGLLayer);
    // 将GL图层添加到注册组件中提供给子组件调用
    provide("groupGLLayer", groupGLLayer);

    // 监听GL图层配置
    watch(
      () => props.options,
      (newOptions, oldOptions) => {
        if (groupGLLayer && newOptions) {
          groupGLLayer.setOptions(newOptions);
        }
      },
      { immediate: true, deep: true }
    );
    // 监听GL场景配置
    watch(
      () => props.sceneConfig,
      (newConfig, oldConfig) => {
        if (groupGLLayer && newConfig) {
          groupGLLayer.setSceneConfig(newConfig);
        }
      },
      { immediate: true, deep: true }
    );
    // 监听地形开关
    watch(
      () => props.terrainSwitch,
      newVal => {
        if (groupGLLayer) {
          changeTerrain(newVal);
        }
      },
      { deep: true }
    );

    // 页面加载后执行
    onBeforeMount(() => {
      addGLLayer();
      initEvents();
    });

    // 页面元素销毁之前执行
    onBeforeUnmount(() => {
      removeAll();
    });

    // 添加GL图层组
    const addGLLayer = () => {
      // 获取上级组件中的地图对象
      let maptalks = inject("maptalks", null);
      let map = maptalks.value;
      // 判断地图是否存在
      if (map && map.isLoaded()) {
        // 首先检测地图中是否已经存在GL图层
        if (map.config().groupId) return;
        // 将GL图层添加至地图
        groupGLLayer.addTo(map);
        // 将GL图层组ID存储在map对象中
        map.config("groupId", id);
        // 回调方法
        context.emit("getLayer", groupGLLayer);
      }
    };

    // 切换天地图地形开关
    const changeTerrain = e => {
      // 若没有的到图层则返回
      if (!groupGLLayer) return;
      // 打开后添加terrain对象关闭则是设置为空
      if (e === true) {
        // 设置天地图3D地形
        if (terrain) groupGLLayer.setTerrain(terrain);
      } else {
        groupGLLayer.setTerrain(null);
      }
    };

    // 清除GL中的所有图层
    const clearAllLayer = () => {
      let layers = groupGLLayer.getLayers();
      if (layers && layers.length > 0) {
        for (let i = 0; i < layers.length; i++) {
          groupGLLayer.removeLayer(layers[i]);
        }
      }
    };

    // 初始化图层事件
    const initEvents = () => {
      if (!groupGLLayer) return;
      // 后处理开始事件
      groupGLLayer.on("postprocessstart", event => {
        context.emit("postprocessstart", event);
      });
      // 后处理结束事件
      groupGLLayer.on("postprocessend", event => {
        context.emit("postprocessend", event);
      });
      // TAA抗锯齿开始事件
      groupGLLayer.on("taastart", event => {
        context.emit("taastart", event);
      });
      // TAA抗锯齿结束事件
      groupGLLayer.on("taaend", event => {
        context.emit("taaend", event);
      });
      // 监听clear事件
      groupGLLayer.on("clear", event => {
        context.emit("clear", event);
      });
      // 监听id改变事件
      groupGLLayer.on("idchange", event => {
        context.emit("idchange", event);
      });
      // renderer创建事件
      groupGLLayer.on("renderercreate", event => {
        context.emit("renderercreate", event);
      });
      // canvas创建时候触发事件。
      groupGLLayer.on("canvascreate", event => {
        context.emit("canvascreate", event);
      });
      // 开始渲染事件
      groupGLLayer.on("renderstart", event => {
        context.emit("renderstart", event);
      });
      // 结束渲染事件
      groupGLLayer.on("renderend", event => {
        context.emit("renderend", event);
      });
    };

    // 移除地图所有图层销毁地图组件
    const removeAll = () => {
      // 删除GL图层
      if (groupGLLayer) {
        groupGLLayer.remove();
        groupGLLayer = undefined;
      }
      // 获取上级组件中的地图对象
      let maptalks = inject("maptalks", null);
      let map = maptalks.value;
      if (map && map.isLoaded()) {
        map.config("groupId", undefined);
      }
    };

    return {
      groupGLLayer,
      changeTerrain,
      clearAllLayer
    };
  }
});
</script>
