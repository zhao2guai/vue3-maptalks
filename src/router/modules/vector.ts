export default {
  path: "/vector",
  redirect: "/vector/index1",
  meta: {
    icon: "fa-solid:layer-group",
    // showLink: false,
    title: "地图图层",
    rank: 11
  },
  children: [
    {
      path: "/vector/index1",
      name: "矢量图层",
      component: () => import("@/views/examples/vector/index1.vue"),
      meta: {
        title: "矢量图层"
      }
    },
    {
      path: "/vector/index2",
      name: "GEOJSON图层",
      component: () => import("@/views/examples/vector/index2.vue"),
      meta: {
        title: "GEOJSON图层"
      }
    },
    {
      path: "/vector/index3",
      name: "白膜图层",
      component: () => import("@/views/examples/vector/index3.vue"),
      meta: {
        title: "白膜图层"
      }
    }
  ]
} satisfies RouteConfigsTable;
