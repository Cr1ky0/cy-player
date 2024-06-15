<script setup lang="ts">
import ProgressBar from '@/core/progress/ProgressBar.vue';
</script>

<template>
  <div class="cy-player-controller-container">
    <ProgressBar></ProgressBar>
  </div>
</template>

<style scoped lang="scss">
$controller-height: 50px;
.cy-player-controller-container {
  width: 100%;
  height: $controller-height;
  background-color: transparent;
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>
