export default {
  path: "/trajectory",
  redirect: "/trajectory/index1",
  meta: {
    icon: "fa-solid:map-marked-alt",
    // showLink: false,
    title: "轨迹",
    rank: 14
  },
  children: [
    {
      path: "/trajectory/index1",
      name: "基础轨迹",
      component: () => import("@/views/examples/trajectory/index1.vue"),
      meta: {
        title: "基础轨迹",
        hiddenTag: true
      }
    },
    {
      path: "/trajectory/index2",
      name: "GLTFLayer轨迹(拖拉机)",
      component: () => import("@/views/examples/trajectory/index2.vue"),
      meta: {
        title: "GLTFLayer轨迹(拖拉机)",
        hiddenTag: true
      }
    },
    {
      path: "/trajectory/index3",
      name: "ThreeLayer轨迹",
      component: () => import("@/views/examples/trajectory/index3.vue"),
      meta: {
        title: "ThreeLayer轨迹",
        hiddenTag: true
      }
    },
    {
      path: "/trajectory/index4",
      name: "GLTFLayer轨迹(无人机)",
      component: () => import("@/views/examples/trajectory/index4.vue"),
      meta: {
        title: "GLTFLayer轨迹(无人机)",
        hiddenTag: true
      }
    },
  ]
} satisfies RouteConfigsTable;