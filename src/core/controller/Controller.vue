<script setup lang="ts">
import ProgressBar from '@/core/progress/ProgressBar.vue';
import Mask from '@/core/controller/Mask.vue';
</script>

<template>
  <Mask></Mask>
  <div class="cy-player-controller-container">
    <ProgressBar></ProgressBar>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/css/var";
$controller-height: 45px;
.cy-player-controller-container {
  width: 100%;
  height: $controller-height;
  background-color: transparent;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: $top-layer;
}
</style>
