export default {
  path: "/weather",
  redirect: "/weather/index1",
  meta: {
    icon: "typcn:weather-partly-sunny",
    // showLink: false,
    title: "天气",
    rank: 16
  },
  children: [
    {
      path: "/weather/index1",
      name: "雾",
      component: () => import("@/views/examples/weather/index1.vue"),
      meta: {
        title: "雾",
        hiddenTag: true
      }
    },
    {
      path: "/weather/index2",
      name: "雨",
      component: () => import("@/views/examples/weather/index2.vue"),
      meta: {
        title: "雨",
        hiddenTag: true
      }
    },
    {
      path: "/weather/index3",
      name: "雪",
      component: () => import("@/views/examples/weather/index3.vue"),
      meta: {
        title: "雪",
        hiddenTag: true
      }
    },
    {
      path: "/weather/index4",
      name: "天气切换",
      component: () => import("@/views/examples/weather/index4.vue"),
      meta: {
        title: "天气切换",
        hiddenTag: true
      }
    },
  ]
} satisfies RouteConfigsTable;