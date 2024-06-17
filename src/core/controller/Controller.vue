<script setup lang="ts">
import ProgressBar from '@/core/progress/ProgressBar.vue';
import Mask from '@/core/controller/Mask.vue';
import { provide, ref } from 'vue';
import Playback from '@/core/controls/Playback.vue';
import Volume from '@/core/controls/volume/Volume.vue';

/**
 * 进度条拖拽标志
 */
const isDrag = ref<boolean>(false);
provide('isDrag', isDrag);
</script>

<template>
  <Mask></Mask>
  <div class="cy-player-controller-container">
    <ProgressBar></ProgressBar>
    <div class="cy-player-controller-controls-container">
      <Playback></Playback>
      <div class="cy-player-controller-controls-function">
        <Volume></Volume>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/css/var';

.cy-player-controller-container {
  width: 96%;
  height: $controller-container-height;
  background-color: transparent;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  z-index: $top-layer;
}

.cy-player-controller-controls-container {
  width: 100%;
  height: $controls-height;
  display: flex;
  justify-content: space-between;

  .cy-player-controller-controls-function{
    height: 100%;
    display: flex;
    justify-content: space-around;
    padding:0 10px;
  }
}
</style>
