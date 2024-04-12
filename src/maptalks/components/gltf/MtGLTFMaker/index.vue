<template>
  <div>
    <slot />
  </div>
</template>

<script>
import { defineComponent, inject, onBeforeUnmount, onBeforeMount, watch, ref, nextTick } from "vue";
import { GLTFMarker } from "@maptalks/gl-layers";
import { v4 as uuidv4 } from "uuid";

export default defineComponent({
  /** 初始化webgl图层组件 */
  name: "mt-gltf-maker",

  props: {
    // 点的id
    id: {
      type: String,
      default: ''
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
        translationL:	[0, 0, 0], //模型在本地坐标系xyz轴上的偏移量
        rotation: [0, 0, 0], //模型在本地坐标系xyz轴上的旋转角度，单位角度
        scale: [1, 1, 1], //模型在本地坐标系xyz轴上的缩放倍数	
        animation: false, //是否开启动画
        animationName: 0, //动画序列名称
        loop: true, //是否开启动画循环
        speed: 1, //动画速度倍数
        fixSizeOnZoom: -1,//在给定级别上固定模型大小，不再随地图缩放而改变，设置为-1时取消
        anchorZ: 'bottom', //模型在z轴上的锚点或对齐点，可选的值： top， bottom
        shadow: true, //是否开启阴影
        bloom: true, //是否开启泛光	
        shader: 'pbr', //模型绘制的shader，可选值：pbr, phong, wireframe
      })
    },
    // 弹框
    infoWindowOptions: {
      type: Object,
      default: () => ({
        custom: true,
        content: '',
      })
    }
  },

  setup(props, context) {
    
    // 获取点ID
    let id = props.id ? props.id : uuidv4().replace(/-/g, "");

    // 初始化gltf三维模型绘制图层
    let gltfMarker = new GLTFMarker(props.point, {
      id: id,
      cursor: 'pointer',
      symbol: props.symbol
    });

    // 监听打点样式
    watch(() => props.symbol, (newSymbol) => {
        if (gltfMarker && newSymbol) {
          gltfMarker.setSymbol(newSymbol)
        }
      },
      { immediate: true }
    );

    // 监听打点样式
    watch(() => props.infoWindowOptions, (newVal) => {
        nextTick(() => {
          if (gltfMarker && newVal) {
            gltfMarker.setInfoWindow(newVal)
          }
        })
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
      if(map && map.isLoaded()) {
        map.on('click', ()=> {
          if(gltfMarker && gltfMarker.getInfoWindow()) {
            gltfMarker.closeInfoWindow();
          }
        })
      }
      // 判断更多图层...
      const gltfLayer = inject("gltfLayer", null);
      // 若是GLTF图层存在则添加到它里面
      if (gltfLayer) {
        gltfLayer.addGeometry(gltfMarker);
        addMouseenter();
        addMouseout();
        addClick();
        return
      }
    };

    // 获取

    // 给点添加鼠标点击事件
    const addClick = () => {
      gltfMarker.on('click', () => {
        gltfMarker.openInfoWindow(gltfMarker.getCoordinates());
      });
    };

    // 给点添加鼠标移入事件
    const addMouseenter = () => {
      gltfMarker.on('mouseenter', gltfMarkerMouseenter);
    };

    // 给点添加鼠标移出事件
    const addMouseout = () => {
      gltfMarker.on('mouseout', gltfMarkerMouseout);
    };

    // 移除地图gltf三维模型绘制图层
    const removeAll = () => {
      if(gltfMarker) {
        gltfMarker.remove();
        gltfMarker = undefined;
      }
    };

    // 点的鼠标移入事件
    const gltfMarkerMouseenter = (e) => {
      gltfMarker.setUniform("polygonFill", [0, 1, 1, 1.0]);
    };

    // 点的鼠标移出事件
    const gltfMarkerMouseout = (e) => {
      gltfMarker.setUniform("polygonFill", [1, 1, 1, 1.0]);
    }

    return {
      gltfMarker,
    }
  }
})

</script>

<style lang="scss" scoped>

</style>

<style lang="scss">
#widowInfoId {
  width: 10vh;
  height: auto;
}
.infocontent{color:#fff;width:20vw;height:20vh;background-color:#051127;border:1px solid #0c2c45}
.infopop_title{float:left;padding-left:10px;width:180px;height:36px;line-height:36px;background:url(title.png);font-weight:bold;font-size:16px}
.infopop_time{float:left;width:183px;height:30px;margin:0 10px;line-height:36px}
.infopop_dept{float:left;padding:5px;max-width:65px;line-height:15px;text-align:center;border:1px solid #192b41;margin:0 10px}
.infopop_arrow{float:left;width:15px;height:24px;line-height:24px;background:url(arrow.png) no-repeat center center}
.infoarrow{display:block;width:17px;height:10px;background:url(em.png) no-repeat;position:absolute;left:50%;margin-left:-5px;bottom:-10px}
</style>