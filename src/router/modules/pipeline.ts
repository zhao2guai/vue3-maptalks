export default {
  path: "/pipeline",
  redirect: "/pipeline/index1",
  meta: {
    icon: "eos-icons:pipeline-outlined",
    // showLink: false,
    title: "管线",
    rank: 15
  },
  children: [
    {
      path: "/pipeline/index1",
      name: "地下管线",
      component: () => import("@/views/examples/pipeline/index1.vue"),
      meta: {
        title: "地下管线",
        hiddenTag: true
      }
    },
    {
      path: "/pipeline/index2",
      name: "管线流动效果",
      component: () => import("@/views/examples/pipeline/index2.vue"),
      meta: {
        title: "管线流动效果",
        hiddenTag: true
      }
    },
    {
      path: "/pipeline/index3",
      name: "自动生成三通和四通",
      component: () => import("@/views/examples/pipeline/index3.vue"),
      meta: {
        title: "自动生成三通和四通",
        hiddenTag: true
      }
    },
  ]
} satisfies RouteConfigsTable;