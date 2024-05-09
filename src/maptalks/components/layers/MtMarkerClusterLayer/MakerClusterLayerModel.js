import {
  Eventable,
  Class,
  Util
} from "maptalks";

import Supercluster from 'supercluster';

const OPTIONS = {
  radius: 250,
  maxZoom: 18,
};

let superclusterIndex = null;

function now() {
  return new Date().getTime();
}

export default class MarkerClusterLayer extends Eventable(Class) {
  constructor(options) {
    super(options);
    this.data = null;
    this.map = null;
    if (!options.createIcon) {
      console.error("not find createIcon params for create uimarker");
      return this;
    }
    const index = new Supercluster(Object.assign({}, OPTIONS, options));
    superclusterIndex = index;
    this.index = index;
    this.clusterCache = {};
    this.time = now();
  }

  getMap() {
    return this.map;
  }

  getMarkers() {
    return Object.values(this.clusterCache);
  }

  getIndex() {
    return this.index;
  }

  addTo(map) {
    if (this.getMap()) {
      console.error("it has added to map");
      return this;
    }
    this.map = map;
    this.map.on("viewchange", this._viewchange, this);
    this._cluster();
    return this;
  }

  remove() {
    this.map.on("viewchange", this._viewchange, this);
    this.map = null;
    return this;
  }

  _viewchange() {
    this._cluster();
  }

  _cluster() {
    const map = this.getMap();
    if (!map) {
      return this;
    }
    if (!this.data || this.data.length === 0 || !this.options.createIcon) {
      return this;
    }
    const bound = map.getExtent();
    const {
      xmin,
      ymin,
      xmax,
      ymax
    } = bound;
    const zoom = Math.round(map.getZoom());
    const result = this.index.getClusters([xmin, ymin, xmax, ymax], zoom);
    const tempCache = {};
    result.forEach((feature) => {
      const {
        id
      } = feature;
      tempCache[id] = feature;
    });
    for (const key in this.clusterCache) {
      if (!tempCache[key]) {
        const marker = this.clusterCache[key];
        marker.remove();
        delete marker.feature;
        delete this.clusterCache[key];
      }
    }

    // const time = 'time';
    // console.time(time);
    for (const key in tempCache) {
      if (this.clusterCache[key]) {
        continue;
      }
      const feature = tempCache[key];
      const marker = this.options.createIcon(feature);
      if (!marker) {
        continue;
      }
      marker.addTo(map);
      marker.feature = tempCache[key];
      this.clusterCache[key] = marker;
    }
    // console.timeEnd(time);
    return this;
  }

  _checkData(geojson) {
    let features;
    if (geojson.type === "FeatureCollection") {
      features = geojson.features || [];
    } else if (Array.isArray(geojson)) {
      features = geojson;
    }
    if (!features) {
      console.error("geojson data is error", geojson);
      return this;
    }
    features.forEach((feature) => {
      feature.id = feature.id || `f-${Util.GUID()}`;
    });
    console.log(this.index);
    // this.index.load(features);
    if (superclusterIndex) {
      superclusterIndex.load(features);
    }
    this.data = geojson;
    return this;
  }

  setData(geojson) {
    this._checkData(geojson);
    this._cluster();
    return this;
  }

  clear() {
    this.data = [];
    this.getMarkers().forEach((marker) => {
      marker.remove();
    });
    this.clusterCache = {};
    this._cluster();
    return this;
  }
}

MarkerClusterLayer.mergeOptions(OPTIONS);
