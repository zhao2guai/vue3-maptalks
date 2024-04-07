export default {
  path: "/3d",
  redirect: "/3d/index",
  meta: {
    icon: "fa-solid:map-marked-alt",
    // showLink: false,
    title: "三维首页",
    rank: 13
  },
  children: [
    {
      path: "/3d/index",
      name: "三维首页",
      component: () => import("@/views/examples/3d/index.vue"),
      meta: {
        title: "三维首页"
      }
    }
  ]
} satisfies RouteConfigsTable;
