export default {
  path: "/3d",
  redirect: "/3d/index1",
  meta: {
    icon: "gis:3dtiles-web",
    // showLink: false,
    title: "行政区划",
    rank: 13
  },
  children: [
    {
      path: "/3d/index1",
      name: "分层设色(ThreeLayer)",
      component: () => import("@/views/examples/3d/index1.vue"),
      meta: {
        title: "分层设色(ThreeLayer)",
        hiddenTag: true
      }
    },
    {
      path: "/3d/index2",
      name: "分层设色(ExtrudePolygonLayer)",
      component: () => import("@/views/examples/3d/index2.vue"),
      meta: {
        title: "分层设色(ExtrudePolygonLayer)",
        hiddenTag: true
      }
    },
    {
      path: "/3d/index3",
      name: "地形抬升(ThreeLayer)",
      component: () => import("@/views/examples/3d/index3.vue"),
      meta: {
        title: "地形抬升(ThreeLayer)",
        hiddenTag: true
      }
    }
  ]
} satisfies RouteConfigsTable;
