export default {
  path: "/osgb",
  redirect: "/osgb/index1",
  meta: {
    icon: "majesticons:image-photography-line",
    // showLink: false,
    title: "倾斜摄影(osgb)",
    rank: 15
  },
  children: [
    {
      path: "/osgb/index1",
      name: "倾斜摄影(大雁塔)",
      component: () => import("@/views/examples/osgb/index1.vue"),
      meta: {
        title: "倾斜摄影(大雁塔)",
        hiddenTag: true
      }
    },
    {
      path: "/osgb/index2",
      name: "倾斜摄影(新疆地块)",
      component: () => import("@/views/examples/osgb/index2.vue"),
      meta: {
        title: "倾斜摄影(新疆地块)",
        hiddenTag: true
      }
    }
  ]
} satisfies RouteConfigsTable;
