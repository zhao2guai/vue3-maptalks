import { defineFakeRoute } from "vite-plugin-fake-server/client";

export default defineFakeRoute([
  {
    url: "/get-card-list",
    method: "post",
    response: () => {
      return {
        success: true,
        data: {
          list: [
            {
              index: 1,
              isSetup: true,
              type: 4,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              path: "/tdt-img",
              name: "天地图-影像",
              description: "作者: 赵二乖 | 发布时间: 2024年3月"
            },
            {
              index: 2,
              isSetup: true,
              type: 4,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              path: "/dark-blue",
              name: "天地图-深蓝",
              description: "作者: 赵二乖 | 发布时间: 2024年3月"
            },
            {
              index: 3,
              isSetup: true,
              type: 5,
              path: "/xzqh-62",
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "CVM",
              description: "作者: 赵二乖 | 发布时间: 2024年3月"
            },
            {
              index: 4,
              isSetup: true,
              type: 2,
              path: "/xzqh-65",
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "SSL证书",
              description: "作者: 赵二乖 | 发布时间: 2024年3月"
            }
          ]
        }
      };
    }
  }
]);
