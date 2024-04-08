<template>
  <div class="map-content">
    <mt-init-map tk="ec89e7ba91633b147f76d47e08f9f1a1">
      <mt-group-gl-layer
        :terrainSwitch="true"
        tk="ec89e7ba91633b147f76d47e08f9f1a1"
      />
    </mt-init-map>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.map-content {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
