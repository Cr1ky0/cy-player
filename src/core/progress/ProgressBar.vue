<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import { VideoController, VideoState } from '@/types';
import { useMouseHandler } from '@/core/hooks/useMouseHandler.ts';
import { formatTime } from '@/utils';

const videoStates = <VideoState>inject('videoStates');
const videoController = <VideoController>inject('videoController');
const progressRef = ref<HTMLDivElement>();

const { xProp, isDrag, mouseEnter } = useMouseHandler(progressRef, {
  onMouseDown() {
    videoController.pause();
    videoController.setCurTime(moveTime.value);
  },
  onMouseMove() {
    if (isDrag.value) {
      videoController.setCurTime(moveTime.value);
    }
  },
  onMouseUp() {
    if (isDrag.value) videoController.play(); // 要加判断，不然其他地方点击也会play，且要在重置isDrag之前
  },
});
/**
 * @description 已播放百分比
 */
const completedProportion = computed(() => {
  if (videoStates.duration !== 0)
    return (videoStates.currentPlayTime / videoStates.duration) * 100;
  else return 0;
});
/**
 * @description 缓存百分比
 */
const bufferedProportion = computed(() => {
  if (videoStates.duration !== 0)
    return (videoStates.bufferedTime / videoStates.duration) * 100;
  else return 0;
});
/**
 * @description 鼠标移动视频进度
 */
const moveVideoTime = computed(() => {
  return formatTime(Math.floor((xProp.value / 100) * videoStates.duration));
});
/**
 * @description 鼠标点击快进进度
 */
const moveTime = computed(() => {
  return (xProp.value / 100) * videoStates.duration;
});
</script>

<template>
  <div class="cy-player-progress-bar" ref="progressRef">
    <div
      v-if="mouseEnter"
      class="cy-player-progress-indicator"
      :style="{ left: `${xProp}%` }"
    >
      <div class="cy-player-progress-indicator-time">
        {{ moveVideoTime }}
      </div>
      <div class="cy-player-progress-indicator-down"></div>
      <div class="cy-player-progress-indicator-up"></div>
    </div>
    <div
      class="cy-player-progress-slider"
      :style="{ left: `${completedProportion}%` }"
    ></div>
    <div
      class="cy-player-progress-completed"
      :style="{ width: `${completedProportion}%` }"
    ></div>
    <div
      class="cy-player-progress-buffered"
      :style="{ width: `${bufferedProportion}%` }"
    ></div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/css/mixin';
@import '@/assets/css/var';

$progress-base-color: rgba(255, 255, 255, 0.2);
$progress-buffered-color: rgba(255, 255, 255, 0.5);
$progress-indicator-time-color: rgba(0, 0, 0, 0.7);
$progress-slider-diameter: 10px;
$progress-radius: 1.5px;

.cy-player-progress-bar {
  width: 100%;
  height: $progress-bar-height;
  position: relative;
  background-color: $progress-base-color;
  z-index: $top-layer;
  border-radius: $progress-radius;
  cursor: pointer;

  .cy-player-progress-indicator {
    @include selectable(none);
    height: 100%;
    width: 0;
    position: relative;
    z-index: $second-top-layer;
    cursor: default;

    .cy-player-progress-indicator-time {
      @include position(absolute, 0, auto, auto, 0);
      height: 14px;
      line-height: 14px;
      padding: 0 2px;
      font-size: 12px;
      text-align: center;
      background-color: $progress-indicator-time-color;
      color: #fff;
      transform: translate(-50%, -175%);
    }

    .cy-player-progress-indicator-down {
      @include position(absolute, 0, auto, auto, 0);
      transform: translate(-50%, -150%);
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 5px solid red; /* Change the color and size as needed */
    }

    .cy-player-progress-indicator-up {
      @include position(absolute, auto, 0, auto, 0);
      transform: translate(-50%, 150%);
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-bottom: 5px solid red; /* 你可以更改颜色 */
    }
  }

  .cy-player-progress-completed {
    @include position(absolute, 0, auto, auto, 0);
    width: 0;
    height: 100%;
    background-color: red;
    z-index: $second-top-layer;
    border-radius: $progress-radius;
  }

  .cy-player-progress-slider {
    @include position(absolute, 0, auto, 0, auto);
    height: $progress-slider-diameter;
    width: $progress-slider-diameter;
    transform: translate(-50%, -25%);
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 100%;
    z-index: $top-layer;
  }

  .cy-player-progress-buffered {
    @include position(absolute, 0, auto, auto, 0);
    width: 0;
    height: 100%;
    background-color: $progress-buffered-color;
    z-index: $middle-layer;
    border-radius: $progress-radius;
  }
}
</style>
