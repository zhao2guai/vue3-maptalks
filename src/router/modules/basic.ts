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
      name: "OpenStreetMap",
      component: () => import("@/views/examples/basic/map2.vue"),
      meta: {
        title: "OpenStreetMap"
      }
    },
    {
      path: "/basic/map3",
      name: "OpenStreetMapDark",
      component: () => import("@/views/examples/basic/map3.vue"),
      meta: {
        title: "OpenStreetMapDark"
      }
    },
    {
      path: "/basic/map4",
      name: "百度地图",
      component: () => import("@/views/examples/basic/map4.vue"),
      meta: {
        title: "百度地图"
      }
    }
  ]
} satisfies RouteConfigsTable;
