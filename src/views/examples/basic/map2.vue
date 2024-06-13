<template>
  <div v-loading="loading" class="map-content">
    <mt-init-map ref="mapRef" @getMap="getMap">
      <mt-tianditu-layer
        tk="695a9bebe4c75d64d9cada2be2789425"
        layerType="vec"
        cssFilter="sepia(100%) invert(90%)"
      />
      <mt-tianditu-layer
        tk="695a9bebe4c75d64d9cada2be2789425"
        layerType="cva"
        cssFilter="sepia(100%) invert(90%)"
      />
      <mt-tianditu-layer
        tk="695a9bebe4c75d64d9cada2be2789425"
        layerType="ibo"
        cssFilter="sepia(100%) invert(90%)"
      />
    </mt-init-map>
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const loading = ref(true);
const mapRef = ref(null);
let map = null;

function getMap(e) {
  map = e;
  if (map.isLoaded()) {
    loading.value = false;
  }
}

onMounted(() => {});

onBeforeUnmount(() => {
  map = undefined;
});
</script>

<style lang="scss" scoped>
.main-content {
  margin: 2px 0 0 !important;
}

.map-content {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
