<template>
  <div>
    <slot />
  </div>
</template>

<script>
import {
  defineComponent,
  onBeforeMount,
  onBeforeUnmount,
  inject,
  watch
} from "vue";
import { buildUUID } from "@pureadmin/utils";
import { ThreeLayer } from "maptalks.three";

export default defineComponent({
  // three.js渲染图层
  name: "mt-three-layer",

  props: {
    // three图层id
    id: {
      type: [String, Number],
      default: ""
    },
    // three图层配置
    options: {
      type: Object,
      default: () => ({})
    }
  },

  setup(props, context) {
    // 获取图层ID
    let id = props.id ? props.id : buildUUID();
    // 获取图层样式
    let options = props.options ? props.options : null;
    // 接收图层配置信息并初始化图层对象
    let threeLayer = new ThreeLayer(id, options);
    // 图层创建后的回调
    context.emit("layerCreated", threeLayer);

    // 监听图层ID
    watch(
      () => props.id,
      newId => {
        if (threeLayer && newId) {
          threeLayer.setId(newId);
        }
      },
      { immediate: true }
    );

    // 监听图层配置
    watch(
      () => props.options,
      newVal => {
        if (threeLayer && newVal) {
          threeLayer.setOptions(newVal);
        }
      },
      { immediate: true, deep: true }
    );

    // 页面加载后执行
    onBeforeMount(() => {
      addThreeLayer();
      initEvents();
    });

    // 页面元素销毁之前执行
    onBeforeUnmount(() => {
      removeAll();
    });

    // 添加Threejs图层
    const addThreeLayer = () => {
      // 获取上级组件中的地图对象
      let maptalks = inject("maptalks", null);
      let map = maptalks.value;
      // 判断地图是否存在
      if (map && map.isLoaded()) {
        // 首先检测地图中是否已经存在Three图层
        if (map.config().threeId) return;
        // 判断更多图层...
        const groupGLLayer = inject("groupGLLayer", null);
        // 若是GL图层存在则优先添加到它里面
        if (groupGLLayer) {
          /**
           * 这里根据官方文档建议一个地图上一般只有一个ThreeLayer, 所以我们将图层id作为唯一值存储在地图map对象中去, 同GroupGLLayer, 若是插槽中存在多个则会被return
           * 链接: https://mdpress.glicon.design/p/5enoiCkUaADcSh76yCKjp/TUCENG/threelayer.html#%E4%BD%BF%E7%94%A8%E5%BB%BA%E8%AE%AE
           */
          groupGLLayer.addLayer(threeLayer);
          // 将Three图层组ID存储在map对象中
          map.config("threeId", id);
          return;
        }
      }
    };

    // 初始化图层事件
    const initEvents = () => {
      if (threeLayer) {
        // 监听workerready事件
        threeLayer.on("workerready", event => {
          context.emit("workerready", event);
        });
        // 初始化根节点结束事件。
        threeLayer.on("rootready", event => {
          context.emit("rootready", event);
        });
        // 成功加载tileset.json事件。
        threeLayer.on("loadtileset", event => {
          context.emit("loadtileset", event);
        });
        // 瓦片载入事件
        threeLayer.on("tileload", event => {
          context.emit("tileload", event);
        });
        // 瓦片载入错误事件
        threeLayer.on("tileerror", event => {
          context.emit("tileerror", event);
        });
        // 图层画布产生绘制的事件
        threeLayer.on("canvasisdirty", event => {
          context.emit("canvasisdirty", event);
        });
        // 图层被清除事件
        threeLayer.on("clear", event => {
          context.emit("clear", event);
        });
        // 图层id变化事件
        threeLayer.on("idchange", event => {
          context.emit("idchange", event);
        });
        // renderer创建事件
        threeLayer.on("renderercreate", event => {
          context.emit("renderercreate", event);
        });
        // canvas创建事件
        threeLayer.on("canvascreate", event => {
          context.emit("canvascreate", event);
        });
        // 开始渲染事件。
        threeLayer.on("renderstart", event => {
          context.emit("renderstart", event);
        });
        // 结束渲染事件
        threeLayer.on("renderend", event => {
          context.emit("renderend", event);
        });
      }
    };

    // 移除并销毁图层对象
    const removeAll = () => {
      // 判断并删除Three图层
      if (threeLayer) {
        threeLayer.remove();
        threeLayer = undefined;
      }
      // 获取上级组件中的地图对象
      let maptalks = inject("maptalks", null);
      let map = maptalks.value;
      // 若地图对象还存在则清空地图中存储的id
      if (map && map.isLoaded()) {
        map.config("threeId", undefined);
      }
    };

    return {
      threeLayer,
      addThreeLayer
    };
  }
});
</script>
