<template>
  <div v-if="false" />
</template>

<script>
import {
  defineComponent,
  onBeforeUnmount,
  onBeforeMount,
  provide,
  inject,
  watch
} from "vue";
import { GLTFMarker } from "@maptalks/gl-layers";
import { buildUUID } from "@pureadmin/utils";

export default defineComponent({
  /** 单个模型打点组件 */
  name: "mt-gltf-maker",
  /** 组件参数 */
  props: {
    // 坐标
    coordinates: {
      type: Array,
      default: () => [0, 0]
    },
    // gltf配置
    options: {
      type: Object,
      default: () => ({
        id: buildUUID(),
        cursor: "pointer",
        symbol: {
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
        }
      })
    },
    // 弹框HTML内容
    infoWindow: {
      type: Object,
      default: () => ({
        // title: "GLTFMarker InfoWindow",
        // autoOpenOn: "", // 解除click绑定
        custom: true,
        content: ""
      })
    }
  },

  setup(props, context) {
    // 获取坐标位置
    let coordinates = props.coordinates ? props.coordinates : [0, 0];
    // 初始化gltf三维模型绘制图层
    let gltfMarker = new GLTFMarker(coordinates, props.options);
    // 获取弹窗配置
    let infoWindow = props.infoWindow ? props.infoWindow : {};
    // 设置弹窗内容
    gltfMarker.setInfoWindow(infoWindow);
    // 注入GLTFMarker对象，以便其他组件获取并使用它。
    provide("gltfMarker", gltfMarker);

    // 监听模型打点位置信息
    watch(
      () => props.coordinates,
      coordinates => {
        if (gltfMarker && coordinates) {
          gltfMarker.setCoordinates(coordinates);
        }
      },
      { immediate: true, deep: true }
    );

    // 监听模型打点配置信息
    watch(
      () => props.options,
      newOptions => {
        if (gltfMarker && newOptions) {
          gltfMarker.setOptions(newOptions);
        }
      },
      { immediate: true, deep: true }
    );

    // 页面加载后执行
    onBeforeMount(() => {
      addGLTFMaker();
      initEvents();
    });

    // 页面元素销毁之前执行
    onBeforeUnmount(() => {
      removeAll();
    });

    // 将gltfMaker点添加到gltflayer中
    const addGLTFMaker = () => {
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
      if (gltfLayer && gltfMarker) {
        gltfLayer.addGeometry(gltfMarker);
        return;
      }
    };

    // 初始化模型组件事件
    const initEvents = () => {
      if (!gltfMarker) return;
      // 添加load事件
      gltfMarker.on("load", event => context.emit("load", event));
      // GLTFMarker添加到图层的事件
      gltfMarker.on("add", event => context.emit("add", event));
      // 给点添加鼠标点击事件
      gltfMarker.on("click", event => context.emit("click", event));
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
      // mouseover事件
      gltfMarker.on("mouseover", event => context.emit("mouseover", event));
      // mousedown事件
      gltfMarker.on("mousedown", event => context.emit("mousedown", event));
      // mouseup事件
      gltfMarker.on("mouseup", event => context.emit("mouseup", event));
      // mousemove事件
      gltfMarker.on("mousemove", event => context.emit("mousemove", event));
      // 双击模型事件
      gltfMarker.on("dblclick", event => context.emit("dblclick", event));
      // contextmenu事件
      gltfMarker.on("contextmenu", event => context.emit("contextmenu", event));
      // touchstart事件
      gltfMarker.on("touchstart", event => context.emit("touchstart", event));
      // touchmove事件
      gltfMarker.on("touchmove", event => context.emit("touchmove", event));
      // touchend事件
      gltfMarker.on("touchend", event => context.emit("touchend", event));
      // 图形id变化事件
      gltfMarker.on("idchange", event => context.emit("idchange", event));
      // 图形属性数据变化事件
      gltfMarker.on("propertieschange", event =>
        context.emit("propertieschange", event)
      );
      // 图形显示事件
      gltfMarker.on("show", event => context.emit("show", event));
      // 图形隐藏事件
      gltfMarker.on("hide", event => context.emit("hide", event));
      // 图形zIndex变化事件
      gltfMarker.on("zindexchange", event =>
        context.emit("zindexchange", event)
      );
      // 图形开始移除事件
      gltfMarker.on("removestart", event => context.emit("removestart", event));
      // 图形移除结束事件
      gltfMarker.on("removeend", event => context.emit("removeend", event));
      // 图形移除事件，它在 removeend 后抛
      gltfMarker.on("remove", event => context.emit("remove", event));
      // 图形shape发生变化时，例如增加删除新的端点，修改某个端点位置时
      gltfMarker.on("shapechange", event => context.emit("shapechange", event));
      // 图形position发生变化时，即整体移动，但形状不变时
      gltfMarker.on("positionchange", event =>
        context.emit("positionchange", event)
      );
      // 图形的symbol变化事件
      gltfMarker.on("symbolchange", event =>
        context.emit("symbolchange", event)
      );
      // 编辑开始事件
      gltfMarker.on("editstart", event => context.emit("editstart", event));
      // 编辑结束事件
      gltfMarker.on("editend", event => context.emit("editend", event));
      // 取消编辑事件
      gltfMarker.on("canceledit", event => context.emit("canceledit", event));
      // 重做编辑事件
      gltfMarker.on("redoedit", event => context.emit("redoedit", event));
      // 撤销编辑事件
      gltfMarker.on("undoedit", event => context.emit("undoedit", event));
      // 拖拽开始事件
      gltfMarker.on("dragstart", event => context.emit("dragstart", event));
      // 正在拖拽事件
      gltfMarker.on("dragging", event => context.emit("dragging", event));
      // 拖拽结束事件
      gltfMarker.on("dragend", event => context.emit("dragend", event));
      // 动画开始事件
      gltfMarker.on("animatestart", event =>
        context.emit("animatestart", event)
      );
      // 动画正在进行事件
      gltfMarker.on("animating", event => context.emit("animating", event));
      // 动画结束事件
      gltfMarker.on("animateend", event => context.emit("animateend", event));
      // 编辑手柄的拖动开始事件
      gltfMarker.on("handledragstart", event =>
        context.emit("handledragstart", event)
      );
      // 编辑手柄的正在拖动事件
      gltfMarker.on("handledragging", event =>
        context.emit("handledragging", event)
      );
      // 编辑手柄的拖动结束事件
      gltfMarker.on("handledragend", event =>
        context.emit("handledragend", event)
      );
      // 有编辑产生，并记录到编辑历史中的事件
      gltfMarker.on("editrecord", event => context.emit("editrecord", event));
    };

    // 移除地图gltf三维模型绘制图层
    const removeAll = () => {
      if (gltfMarker) {
        close();
        gltfMarker.remove();
        gltfMarker = undefined;
      }
    };

    // 打开模型的弹窗
    const open = () => {
      if (gltfMarker && gltfMarker.getInfoWindow()) {
        gltfMarker.openInfoWindow(gltfMarker.getCoordinates());
      }
    };

    // 关闭模型的弹窗
    const close = () => {
      if (gltfMarker && gltfMarker.getInfoWindow()) {
        gltfMarker.closeInfoWindow();
      }
    };

    return {
      gltfMarker,
      close,
      open
    };
  }
});
</script>
