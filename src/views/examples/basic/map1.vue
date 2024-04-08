<template>
  <div class="map-content">
    <mt-init-map>
      <mt-group-gl-layer
        :terrainSwitch="true"
        tk="ec89e7ba91633b147f76d47e08f9f1a1"
      >
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
      </mt-group-gl-layer>
    </mt-init-map>
  </div>
</template>
import { ref } from "vue";
<script setup></script>

<style lang="scss" scoped>
.main-content {
  margin: 2px 0 0 !important;
}

.map-content {
  position: relative;
  width: 100%;
  height: calc(100vh - 86px);
  overflow: hidden;
}
</style>
