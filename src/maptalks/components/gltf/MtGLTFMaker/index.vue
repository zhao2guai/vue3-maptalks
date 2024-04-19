<template>
  <div>
    <slot />
  </div>
</template>

<script>
import {
  defineComponent,
  inject,
  onBeforeUnmount,
  onBeforeMount,
  watch,
  nextTick
} from "vue";
import { GLTFMarker } from "@maptalks/gl-layers";
import { buildUUID } from "@pureadmin/utils";

export default defineComponent({
  /** 初始化webgl图层组件 */
  name: "mt-gltf-maker",

  props: {
    // 点的id
    id: {
      type: String,
      default: ""
    },
    // 坐标
    point: {
      type: Array,
      default: []
    },
    //gltf图层配置
    symbol: {
      type: Object,
      default: () => ({
        url: null, //模型的url
        visible: true, //模型是否可见
        translationL: [0, 0, 0], //模型在本地坐标系xyz轴上的偏移量
        rotation: [0, 0, 0], //模型在本地坐标系xyz轴上的旋转角度，单位角度
        scale: [1, 1, 1], //模型在本地坐标系xyz轴上的缩放倍数
        animation: false, //是否开启动画
        animationName: 0, //动画序列名称
        loop: true, //是否开启动画循环
        speed: 1, //动画速度倍数
        fixSizeOnZoom: -1, //在给定级别上固定模型大小，不再随地图缩放而改变，设置为-1时取消
        anchorZ: "bottom", //模型在z轴上的锚点或对齐点，可选的值： top， bottom
        shadow: true, //是否开启阴影
        bloom: true, //是否开启泛光
        shader: "pbr" //模型绘制的shader，可选值：pbr, phong, wireframe
      })
    }
  },

  setup(props, context) {
    // 获取点ID
    let id = props.id ? props.id : buildUUID();

    // 初始化gltf三维模型绘制图层
    let gltfMarker = new GLTFMarker(props.point, {
      id: id,
      cursor: "pointer",
      symbol: props.symbol
    });

    // 监听打点样式
    watch(
      () => props.symbol,
      newSymbol => {
        if (gltfMarker && newSymbol) {
          gltfMarker.setSymbol(newSymbol);
        }
      },
      { immediate: true, deep: true }
    );

    // 页面加载后执行
    onBeforeMount(() => {
      addGLTFMakerToGLTFLayer();
    });

    // 页面元素销毁之前执行
    onBeforeUnmount(() => {
      removeAll();
    });

    // 将gltfMaker点添加到gltflayer中
    const addGLTFMakerToGLTFLayer = () => {
      // 获取map对象
      let maptalks = inject("maptalks", null);
      let map = maptalks.value;
      if (map && map.isLoaded()) {
        map.on("click", () => {
          close();
        });
      }
      // 判断更多图层...
      const gltfLayer = inject("gltfLayer", null);
      // 若是GLTF图层存在则添加到它里面
      if (gltfLayer) {
        gltfLayer.addGeometry(gltfMarker);
        return;
      }
    };

    // 给点添加鼠标点击事件
    gltfMarker.on("click", event => {
      context.emit("click", event);
    });

    // 给点添加鼠标移入事件
    gltfMarker.on("mouseenter", event => {
      gltfMarker.setUniform("polygonFill", [0, 1, 1, 1.0]);
      context.emit("mouseenter", event);
    });

    // 给点添加鼠标移出事件
    gltfMarker.on("mouseout", event => {
      gltfMarker.setUniform("polygonFill", [1, 1, 1, 1.0]);
      context.emit("mouseout", event);
    });

    // 添加load事件
    gltfMarker.on("load", event => context.emit("load", event));

    // 移除地图gltf三维模型绘制图层
    const removeAll = () => {
      if (gltfMarker) {
        gltfMarker.remove();
        gltfMarker = undefined;
      }
    };

    // 关闭mark的弹窗
    const close = () => {
      if (gltfMarker && gltfMarker.getInfoWindow()) {
        gltfMarker.closeInfoWindow();
      }
    };

    return {
      gltfMarker,
      close
    };
  }
});
</script>
