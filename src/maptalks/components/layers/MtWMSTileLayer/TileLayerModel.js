import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import WMTSTileGrid from 'ol/tilegrid/WMTS.js';
import TileGrid from 'ol/tilegrid/TileGrid.js';
import {get as getProjection} from 'ol/proj.js';
import {getTopLeft, getWidth} from 'ol/extent.js';
/**
 * @class TileLayerModel
 * @classdesc OL瓦片层专用实体类
 * @param {Object} opt_options - 图层初始化参数。
 * @extends {TileLayer} 继承自openlayers瓦片图层对象
 * @author zpc
 */
export default class TileLayerModel extends TileLayer {
  constructor(options) {
    super(options);
    // 设置数据源信息
    this.getWMSource(options);
  }
  // 创建图层并设置WMS数据源
  getWMSource(options) {
    // 扩展信息
    const properties = options.properties;
    // 默认坐标系
    const proj = properties.projection ? properties.projection : "EPSG:4326";
    // 默认参数
    const params = properties.params;
    // 创建数据源并添到图层中
    this.setSource(new TileWMS({
      url: properties.url,
      params: {
        LAYERS: properties.layers,
        STYLES: properties.styles,
        ...params
      },
      projection: proj,
      tileGrid: this.getTileGrid("WMS", proj, 18),
      wrapX: true //是否将图形重复展示
    }));
  }
  // 根据坐标系和影像高度获取平铺网格信息
  getTileGrid(service, proj, zoom) {
    // 若最大高度为空则默认为18层即地图缩放为1~18
    const maxZoom = zoom ? zoom : 18;
    // 获取地图配置中的坐标系
    const projection = getProjection(proj);
    const projectionExtent = projection.getExtent();
    const size = getWidth(projectionExtent) / 256;
    const resolutions = new Array(maxZoom);
    const matrixIds = new Array(maxZoom);
    for (let z = 0; z < maxZoom; ++z) {
      // generate resolutions and matrixIds arrays for this WMTS
      resolutions[z] = size / Math.pow(2, z);
      matrixIds[z] = z;
    }
    if (service==="WMTS") {
      return new WMTSTileGrid({
        origin: getTopLeft(projectionExtent),
        resolutions: resolutions,
        matrixIds: matrixIds
      })
    } else {
      return new TileGrid({
        origin: getTopLeft(projectionExtent),
        resolutions: resolutions
      })
    }
  }
}
