export default {
  path: "/3d",
  redirect: "/3d/index1",
  meta: {
    icon: "fa-solid:map-marked-alt",
    // showLink: false,
    title: "行政区划",
    rank: 13
  },
  children: [
    {
      path: "/3d/index1",
      name: "分层设色(甘肃省)",
      component: () => import("@/views/examples/3d/index1.vue"),
      meta: {
        title: "分层设色(甘肃省)",
        hiddenTag: true
      }
    },
    {
      path: "/3d/index2",
      name: "分层设色(新疆)",
      component: () => import("@/views/examples/3d/index2.vue"),
      meta: {
        title: "分层设色(新疆)",
        hiddenTag: true
      }
    }
  ]
} satisfies RouteConfigsTable;
