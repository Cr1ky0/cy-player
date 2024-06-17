<script setup lang="ts">
import SvgIcon from '@/components/svgicon/SvgIcon.vue';
import { computed, inject, ref } from 'vue';
import { VideoController, VideoState } from '@/types';
import { useMouseHandler } from '@/core/hooks/useMouseHandler.ts';

const videoStates = <VideoState>inject('videoStates');
const videoController = <VideoController>inject('videoController');
const progressRef = ref<HTMLDivElement>();
const mouseEnter = ref<boolean>(false);
const timer = ref<NodeJS.Timeout | null>(null);
const isMuted = computed(() => {
  return videoStates.volume === 0;
});
const volumeProportion = computed(() => {
  return videoStates.volume;
});

const {
  yProp,
  isDrag,
} = useMouseHandler(progressRef, {
  onMouseMove: () => {
    if (isDrag.value) videoController.setVolume(100 - yProp.value);
  },
});

const handleIconClick = () => {
  if (!isMuted.value) {
    videoController.setVolume(0);
  } else {
    const lastVolume = localStorage.getItem('lastVolume');
    if (lastVolume) videoController.setVolume(parseInt(lastVolume));
    else videoController.setVolume(50);
  }
};

const handleProgressClick = () => {
  videoController.setVolume(100 - yProp.value);
};

const handleMouseEnter = () => {
  mouseEnter.value = true;
};

const handleMouseLeave = () => {
  if (timer.value) clearTimeout(timer.value);
  timer.value = setTimeout(() => {
    mouseEnter.value = false;
  }, 200);
};
</script>

<template>
  <div
    class="cy-player-volume-controller-container"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="cy-player-volume-icon" @click="handleIconClick">
      <SvgIcon
        v-if="!isMuted"
        icon-name="volume"
        fill="rgba(255,255,255,.8)"
        font-size="24px"
      ></SvgIcon>
      <SvgIcon
        v-else
        icon-name="mute"
        fill="rgba(255,255,255,.8)"
        font-size="24px"
      ></SvgIcon>
    </div>
    <div
      class="cy-player-volume-slider-container"
    >
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
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/css/mixin';
@import '@/assets/css/var';

.cy-player-volume-controller-container {
  @include selectable(none);
  @include childCenter();
  height: 100%;
  position: relative;
  cursor: pointer;

  .cy-player-volume-slider-container {
    @include position(absolute, 0, auto, auto, 0);
    z-index: $top-layer;
    transform: translate(-25%, -110%);
    background-color: rgba(0, 0, 0, 0.8);
    height: 120px;
    width: 40px;
    border-radius: 3px;
    display: flex;
    flex-direction: column;
    align-items: center;

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
}
</style>
