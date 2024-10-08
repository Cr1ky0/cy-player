<script setup lang="ts">
import ProgressBar from '@/core/progress/ProgressBar.vue';
import Mask from '@/core/controller/Mask.vue';
import { computed, inject, provide, ref, useSlots } from 'vue';
import Playback from '@/core/controls/Playback.vue';
import Controls from '@/core/controls/Controls.vue';
import { PlayerOption, VideoState } from 'types';

defineProps(['mouseEnter','showController']);
const videoStates = <VideoState>inject('videoStates');
const playerOption = <PlayerOption>inject('playerOption');
const style = computed(() => {
  return playerOption.controllerStyles
    ? playerOption.controllerStyles
    : undefined;
});
const keepShow = computed(() => {
  return typeof playerOption.keepControllerShow === 'boolean'
    ? playerOption.keepControllerShow
    : false;
});
/**
 * 进度条拖拽标志
 */
const isDrag = ref<boolean>(false);
provide('isDrag', isDrag);

const slots = useSlots();
const filteredSlots = Object.keys(slots).reduce(
  (acc, key) => {
    if (key !== 'slider') {
      acc[key] = slots[key];
    }
    return acc;
  },
  {} as Record<string, any>,
);
</script>

<template>
  <Mask>
    <template v-for="(_, key) in filteredSlots" :key="key" v-slot:[key]>
      <slot :name="key" />
    </template>
  </Mask>
  <div
    :class="`cy-player-controller-container ${(mouseEnter || keepShow) && !videoStates.isPlayEnd ? 'cy-player-controller-active' : ''}`"
    :style="style"
    v-if="!videoStates.isError && showController"
  >
    <ProgressBar>
      <template v-if="slots.slider" #slider>
        <slot name="slider"></slot>
      </template>
    </ProgressBar>
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
  padding: 0 0.75rem;
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
