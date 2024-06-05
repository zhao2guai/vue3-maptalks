export default {
  path: "/lineOfFlight",
  redirect: "/lineOfFlight/index1",
  meta: {
    icon: "majesticons:airplane-flight-2-line",
    // showLink: false,
    title: "飞行线",
    rank: 18
  },
  children: [
    {
      path: "/lineOfFlight/index1",
      name: "飞行线",
      component: () => import("@/views/examples/lineOfFlight/index.vue"),
      meta: {
        title: "飞行线",
        hiddenTag: true
      }
    },
  ]
} satisfies RouteConfigsTable;