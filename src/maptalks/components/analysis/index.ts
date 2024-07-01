import type { App } from "vue";
import MtViewshedAnalysis from "./MtViewshedAnalysis/index.vue";
import DrawTool from "./DrawTool/index.vue";

function install(app: App) {
  // 视域分析组件
  app.component("mt-viewshed-analysis", MtViewshedAnalysis);
  // 绘制工具组件
  app.component("mt-draw-tool", DrawTool);
}

export default install;

export { install, MtViewshedAnalysis, DrawTool };
