<template>
  <div v-loading="loading" id="trajectoryBaseId" class="map-content">
    <!-- 地图部分 -->
    <div class="map-div" :style="{ width: mapDivWidth + '%' }">
      <mt-init-map @getMap="getMap" :options="options">
        <mt-group-gl-layer></mt-group-gl-layer>
        <mt-vector-layer
          ref="vectorLayerRef"
          id="layer"
          :options="{ enableAltitude: true, zIndex: 2 }"
        ></mt-vector-layer>
        <mt-tianditu-layer
          tk="ec89e7ba91633b147f76d47e08f9f1a1"
          layerType="img"
          :zIndex="1"
        />
      </mt-init-map>
      <mt-router-player
        ref="routePlayerRef"
        :routeData="coordinates"
        :options="routePlayerOptions"
        @routePlayerCreated="getRoutePlayerCreated"
        @playing="playingFun"
      ></mt-router-player>
    </div>

    <!-- 操作部分 -->
    <div
      class="operation-div"
      :style="{ width: operationWidth + '%' }"
      :class="[showOperation ? '' : 'hide-operation-div']"
    >
      <p class="title-style" v-if="showOperation">地图中的操作</p>
      <el-row style="margin-top: 2vh" v-if="showOperation">
        <el-col :span="24" style="margin-top: 2.5vh">
          <span class="label-style">自动设置中心点：</span
          ><el-switch
            v-model="isAutoCenter"
            active-text="打开"
            inactive-text="关闭"
            @change="autoCenterChange"
          />
        </el-col>
        <el-col :span="24" style="margin-top: 2.5vh">
          <span class="label-style">轨迹动画：</span
          ><el-switch
            v-model="isPlay"
            active-text="开始"
            inactive-text="暂停"
            @change="playChange"
          />
        </el-col>
        <el-col :span="24" style="margin-top: 2.5vh">
          <span class="label-style">定位到指定顶点：</span
          ><el-switch
            v-model="positionOne"
            active-text="打开"
            inactive-text="关闭"
            @change="positionChangeOne"
          />
        </el-col>
        <el-col :span="24" style="margin-top: 2.5vh">
          <span class="label-style">定位到指定时间：</span
          ><el-switch
            v-model="positionTwo"
            active-text="打开"
            inactive-text="关闭"
            @change="positionChangeTwo"
          />
        </el-col>
        <el-col :span="24" style="margin-top: 2.5vh">
          <span class="label-style">定位到指定距离：</span
          ><el-switch
            v-model="positionThree"
            active-text="打开"
            inactive-text="关闭"
            @change="positionChangeThree"
          />
        </el-col>
        <el-col
          :span="24"
          style="margin-top: 2.5vh; display: flex; justify-content: flex-start"
        >
          <span class="label-style" style="width: 4vw">速度：</span>
          <el-slider
            v-model="speed"
            style="position: relative; top: -0.5vh"
            @change="speedChange"
            :min="1"
            :max="20"
          ></el-slider>
        </el-col>
        <el-col
          :span="24"
          style="margin-top: 2.5vh; display: flex; justify-content: center"
        >
          <el-button type="primary" @click="finishPlay">完成</el-button>
          <el-button type="primary" style="margin-left: 2vw" @click="replyPlay"
            >重播</el-button
          >
          <el-button
            type="primary"
            style="margin-left: 2vw"
            @click="resetRoutePlay"
            >重置</el-button
          >
        </el-col>
      </el-row>
      <div class="show-operation-div" @click="isShowOperation">
        <i class="right-icon" v-if="showOperation"></i>
        <i class="left-icon" v-else></i>
      </div>
    </div>

    <!-- 弹框 -->
    <div class="infocontent" v-if="infoWindow">
      <i class="close-icon" @click="closeMarkerDataDialog"></i>
      <div class="infopop_title">1号拖拉机</div>
      <div class="infopop_title">拖拉机编号: A103JHR89Y20</div>
      <div class="infopop_title">已作业面积（亩）: 2</div>
      <div class="infopop_title">已作业时间（小时）: 1.5</div>
    </div>
  </div>
</template>
<script setup>
import { LineString, Marker } from "maptalks";
import { ref, onBeforeMount, nextTick, reactive } from "vue";

const loading = ref(true);
const routePlayerRef = ref(null);
const vectorLayerRef = ref(null);

// 跟页面样式和右侧操作模块有关的变量
let mapDivWidth = ref(80);
let operationWidth = ref(20);
let isAutoCenter = ref(false);
let isPlay = ref(false);
let positionOne = ref(false);
let positionTwo = ref(false);
let positionThree = ref(false);
let speed = ref(1);
let modelDisabled = ref(true);
let showOperation = ref(true);
let infoWindow = ref(false);

let routePlayerOptions = reactive({
  speed: 1, // 播放速度
  unitTime: 1, // 单位时间
  debug: false, // 调试
  autoPlay: false, // 自动播放
  repeat: false // 循环播放
});

let map = null;

// 轨迹点数据
let coordinates = ref([
  [120.543189862389, 31.35322014824814],
  [120.54391551057267, 31.35371261270089],
  [120.54506885867931, 31.354451304544426],
  [120.54587139673674, 31.35501763102789],
  [120.54707760663155, 31.355752208849054],
  [120.54825017720657, 31.356441639795918],
  [120.54965341740296, 31.357237762100084],
  [120.55118160364418, 31.35791076744991],
  [120.55261854668379, 31.358306813092582],
  [120.55456885954129, 31.35892438695859],
  [120.55632947631534, 31.359855802165697],
  [120.55739651678448, 31.360529047629626],
  [120.5583272131937, 31.361237721856668],
  [120.55895558146995, 31.36169835723942],
  [120.55950095770982, 31.361779347842656],
  [120.55989220588185, 31.36172872872382],
  [120.56026567004596, 31.361506004277174],
  [120.56086439830915, 31.36083276580959],
  [120.56180695072362, 31.359830492091845],
  [120.56218041488785, 31.359309103054073],
  [120.56241753499216, 31.3585295451185],
  [120.56237028513135, 31.357949524158727],
  [120.5621203930416, 31.357165719008975],
  [120.56187530656894, 31.35647218963217],
  [120.56165424818187, 31.355721202348974],
  [120.56164944256477, 31.355355965928624],
  [120.56182244478077, 31.35513436111691],
  [120.56208675372181, 31.354957897652554],
  [120.56249523117617, 31.354933274817228],
  [120.56287968054517, 31.355052285128153],
  [120.56336024225618, 31.355191814266362],
  [120.56383599835021, 31.355323135619102],
  [120.56411823174483, 31.35531370115811],
  [120.56451108319175, 31.355280752400773],
  [120.56493901066062, 31.355160938640353],
  [120.56587203284698, 31.35481347787183],
  [120.56675594860246, 31.354516937062584],
  [120.56843258245613, 31.353986755709315],
  [120.5700145110502, 31.35345956676693],
  [120.57178585016345, 31.352935370285905],
  [120.57333270273546, 31.352519006427343],
  [120.57448319625848, 31.35221646750327],
  [120.57551793890877, 31.351985818362692],
  [120.57763653064012, 31.351494563762202],
  [120.57919390601887, 31.351198012486947],
  [120.5809512147232, 31.350868509973196],
  [120.58295054797964, 31.35057195672377],
  [120.58502354088239, 31.350356281045975],
  [120.58627224726706, 31.350224478999365],
  [120.5874823700276, 31.350122631836854],
  [120.59152584231651, 31.349856304834162],
  [120.59430413211135, 31.349902525810847],
  [120.59755148381964, 31.349917932798093],
  [120.60048312077856, 31.3501798511941],
  [120.60473173926357, 31.350534210215955],
  [120.60818656066442, 31.350811533736504],
  [120.61173158627935, 31.350981008818707],
  [120.6170265736481, 31.35100411903349],
  [120.62201486668891, 31.350826940574763],
  [120.62405348192806, 31.35069598236899],
  [120.62905561628952, 31.350032419603707],
  [120.62990839532642, 31.34993531589643],
  [120.63024516959456, 31.34983613848371],
  [120.63079647383688, 31.349739949917847],
  [120.63147819413666, 31.349577947900315],
  [120.63169753023317, 31.349400757874122],
  [120.63182201828783, 31.349142566095594],
  [120.63175088225648, 31.34888943621283],
  [120.6315908261862, 31.348656556118982],
  [120.63120550601684, 31.34852999060874],
  [120.63087946587348, 31.34858061683329],
  [120.63070755379783, 31.348707182275376],
  [120.6305178577145, 31.348975500449427],
  [120.63038744165715, 31.349532384782577],
  [120.63034594563885, 31.350043702948568],
  [120.63042300967277, 31.350641081047087],
  [120.63066012977697, 31.351096705859646],
  [120.63095060190471, 31.351552328464862],
  [120.63118772200892, 31.351921887401176],
  [120.63168515539405, 31.35219880544568],
  [120.63248920420028, 31.352608017684105],
  [120.63305772355818, 31.35296867784163],
  [120.63374806849276, 31.353377886729987],
  [120.63403232817177, 31.35341950109344],
  [120.63426785761999, 31.35342643681892],
  [120.63443841342746, 31.353502729765154],
  [120.63498256767002, 31.35356515122058],
  [120.63552415947902, 31.353532455415092],
  [120.63596182529568, 31.35347320158391],
  [120.63661298663283, 31.35320883788225],
  [120.63707733938963, 31.3529216833642],
  [120.6373708957301, 31.352620853881007],
  [120.63744561916224, 31.35236104582563],
  [120.63738157050614, 31.352114911216376],
  [120.63717341237384, 31.351914356613946],
  [120.63692255513729, 31.35184598562907],
  [120.63660764924475, 31.351841427561652],
  [120.63636746678435, 31.35201463396865],
  [120.63623403208419, 31.352383836034647],
  [120.63633544245636, 31.352689224302623],
  [120.63650090148462, 31.3529216833642],
  [120.63683181954116, 31.353199721879236],
  [120.63742426961016, 31.35367375286191],
  [120.63899989912761, 31.35481832702638],
  [120.64019378977923, 31.355581242410636],
  [120.64162320987919, 31.3566631845234],
  [120.64244421131548, 31.357355036087455],
  [120.64279521271169, 31.357767168817503],
  [120.64328515216039, 31.35848527456139],
  [120.64376046655104, 31.359652965234176],
  [120.64456769613616, 31.363272225986208],
  [120.64494602107004, 31.36555252186676],
  [120.64581813599784, 31.36849036625327],
  [120.6465155185075, 31.370868523138512]
]);

let coordinatesData = ref(null);
let coordinateData = ref(null);

// 地图map配置
let options = {
  center: [120.543189862389, 31.35322014824814], // 苏州
  zoom: 17.5,
  spatialReference: {
    projection: "EPSG:4326"
  },
  minZoom: 1,
  maxZoom: 20,
  bearing: -15.299999999999274,
  pitch: 72.0000000000002
};

function getMap(e) {
  map = e;
  if (map.isLoaded()) {
    loading.value = false;
  }
}

onBeforeMount(() => {
  nextTick(() => {
    setTimeout(() => {
      addLine();
    }, 2000);
  });
});

//获取开始点信息、获取线数据
function getRoutePlayerCreated(routerPlayer) {
  coordinatesData.value = routerPlayer.getCoordinates();
  coordinateData.value = routerPlayer.getStartCoordinate();
}

let line = null;
let marker = null;

function addLine() {
  line = new LineString(coordinatesData.value, {
    symbol: {
      lineColor: "red",
      lineWidth: 3,
      lineJoin: "round",
      lineCap: "round",
      lineDasharray: [20, 15, 15],
      lineDashColor: [0.8, 0.5, 0.2, 0],
      lineOpacity: 1
    }
  }).addTo(vectorLayerRef.value.vectorLayer);

  marker = new Marker(coordinateData.value, {
    zIndex: 9,
    symbol: {
      markerFile: "../../../../public/marker/point1.png",
      markerWidth: 50,
      markerHeight: 50
    }
  }).addTo(vectorLayerRef.value.vectorLayer);
  marker.on("click", showMsg);
}

// 轨迹在播放中的事件
function playingFun(e) {
  if (isAutoCenter.value) {
    map.setCenter(e.coordinate);
  }
  marker.setCoordinates(e.coordinate);
}

function isShowOperation() {
  showOperation.value = !showOperation.value;
  if (showOperation.value) {
    mapDivWidth.value = 80;
    operationWidth.value = 20;
  } else {
    mapDivWidth.value = 100;
    operationWidth.value = 0;
  }
}

function showMsg() {
  infoWindow.value = true;
}

function closeMarkerDataDialog() {
  infoWindow.value = false;
}

/**
 * 操作点击事件
 * 开始
 */

// 设置地图中心点
function autoCenterChange() {}
// 轨迹动画
function playChange(val) {
  if (val) {
    modelDisabled.value = false;
    routePlayerRef.value.startPlay();
  } else {
    modelDisabled.value = true;
    routePlayerRef.value.pausePlay();
  }
}
// 完成
function finishPlay() {
  positionOne.value = false;
  positionTwo.value = false;
  positionThree.value = false;
  routePlayerRef.value.finishPlay();
}
// 重播
function replyPlay() {
  positionOne.value = false;
  positionTwo.value = false;
  positionThree.value = false;
  routePlayerRef.value.replayRoutePlay();
}
// 重置
function resetRoutePlay() {
  positionOne.value = false;
  positionTwo.value = false;
  positionThree.value = false;
  routePlayerRef.value.resetPlay();
}
// 速度
function speedChange(val) {
  routePlayerOptions.speed = val;
}

function positionChangeOne(val) {
  if (val) {
    positionTwo.value = false;
    positionThree.value = false;
    routePlayerRef.value.setIndex(20);
  }
}
function positionChangeTwo(val) {
  if (val) {
    positionOne.value = false;
    positionThree.value = false;
    // routePlayerRef.value.setTime(40);
  }
}
function positionChangeThree(val) {
  if (val) {
    positionTwo.value = false;
    positionOne.value = false;
    routePlayerRef.value.setPercent(0.4);
  }
}
</script>

<style lang="scss" scoped>
.main-content {
  margin: 2px 0 0 !important;
}

.map-content {
  width: 100%;
  height: calc(100vh - 0px);
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: flex-start;

  .map-div {
    height: 100%;
  }

  .operation-div {
    height: 100%;
    background: #fff;
    padding: 1vh 1vw;
    box-sizing: border-box;
    position: relative;

    .title-style {
      width: 100%;
      text-align: center;
      font-size: 2.5vh;
      font-weight: 700;
    }

    .label-style {
      font-size: 1.6vh;
      font-weight: 700;
    }

    .show-operation-div {
      width: 5vh;
      height: 5vh;
      background: rgb(64, 158, 255);
      position: absolute;
      top: 50%;
      left: -5vh;
      transform: translateY(-50%);
      cursor: pointer;
      border-top-left-radius: 0.5vw;
      border-bottom-left-radius: 0.5vw;

      .right-icon {
        width: 3vh;
        height: 3vh;
        background: url(../../../assets/imgs/right-icon.png) no-repeat center
          center;
        background-size: 100% 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      .left-icon {
        width: 3vh;
        height: 3vh;
        background: url(../../../assets/imgs/left-icon.png) no-repeat center
          center;
        background-size: 100% 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }

  .hide-operation-div {
    padding: 0;
    box-sizing: border-box;
  }
}
</style>

<style lang="scss">
#trajectoryBaseId {
  .infocontent {
    color: #fff;
    width: 20vw;
    height: 28vh;
    background-color: #051127;
    border: 1px solid #0c2c45;
    position: absolute;
    top: 2vh;
    left: 1vw;

    .close-icon {
      width: 2vh;
      height: 2vh;
      background: url("../../../maptalks/assets/imgs/dialog/modalClose.png")
        no-repeat;
      background-size: 100% 100%;
      position: absolute;
      top: 1vh;
      right: 1vh;
      cursor: pointer;
    }
  }
  .infopop_title {
    float: left;
    padding-left: 10px;
    width: 100%;
    height: 36px;
    line-height: 36px;
    background: url(title.png);
    font-weight: bold;
    font-size: 16px;
  }
  .infopop_time {
    width: 100%;
    height: 30px;
    margin: 0 10px;
    line-height: 36px;
  }
  .infopop_dept {
    padding: 5px;
    line-height: 15px;
    text-align: center;
    border: 1px solid #192b41;
    margin: 0 10px;
    position: absolute;
    bottom: 2vh;
    text-align: center;
  }
  .infopop_arrow {
    float: left;
    width: 15px;
    height: 24px;
    line-height: 24px;
    background: url(arrow.png) no-repeat center center;
  }
}
</style>
