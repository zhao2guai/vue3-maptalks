import worldMapAlt from "@/assets/svg/gis/world-map-alt-o.svg?component";
export default {
  path: "/basic",
  redirect: "/basic/map1",
  meta: {
    icon: worldMapAlt,
    // showLink: false,
    title: "基础地图",
    rank: 10
  },
  children: [
    {
      path: "/basic/map1",
      name: "天地图-影像",
      component: () => import("@/views/examples/basic/map1.vue"),
      meta: {
        title: "天地图-影像",
        hiddenTag: true
      }
    },
    {
      path: "/basic/map2",
      name: "天地图-矢量(深蓝)",
      component: () => import("@/views/examples/basic/map2.vue"),
      meta: {
        title: "天地图-矢量(深蓝)",
        hiddenTag: true
      }
    },
    {
      path: "/basic/map3",
      name: "单个底图组件示例",
      component: () => import("@/views/examples/basic/map3.vue"),
      meta: {
        title: "单个底图组件示例",
        hiddenTag: true
      }
    },
    {
      path: "/basic/map4",
      name: "多个底图组件示例",
      component: () => import("@/views/examples/basic/map4.vue"),
      meta: {
        title: "多个底图组件示例",
        hiddenTag: true
      }
    }
  ]
} satisfies RouteConfigsTable;
