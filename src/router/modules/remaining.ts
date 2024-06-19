const Layout = () => import("@/layout/index.vue");

export default [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "登录",
      showLink: false,
      rank: 101
    }
  },
  {
    path: "/redirect",
    component: Layout,
    meta: {
      title: "加载中...",
      showLink: false,
      rank: 102
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        name: "Redirect",
        component: () => import("@/layout/redirect.vue")
      }
    ]
  },
  // 下面是一个无layout菜单的例子（一个全屏空白页面），因为这种情况极少发生，所以只需要在前端配置即可（配置路径：src/router/modules/remaining.ts）
  {
    path: "/empty",
    name: "Empty",
    component: () => import("@/views/empty/index.vue"),
    meta: {
      title: "无Layout页",
      showLink: false,
      rank: 103
    }
  },
  {
    path: "/tdt-img",
    name: "天地图-影像",
    component: () => import("@/views/examples/basic/map1.vue"),
    meta: {
      title: "天地图-影像",
      showLink: false,
      rank: 200
    }
  },
  {
    path: "/dark-blue",
    name: "天地图-深蓝",
    component: () => import("@/views/examples/basic/map2.vue"),
    meta: {
      title: "天地图-深蓝",
      showLink: false,
      rank: 201
    }
  },
  {
    path: "/xzqh-62",
    name: "分层设色(甘肃省)",
    component: () => import("@/views/examples/3d/index1.vue"),
    meta: {
      title: "分层设色(甘肃省)",
      showLink: false,
      rank: 230
    }
  },
  {
    path: "/xzqh-65",
    name: "分层设色(新疆)",
    component: () => import("@/views/examples/3d/index4.vue"),
    meta: {
      title: "分层设色(新疆)",
      showLink: false,
      rank: 231
    }
  }
] satisfies Array<RouteConfigsTable>;
