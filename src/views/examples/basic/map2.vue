<template>
  <div class="map-content">
    <mt-init-map tk="ec89e7ba91633b147f76d47e08f9f1a1">
      <mt-group-tile-layer @getLayer="getGroupLayer">
        <mt-tianditu-layer
          tk="ec89e7ba91633b147f76d47e08f9f1a1"
          layerType="img"
        />
        <mt-tianditu-layer
          tk="ec89e7ba91633b147f76d47e08f9f1a1"
          layerType="cia"
        />
        <mt-tianditu-layer
          tk="ec89e7ba91633b147f76d47e08f9f1a1"
          layerType="ibo"
        />
      </mt-group-tile-layer>
    </mt-init-map>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

let group = null;

function getGroupLayer(e) {
  group = e;
  console.log(e);
}

onMounted(() => {});

onBeforeUnmount(() => {
  group = undefined;
});
</script>

<style lang="scss" scoped>
.map-content {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
