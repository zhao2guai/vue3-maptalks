export default {
  path: "/basic",
  redirect: "/basic/map1",
  meta: {
    icon: "ri:treasure-map-fill",
    // showLink: false,
    title: "基础功能",
    rank: 10
  },
  children: [
    {
      path: "/basic/map1",
      name: "天地图",
      component: () => import("@/views/examples/basic/map1.vue"),
      meta: {
        title: "天地图"
      }
    },
    {
      path: "/basic/map2",
      name: "地图2",
      component: () => import("@/views/examples/basic/map2.vue"),
      meta: {
        title: "地图2"
      }
    },
    {
      path: "/basic/map3",
      name: "地图3",
      component: () => import("@/views/examples/basic/map3.vue"),
      meta: {
        title: "地图3"
      }
    }
  ]
} satisfies RouteConfigsTable;
