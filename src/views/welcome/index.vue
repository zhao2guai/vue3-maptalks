<template>
  <div id="homeId">
    <el-card class="m-4 box-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span class="font-medium">基础地图</span>
        </div>
      </template>
      <el-scrollbar>
        <div class="card-wrap">
          <el-card
            class="line-card"
            shadow="hover"
            v-for="(row, index) in baseCards"
            :key="index"
          >
            <template #header>
              <div class="card-header">
                <span>{{ row.title }}</span>
              </div>
            </template>
            <div class="card-content" :id="row.id">
              <img v-if="row.img" class="card-image" :src="row.img" />
              <img v-else class="card-image" :src="noImgUrl" />
            </div>
            <template #footer>作者: {{ row.author }}</template>
          </el-card>
        </div>
      </el-scrollbar>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import router from "@/router";
import { ref } from "vue";
defineOptions({
  name: "Welcome"
});
let noImgUrl = new URL("../../assets/imgs/no-img.png", import.meta.url);
// 地图应用卡片信息数组
let baseCards = ref([
  {
    id: "1",
    title: "天地图-影像",
    path: "",
    img: new URL("../../assets/imgs/tdt-img.png", import.meta.url),
    author: "赵二乖"
  },
  {
    id: "2",
    title: "天地图-深蓝",
    path: "",
    img: new URL("../../assets/imgs/tdt-vec.png", import.meta.url),
    author: "赵二乖"
  },
  {
    id: "3",
    title: "开放街道",
    path: "",
    img: "",
    author: "赵二乖"
  },
  {
    id: "4",
    title: "开放街道-暗黑",
    path: "",
    img: "",
    author: "赵二乖"
  },
  {
    id: "5",
    title: "开放街道-暗黑",
    path: "",
    img: "",
    author: "赵二乖"
  },
  {
    id: "6",
    title: "开放街道-暗黑",
    path: "",
    img: "",
    author: "赵二乖"
  }
]);

// 获取路由信息
console.log(router.getRoutes());

</script>

<style lang="scss" scoped>
.main-content {
  margin: 20px 20px 0 !important;
}
</style>
<style lang="scss">
#homeId {
  .card-wrap {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
  .line-card {
    margin: 2vh 0 0 1.2%;
    height: 100%;
    width: 19%;
    padding: 0;
    .el-card__body {
      padding: 0;
    }
  }
  .line-card:nth-child(5n + 1) {
    margin: 2vh 0 0 0;
  }
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .card-content {
    width: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    .button-center {
      display: none;
      position: absolute;
      min-height: auto;
      top: 40%;
    }
    .card-image {
      width: 100%;
      height: 140px;
      display: block;
    }
    .card-empty {
      width: 100%;
      height: 140px;
      padding: 0;
    }
  }
  .footer-text {
    padding: 0 10px;
  }
}
</style>
