export default {
  path: "/gltf",
  redirect: "/gltf/index1",
  meta: {
    icon: "ri:map-pin-range-fill",
    // showLink: false,
    title: "GLTF模型",
    rank: 12
  },
  children: [
    {
      path: "/gltf/index1",
      name: "模型1",
      component: () => import("@/views/examples/gltf/index1.vue"),
      meta: {
        title: "模型1"
      }
    },
    {
      path: "/gltf/index2",
      name: "模型2",
      component: () => import("@/views/examples/gltf/index2.vue"),
      meta: {
        title: "模型2"
      }
    },
    {
      path: "/gltf/index3",
      name: "模型3",
      component: () => import("@/views/examples/gltf/index3.vue"),
      meta: {
        title: "模型3"
      }
    }
  ]
} satisfies RouteConfigsTable;
