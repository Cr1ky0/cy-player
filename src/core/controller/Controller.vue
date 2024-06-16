<script setup lang="ts">
import ProgressBar from '@/core/progress/ProgressBar.vue';
import Mask from '@/core/controller/Mask.vue';
import { provide, ref } from 'vue';

/**
 * 进度条拖拽标志
 */
const isDrag = ref<boolean>(false);
provide('isDrag',isDrag)
</script>

<template>
  <Mask></Mask>
  <div class="cy-player-controller-container">
    <ProgressBar></ProgressBar>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/css/var";
.cy-player-controller-container {
  width: 100%;
  height: $controller-container-height;
  background-color: transparent;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: $top-layer;
}
</style>
