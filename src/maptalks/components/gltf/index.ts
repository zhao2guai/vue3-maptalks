import type { App } from "vue";
import MtGLTFLayer from "./MtGLTFLayer/index.vue";
import MtGLTFMaker from "./MtGLTFMaker/index.vue";
import MtMultiGLTFMarker from "./MtMultiGLTFMarker/index.vue";

function install(app: App) {
  // 初始化地图组件
  app.component("mt-gltf-layer", MtGLTFLayer);
  app.component("mt-gltf-maker", MtGLTFMaker);
  app.component("mt-multi-gltf-maker", MtMultiGLTFMarker);
}

export default install;

export {
  install,
  MtGLTFLayer,
  MtGLTFMaker,
  MtMultiGLTFMarker
};