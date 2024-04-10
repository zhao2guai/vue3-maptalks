import type { App } from "vue";
import MtGLTFLayer from "./MtGLTFLayer/index.vue";
import MtGLTFMaker from "./MtGLTFMaker/index.vue";

function install(app: App) {
  // 初始化地图组件
  app.component("mt-gltf-layer", MtGLTFLayer);
  app.component("mt-gltf-maker", MtGLTFMaker);
}

export default install;

export {
  install,
  MtGLTFLayer,
  MtGLTFMaker
};