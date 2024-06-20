<script setup lang="ts">
import ProgressBar from '@/core/progress/ProgressBar.vue';
import Mask from '@/core/controller/Mask.vue';
import { provide, ref } from 'vue';
import Playback from '@/core/controls/Playback.vue';
import Controls from '@/core/controls/Controls.vue';

defineProps(['mouseEnter']);
/**
 * 进度条拖拽标志
 */
const isDrag = ref<boolean>(false);
provide('isDrag', isDrag);
</script>

<template>
  <Mask />
  <div
    :class="`cy-player-controller-container ${mouseEnter ? 'cy-player-controller-active' : ''}`"
  >
    <ProgressBar />
    <div class="cy-player-controller-controls-container">
      <Playback />
      <Controls />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/css/var';

.cy-player-controller-active {
  opacity: 1 !important;
}

.cy-player-controller-container {
  padding: 0 10px;
  height: $controller-container-height;
  background-color: rgba(0, 0, 0, 0.2);
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  z-index: $top-layer;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.cy-player-controller-controls-container {
  width: 100%;
  height: $controls-height;
  display: flex;
  justify-content: space-between;
}
</style>
