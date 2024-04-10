<template>
  <div><slot /></div>
</template>
<script>
import {
  inject,
  onBeforeUnmount,
  onBeforeMount,
  watch,
  defineComponent
} from "vue";
import { v4 as uuidv4 } from "uuid";
import { TileLayer } from "maptalks";
export default defineComponent({
  /** 初始化webgl图层组件 */
  name: "mt-tile-layer",
  props: {
    // tile图层id
    id: {
      type: String,
      default: ""
    },
    // 图层服务地址
    urlTemplate: {
      type: String,
      default: ""
    },
    // 图层坐标系
    projection: {
      type: String,
      default: "EPSG:4326"
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
    // 是否显示图层
    visible: {
      type: Boolean,
      default: true
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
    }
  },

  setup(props, context) {
    // 获取坐标系
    let proj = props.projection ? props.projection : "EPSG:4326";
    // 获取图层ID
    let id = props.id ? props.id : uuidv4().replace(/-/g, "");
    // 接收图层配置信息并初始化图层对象
    let tileLayer = new TileLayer(id, {
      tileSystem: [1, -1, -180, 90],
      spatialReference: {
        projection: proj
      },
      urlTemplate: props.urlTemplate,
      maxAvailableZoom: 18,
      subdomains: ["1", "2", "3", "4", "5"],
      visible: props.visible,
      minZoom: props.minZoom,
      maxZoom: props.maxZoom,
      zIndex: props.zIndex
    });
    // 向组件传送初始化完毕的layer
    context.emit("getLayer", tileLayer);

    // 监听瓦片图层ID
    watch(
      props.id,
      (newVal, oldVal) => {
        if (tileLayer && newVal) {
          tileLayer.setId(newVal);
        }
      },
      { immediate: true }
    );

    // 监听瓦片图层透明度
    watch(
      props.opacity,
      (newVal, oldVal) => {
        if (tileLayer && newVal) {
          tileLayer.setOpacity(newVal);
        }
      },
      { immediate: true }
    );

    // 监听瓦片图层高度
    watch(
      props.zIndex,
      (newVal, oldVal) => {
        if (tileLayer && newVal) {
          tileLayer.setZIndex(newVal);
        }
      },
      { immediate: true }
    );

    // 页面加载后执行
    onBeforeMount(() => {
      if (props.id && props.urlTemplate) {
        addTileLayer();
      } else {
        console.error("当前瓦片图层组id为空, 无法添加图层!");
      }
    });

    // 页面元素销毁之前执行
    onBeforeUnmount(() => {
      removeAll();
    });

    // 添加瓦片图层
    const addTileLayer = () => {
      // 判断更多图层...
      const groupGLLayer = inject("groupGLLayer", null);
      // const groupTileLayer = inject("groupTileLayer");
      // 若是GL图层存在则优先添加到它里面
      if (groupGLLayer) {
        groupGLLayer.addLayer(tileLayer);
        return
      } 
      // 再次判断图层组
      const groupTileLayer = inject("groupTileLayer", null);
      if (groupTileLayer) {
        let layers = groupTileLayer.getLayers();
        layers.push(tileLayer);
        groupTileLayer.addLayer(layers);
        return;
      }
      // 获取上级组件中的地图对象
      let maptalks = inject("maptalks", null);
      let map = maptalks.value;
      // 若不存在任何图层组则判断地图对象是否加载并添加至map的layers数组中
      if (map && map.isLoaded()) {
        tileLayer.addTo(map);
        return
      }
    };

    // 移除地图所有图层销毁地图组件
    const removeAll = () => {
      // 删除图层和地图对象
      if (tileLayer) {
        tileLayer.remove();
        tileLayer = undefined;
      }
    };

    return {
      tileLayer,
      removeAll
    };
  }
});
</script>
