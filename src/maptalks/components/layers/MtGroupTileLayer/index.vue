<template>
  <div><slot /></div>
</template>
<script>
import {
  inject,
  provide,
  onBeforeUnmount,
  onBeforeMount,
  watch,
  defineComponent
} from "vue";
import { v4 as uuidv4 } from "uuid";
import { GroupTileLayer } from "maptalks";
export default defineComponent({
  /** 初始化图层组件 */
  name: "mt-group-tile-layer",
  props: {
    // tile图层id
    id: {
      type: String,
      default: ""
    },
    // 图层最小缩放距离
    minZoom: {
      type: Number,
      default: 1
    },
    // 图层最大缩放距离
    maxZoom: {
      type: Number,
      default: 18
    },
    // 图层透明度
    opacity: {
      type: Number,
      default: 1
    },
    // 图层服务地址
    zIndex: {
      type: Number,
      default: undefined
    },
    // 服务配置信息
    options: {
      type: Object,
      default: () => ({
        tileSystem: [1, -1, -180, 90],
        spatialReference: {
          projection: "EPSG:4326"
        },
        urlTemplate: "",
        maxAvailableZoom: 18,
        subdomains: ["1", "2", "3", "4", "5"]
      })
    }
  },

  setup(props, context) {
    // 获取图层ID
    let id = props.id ? props.id : uuidv4().replace(/-/g, "");
    // 定义图层组组对象
    let groupTileLayer = new GroupTileLayer(id, [], props.options);

    // 将图层添加到注册组件中提供给子组件调用
    provide("groupTileLayer", groupTileLayer);
    // 组件回调方法
    context.emit("getLayer", groupTileLayer);

    // 页面加载后执行
    onBeforeMount(() => {
      addGroupLayer();
    });

    // 页面元素销毁之前执行
    onBeforeUnmount(() => {
      removeAll();
    });

    // 添加图层组
    const addGroupLayer = () => {
      // 判断更多图层...
      const groupGLLayer = inject("groupGLLayer", null);
      // 若是GL图层存在则优先添加到它里面
      if (groupGLLayer) {
        groupGLLayer.addLayer(groupTileLayer);
        return;
      }
      // 获取上级组件中的地图对象
      let maptalks = inject("maptalks", null);
      // 获取地图对象
      let map = maptalks.value;
      // 若不存在任何图层组则判断地图对象是否加载并添加至map的layers数组中
      if (map && map.isLoaded()) {
        groupTileLayer.addTo(map);
        return;
      }
    };

    // 移除地图所有图层销毁地图组件
    const removeAll = () => {
      // 删除图层和地图对象
      if (groupTileLayer) {
        groupTileLayer.remove();
        groupTileLayer = undefined;
      }
    };

    return {
      groupTileLayer
    };
  }
});
</script>
