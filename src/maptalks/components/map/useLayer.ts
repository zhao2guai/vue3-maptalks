import { inject, onUnmounted, ref } from "vue";
import type Layer from "maptalks";
/**
 * 这是一个图层控制方法
 * @param layer
 * @returns
 */
export default function useLayer(layer: Layer) {
  // 获取上级组件中的地图对象
  const maptalks = inject("maptalks", null);
  // 获取地图对象值，用于添加或移除该图层在地图中的状态操作
  const map = maptalks ? maptalks.value : undefined;
  // 获取上级组件是否是BaseLayer, 若是存在底图图层还要判断里面是否有其他的图层，因为底图中只能放一个
  const baseLayer = inject("baseLayer", null);
  // 获取插槽的上级组件 (groupGLLayer优先插入其次groupTileLayer最后才是map)
  const groupGLLayer = inject("groupGLLayer", null);
  // 再次判断瓦片图层组的情况
  const groupTileLayer = inject("groupTileLayer", null);
  // 图层状态
  const layerAdded = ref(false);

  addLayer();

  function addLayer() {
    if (!layerAdded.value) {
      if (groupGLLayer) {
        // 若是GL图层存在则优先添加到它里面
        groupGLLayer?.addLayer(layer);
      } else if (groupTileLayer && groupTileLayer.isLoaded()) {
        let layers = groupTileLayer.getLayers();
        layers.push(layer);
        groupTileLayer.addLayer(layers);
      } else if (map && baseLayer) {
        // 若是底图中已有其他图层则返回
        if (!map.getBaseLayer()) map?.setBaseLayer(layer);
      } else {
        // 若不存在任何图层组则判断地图对象是否加载并添加至map的layers数组中
        map?.addLayer(layer);
      }
      layerAdded.value = true;
    }
  }

  function removeLayer() {
    layerAdded.value = false;
  }

  onUnmounted(removeLayer);

  return {
    layer,
    map
  };
}
