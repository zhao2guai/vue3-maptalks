export default {
  path: "/others",
  redirect: "/others/index1",
  meta: {
    icon: "majesticons:airplane-flight-2-line",
    // showLink: false,
    title: "飞行线",
    rank: 18
  },
  children: [
    {
      path: "/others/index1",
      name: "飞行线",
      component: () => import("@/views/examples/others/index1.vue"),
      meta: {
        title: "飞行线",
        hiddenTag: true
      }
    }
  ]
} satisfies RouteConfigsTable;
