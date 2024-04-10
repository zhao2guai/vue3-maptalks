<template>
  <div>
    <slot />
  </div>
</template>

<script>
import { defineComponent, inject, onBeforeUnmount, onBeforeMount, watch } from "vue";
import { v4 as uuidv4 } from "uuid";
import { WMSTileLayer } from "maptalks";

export default defineComponent({
  /** 初始化webgl图层组件 */
  name: "mt-wms-tile-layer",

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
    // 图层高度
    zIndex: {
      type: Number,
      default: undefined
    },
    // 服务配置信息
    options: {
      type: Object,
      default: () => ({
        tileSystem: [1, -1, -180, 90],
        urlTemplate: "",
        crs: "EPSG:4326",
        layers: "",
        styles: "",
        version: "1.1.0",
        format: "image/png",
        transparent: true,
        uppercase: true,
      })
    }
  },

  setup(props, context) {
    // 获取坐标系
    let proj = props.options.crs ? props.options.crs : "EPSG:4326";
    // 获取图层ID
    let id = props.id ? props.id : uuidv4().replace(/-/g, "");
    // 接收图层配置信息并初始化图层对象
    let wmsLayer = new WMSTileLayer(id, props.options);

    // 监听瓦片图层ID
    watch(() => props.id, (newId) => {
        if (wmsLayer && newId) {
          wmsLayer.setId(newVal);
        }
      },
      { immediate: true }
    );

    // 监听瓦片图层透明度
    watch(() => props.opacity, (newOpacity) => {
        if (wmsLayer && newOpacity) {
          wmsLayer.setOpacity(newVal);
        }
      },
      { immediate: true }
    );

    // 监听瓦片图层高度
    watch(() => props.zIndex, (newZIndex) => {
        if (wmsLayer && newZIndex) {
          wmsLayer.setZIndex(newVal);
        }
      },
      { immediate: true }
    );

    // 监听服务配置信息
    watch(() => props.options, (newOptions) => {
      if(wmsLayer && newOptions) {
        wmsLayer.setOptions(newOptions);
        wmsLayer.forceReload();
      }
    }, {deep: true})

    // 页面加载后执行
    onBeforeMount(() => {
      addwmsLayer();

    });

    // 页面元素销毁之前执行
    onBeforeUnmount(() => {
      removeAll();
    });

     // 添加瓦片图层
    const addwmsLayer = () => {
      // 判断更多图层...
      const groupGLLayer = inject("groupGLLayer", null);
      // 若是GL图层存在则优先添加到它里面
      if (groupGLLayer) {
        groupGLLayer.addLayer(wmsLayer);
        return
      }
      // 再次判断图层组
      const groupTileLayer = inject("groupTileLayer", null);
      if (groupTileLayer) {
        let layers = groupTileLayer.getLayers();
        layers.push(wmsLayer);
        groupTileLayer.addLayer(layers);
        return;
      }
      // 获取上级组件中的地图对象
      let maptalks = inject("maptalks", null);
      let map = maptalks.value;
      // 若不存在任何图层组则判断地图对象是否加载并添加至map的layers数组中
      if (map && map.isLoaded()) {
        wmsLayer.addTo(map);
        return
      }
    };

    // 移除地图所有图层销毁地图组件
    const removeAll = () => {
      // 删除图层和地图对象
      if (wmsLayer) {
        wmsLayer.remove();
        wmsLayer = undefined;
      }
    };

    return {
      wmsLayer
    }
  }
})
</script>

<style lang="scss" scoped>

</style>