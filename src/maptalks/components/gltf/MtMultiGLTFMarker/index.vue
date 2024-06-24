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
import { MultiGLTFMarker } from "@maptalks/gl-layers";

export default defineComponent({
  /** 初始化webgl图层组件 */
  name: "mt-multi-gltf-maker",

  props: {
    // 模型组数据
    data: {
      type: Array,
      default: []
    },
    // 模型组配置
    options: {
      type: Object,
      default: null
    },
    // 弹框HTML内容
    content: {
      type: String,
      default: ""
    }
  },

  setup(props, context) {
    // 获取模型数据
    let data = props.data ? props.data : [];
    // 获取配置信息
    let options = props.options ? props.options : null;
    // 初始化gltf三维模型绘制图层
    let multiGLTFMarker = new MultiGLTFMarker(data, options);
    // 设置弹窗内容
    multiGLTFMarker.setInfoWindow({
      // autoOpenOn: "", // 解除click绑定
      custom: true,
      content: props.content
    });
    // 向父组件提供多三维模型组对象
    provide("multiGLTFMarker", multiGLTFMarker);

    // 监听三维模型组的配置信息
    watch(
      () => props.options,
      newOptions => {
        if (multiGLTFMarker && newOptions) {
          multiGLTFMarker.setOptions(newOptions);
        }
      },
      { immediate: true, deep: true }
    );

    // 页面加载后执行
    onBeforeMount(() => {
      addMultiGLTFMarker();
      initEvents();
    });

    // 页面元素销毁之前执行
    onBeforeUnmount(() => {
      removeAll();
    });

    // 将MultiGLTFMarker模型组添加到gltflayer中
    const addMultiGLTFMarker = () => {
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
        gltfLayer.addGeometry(multiGLTFMarker);
        return;
      }
    };

    // 初始化模型组件事件
    const initEvents = () => {
      if (!multiGLTFMarker) return;
      // 添加load事件
      multiGLTFMarker.on("load", event => context.emit("load", event));
      // multiGLTFMarker添加到图层的事件
      multiGLTFMarker.on("add", event => context.emit("add", event));
      // 给点添加鼠标点击事件
      multiGLTFMarker.on("click", event => context.emit("click", event));
      // 给点添加鼠标移入事件
      multiGLTFMarker.on("mouseenter", event => {
        multiGLTFMarker.setUniform("polygonFill", [0, 1, 1, 1.0]);
        context.emit("mouseenter", event);
      });
      // 给点添加鼠标移出事件
      multiGLTFMarker.on("mouseout", event => {
        multiGLTFMarker.setUniform("polygonFill", [1, 1, 1, 1.0]);
        context.emit("mouseout", event);
      });
      // mouseover事件
      multiGLTFMarker.on("mouseover", event =>
        context.emit("mouseover", event)
      );
      // mousedown事件
      multiGLTFMarker.on("mousedown", event =>
        context.emit("mousedown", event)
      );
      // mouseup事件
      multiGLTFMarker.on("mouseup", event => context.emit("mouseup", event));
      // mousemove事件
      multiGLTFMarker.on("mousemove", event =>
        context.emit("mousemove", event)
      );
      // 双击模型事件
      multiGLTFMarker.on("dblclick", event => context.emit("dblclick", event));
      // contextmenu事件
      multiGLTFMarker.on("contextmenu", event =>
        context.emit("contextmenu", event)
      );
      // touchstart事件
      multiGLTFMarker.on("touchstart", event =>
        context.emit("touchstart", event)
      );
      // touchmove事件
      multiGLTFMarker.on("touchmove", event =>
        context.emit("touchmove", event)
      );
      // touchend事件
      multiGLTFMarker.on("touchend", event => context.emit("touchend", event));
      // 图形id变化事件
      multiGLTFMarker.on("idchange", event => context.emit("idchange", event));
      // 图形属性数据变化事件
      multiGLTFMarker.on("propertieschange", event =>
        context.emit("propertieschange", event)
      );
      // 图形显示事件
      multiGLTFMarker.on("show", event => context.emit("show", event));
      // 图形隐藏事件
      multiGLTFMarker.on("hide", event => context.emit("hide", event));
      // 图形zIndex变化事件
      multiGLTFMarker.on("zindexchange", event =>
        context.emit("zindexchange", event)
      );
      // 图形开始移除事件
      multiGLTFMarker.on("removestart", event =>
        context.emit("removestart", event)
      );
      // 图形移除结束事件
      multiGLTFMarker.on("removeend", event =>
        context.emit("removeend", event)
      );
      // 图形移除事件，它在 removeend 后抛
      multiGLTFMarker.on("remove", event => context.emit("remove", event));
      // 图形shape发生变化时，例如增加删除新的端点，修改某个端点位置时
      multiGLTFMarker.on("shapechange", event =>
        context.emit("shapechange", event)
      );
      // 图形position发生变化时，即整体移动，但形状不变时
      multiGLTFMarker.on("positionchange", event =>
        context.emit("positionchange", event)
      );
      // 图形的symbol变化事件
      multiGLTFMarker.on("symbolchange", event =>
        context.emit("symbolchange", event)
      );
      // 编辑开始事件
      multiGLTFMarker.on("editstart", event =>
        context.emit("editstart", event)
      );
      // 编辑结束事件
      multiGLTFMarker.on("editend", event => context.emit("editend", event));
      // 取消编辑事件
      multiGLTFMarker.on("canceledit", event =>
        context.emit("canceledit", event)
      );
      // 重做编辑事件
      multiGLTFMarker.on("redoedit", event => context.emit("redoedit", event));
      // 撤销编辑事件
      multiGLTFMarker.on("undoedit", event => context.emit("undoedit", event));
      // 拖拽开始事件
      multiGLTFMarker.on("dragstart", event =>
        context.emit("dragstart", event)
      );
      // 正在拖拽事件
      multiGLTFMarker.on("dragging", event => context.emit("dragging", event));
      // 拖拽结束事件
      multiGLTFMarker.on("dragend", event => context.emit("dragend", event));
      // 动画开始事件
      multiGLTFMarker.on("animatestart", event =>
        context.emit("animatestart", event)
      );
      // 动画正在进行事件
      multiGLTFMarker.on("animating", event =>
        context.emit("animating", event)
      );
      // 动画结束事件
      multiGLTFMarker.on("animateend", event =>
        context.emit("animateend", event)
      );
      // 编辑手柄的拖动开始事件
      multiGLTFMarker.on("handledragstart", event =>
        context.emit("handledragstart", event)
      );
      // 编辑手柄的正在拖动事件
      multiGLTFMarker.on("handledragging", event =>
        context.emit("handledragging", event)
      );
      // 编辑手柄的拖动结束事件
      multiGLTFMarker.on("handledragend", event =>
        context.emit("handledragend", event)
      );
      // 有编辑产生，并记录到编辑历史中的事件
      multiGLTFMarker.on("editrecord", event =>
        context.emit("editrecord", event)
      );
    };

    // 移除地图gltf三维模型绘制图层
    const removeAll = () => {
      if (multiGLTFMarker) {
        multiGLTFMarker.remove();
        multiGLTFMarker = undefined;
      }
    };

    // 打开模型的弹窗
    const open = () => {
      if (multiGLTFMarker && multiGLTFMarker.getInfoWindow()) {
        multiGLTFMarker.openInfoWindow(multiGLTFMarker.getLastCoordinate());
      }
    };

    // 关闭模型的弹窗
    const close = () => {
      if (multiGLTFMarker && multiGLTFMarker.getInfoWindow()) {
        multiGLTFMarker.closeInfoWindow();
      }
    };

    return {
      multiGLTFMarker,
      close,
      open
    };
  }
});
</script>
