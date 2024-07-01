import type { App } from "vue";
import MtRouterPlayer from "./MtRouterPlayer/index.vue";

function install(app: App) {
  // 初始化地图组件
  app.component("mt-router-player", MtRouterPlayer);
}

export default install;

export { install, MtRouterPlayer };
