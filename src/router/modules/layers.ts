export default {
  path: "/layers",
  redirect: "/layers/index1",
  meta: {
    icon: "fa-solid:layer-group",
    // showLink: false,
    title: "地图图层",
    rank: 11
  },
  children: [
    {
      path: "/layers/index1",
      name: "webgl图层",
      component: () => import("@/views/examples/layers/index1.vue"),
      meta: {
        title: "webgl图层"
      }
    },
    {
      path: "/layers/index2",
      name: "GEOJSON图层",
      component: () => import("@/views/examples/layers/index2.vue"),
      meta: {
        title: "GEOJSON图层"
      }
    },
    {
      path: "/layers/index3",
      name: "白膜图层",
      component: () => import("@/views/examples/layers/index3.vue"),
      meta: {
        title: "白膜图层"
      },
    },
    {
      path: "/layers/index4",
      name: "服务图层",
      component: () => import("@/views/examples/layers/index4.vue"),
      meta: {
        title: "服务图层"
      },
    }
  ]
} satisfies RouteConfigsTable;
