import type { App } from "vue";
import MtGLTFLayer from "./MtGLTFLayer/index.vue";
import MtGLTFMaker from "./MtGLTFMaker/index.vue";
import MtMultiGLTFMarker from "./MtMultiGLTFMarker/index.vue";
import MtGLTFLineString from "./MtGLTFLineString/index.vue";
// 初始化地图模型类组件
function install(app: App) {
  app.component("mt-gltf-layer", MtGLTFLayer);
  app.component("mt-gltf-maker", MtGLTFMaker);
  app.component("mt-multi-gltf-maker", MtMultiGLTFMarker);
  app.component("mt-gltf-line-string", MtGLTFLineString);
}

export default install;

export {
  install,
  MtGLTFLayer,
  MtGLTFMaker,
  MtMultiGLTFMarker,
  MtGLTFLineString
};
