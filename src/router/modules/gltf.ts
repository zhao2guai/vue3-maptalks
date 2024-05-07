import position from "@/assets/svg/gis/position.svg?component";
export default {
  path: "/gltf",
  redirect: "/gltf/index1",
  meta: {
    icon: position,
    // showLink: false,
    title: "GLTF模型",
    rank: 12
  },
  children: [
    {
      path: "/gltf/index1",
      name: "虫情设备",
      component: () => import("@/views/examples/gltf/index1.vue"),
      meta: {
        title: "虫情设备"
      }
    },
    {
      path: "/gltf/index2",
      name: "摄像头模型",
      component: () => import("@/views/examples/gltf/index2.vue"),
      meta: {
        title: "摄像头模型"
      }
    },
    {
      path: "/gltf/index3",
      name: "动物模型",
      component: () => import("@/views/examples/gltf/index3.vue"),
      meta: {
        title: "动物模型"
      }
    },
    {
      path: "/gltf/index4",
      name: "批量模型",
      component: () => import("@/views/examples/gltf/index4.vue"),
      meta: {
        title: "批量模型"
      }
    }
  ]
} satisfies RouteConfigsTable;
