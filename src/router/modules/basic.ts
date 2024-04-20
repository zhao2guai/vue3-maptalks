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
        title: "天地图-影像"
      }
    },
    {
      path: "/basic/map2",
      name: "天地图-矢量(深蓝)",
      component: () => import("@/views/examples/basic/map2.vue"),
      meta: {
        title: "天地图-矢量(深蓝)"
      }
    },
    {
      path: "/basic/map3",
      name: "开放街道图",
      component: () => import("@/views/examples/basic/map3.vue"),
      meta: {
        title: "开放街道图"
      }
    },
    {
      path: "/basic/map4",
      name: "开放街道图(暗黑)",
      component: () => import("@/views/examples/basic/map4.vue"),
      meta: {
        title: "开放街道图(暗黑)"
      }
    }
  ]
} satisfies RouteConfigsTable;
