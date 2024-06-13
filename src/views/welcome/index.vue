<template>
  <div id="homeId">
    <CardPage />
  </div>
</template>

<script setup lang="ts">
import CardPage from "@/views/list/card/index.vue";
defineOptions({
  name: "Welcome"
});
</script>

<style lang="scss" scoped>
.main-content {
  margin: 0 !important;
  padding: 20px 20px !important;
}
</style>
<style lang="scss">
#homeId {
  position: relative;
  width: 100%;
  height: calc(100vh - 86px);
  overflow: hidden;
}
</style>
