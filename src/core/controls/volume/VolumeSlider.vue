<script setup lang="ts">
import { computed, CSSProperties, inject, ref, watch } from 'vue';
import { PlayerOption, VideoController, VideoState } from 'types';
import { useMouseHandler } from '@/core/hooks/useMouseHandler.ts';
import SvgIcon from '@/components/svgicon/SvgIcon.vue';

export interface VolumeSliderProps {
  changeIsDrag?: (value: boolean) => void;
  styles?: CSSProperties;
  showIcon?:boolean;
}

const { changeIsDrag } = defineProps<VolumeSliderProps>();
const videoStates = <VideoState>inject('videoStates');
const videoController = <VideoController>inject('videoController');
const playerOption = <PlayerOption>inject('playerOption');
const progressRef = ref<HTMLDivElement>();
const volumeProportion = computed(() => {
  return videoStates.volume;
});

const themeColorStyle = computed(() => {
  return {
    backgroundColor: playerOption.themeColor
      ? playerOption.themeColor
      : '#00aeec',
  };
});

const { yProp, isDrag } = useMouseHandler(progressRef, {
  onMouseMove: () => {
    if (isDrag.value) videoController.setVolume(100 - yProp.value);
  },
});

watch(isDrag, () => {
  changeIsDrag && changeIsDrag(isDrag.value);
});

const handleProgressClick = () => {
  videoController.setVolume(100 - yProp.value);
};
</script>

<template>
  <div class="cy-player-volume-slider-container" :style="styles">
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
          :style="{ bottom: `${volumeProportion}%`, ...themeColorStyle }"
        ></div>
        <div
          class="cy-player-volume-proportion"
          :style="{ height: `${volumeProportion}%`, ...themeColorStyle }"
        ></div>
      </div>
    </div>
    <SvgIcon
      v-if="showIcon"
      :styles="{marginTop:'0.2rem'}"
      icon-name="volume"
      fill="#FFF"
      font-size="1.25rem"
    ></SvgIcon>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/css/mixin';
@import '@/assets/css/var';

.cy-player-volume-slider-container {
  @include xCenterAlign(-110%);
  z-index: $top-layer;
  background-color: rgba(0, 0, 0, 0.8);
  height: 7.5rem;
  width: 2.5rem;
  border-radius: 0.2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: show 0.3s ease;

  .cy-player-volume-number {
    color: #fff;
    font-size: 0.85rem;
    padding: 0.3rem 0;
  }

  .cy-player-volume-progress {
    @include childCenter;
    position: relative;
    height: 60%;
    width: 100%;
    cursor: pointer;

    .cy-player-volume-base {
      position: relative;
      width: 0.125rem;
      height: 100%;
      background-color: #fff;

      .cy-player-volume-slider {
        @include position(absolute, auto, 0, auto, 0);
        transform: translate(-40%, 50%);
        width: 0.5rem;
        height: 0.5rem;
        background-color: $default-theme-color;
        border-radius: 100%;
        cursor: pointer;
      }

      .cy-player-volume-proportion {
        @include position(absolute, auto, 0, auto, 0);
        width: 0.125rem;
        height: 0;
        background-color: $default-theme-color;
      }
    }
  }
}
</style>
