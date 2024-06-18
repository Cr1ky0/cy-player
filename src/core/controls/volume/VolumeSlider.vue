<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue';
import { VideoController, VideoState } from '@/types';
import { useMouseHandler } from '@/core/hooks/useMouseHandler.ts';

export interface VolumeSliderProps {
  changeIsDrag: (value: boolean) => void;
}

const { changeIsDrag } = defineProps<VolumeSliderProps>();
const videoStates = <VideoState>inject('videoStates');
const videoController = <VideoController>inject('videoController');
const progressRef = ref<HTMLDivElement>();
const volumeProportion = computed(() => {
  return videoStates.volume;
});

const { yProp, isDrag } = useMouseHandler(progressRef, {
  onMouseMove: () => {
    if (isDrag.value) videoController.setVolume(100 - yProp.value);
  },
});

watch(isDrag, () => {
  changeIsDrag(isDrag.value);
});

const handleProgressClick = () => {
  videoController.setVolume(100 - yProp.value);
};
</script>

<template>
  <div class="cy-player-volume-slider-container">
    <div class="cy-player-volume-number">
      {{ Math.floor(videoStates.volume) }}
    </div>
    <div
      class="cy-player-volume-progress"
      ref="progressRef"
      @click="handleProgressClick"
    >
      <div class="cy-player-volume-base">
        <div
          class="cy-player-volume-slider"
          :style="{ bottom: `${volumeProportion}%` }"
        ></div>
        <div
          class="cy-player-volume-proportion"
          :style="{ height: `${volumeProportion}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/css/mixin';
@import '@/assets/css/var';

.cy-player-volume-slider-container {
  @include position(absolute, 0, auto, auto, 0);
  z-index: $top-layer;
  transform: translateY(-100%);
  background-color: rgba(0, 0, 0, 0.8);
  height: 120px;
  width: 40px;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: show 0.3s ease;

  .cy-player-volume-number {
    color: #fff;
    font-size: 14px;
    padding: 5px 0;
  }

  .cy-player-volume-progress {
    @include childCenter;
    position: relative;
    height: 60%;
    width: 100%;
    cursor: pointer;

    .cy-player-volume-base {
      position: relative;
      width: 2px;
      height: 100%;
      background-color: #fff;

      .cy-player-volume-slider {
        @include position(absolute, auto, 0, auto, 0);
        transform: translate(-40%, 50%);
        width: 8px;
        height: 8px;
        background-color: red;
        border-radius: 100%;
        cursor: pointer;
      }

      .cy-player-volume-proportion {
        @include position(absolute, auto, 0, auto, 0);
        width: 2px;
        height: 0;
        background-color: red;
      }
    }
  }
}
</style>
