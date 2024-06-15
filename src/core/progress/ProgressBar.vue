<script setup lang="ts">
import { useVideo } from '@/core/hooks/useVideo.ts';
import { computed, h, inject, ref, Ref } from 'vue';
import { PlayerOption } from '@/types';
import { useMouseHandler } from '@/core/hooks/useMouseHandler.ts';
import { formatTime } from '@/utils';

const videoRef = <Ref>inject('videoRef');
const option = <PlayerOption>inject('playerOption');
const progressRef = ref<HTMLDivElement>();
const { videoStates, videoController } = useVideo(videoRef, option);
const { xProp } = useMouseHandler(progressRef);

const mouseEnter = ref<boolean>(false);
/**
 * @description 已播放百分比
 */
const completedProportion = computed(() => {
  return (videoStates.currentPlayTime / videoStates.duration) * 100;
});
/**
 * @description 缓存百分比
 */
const bufferedProportion = computed(() => {
  return (videoStates.bufferedTime / videoStates.duration) * 100;
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
const clickTime = computed(() => {
  return (xProp.value / 100) * videoStates.duration;
});

const onMouseEnter = () => {
  mouseEnter.value = true;
};

const onMouseLeave = () => {
  mouseEnter.value = false;
};

const handleMouseDown = () => {
  videoController.setCurTime(clickTime.value);
};

const handleMouseUp = ()=>{
  videoController.play();
}
</script>

<template>
  <div
    class="cy-player-progress-bar"
    ref="progressRef"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
  >
    <div
      v-if="mouseEnter"
      class="cy-player-progress-indicator"
      :style="{ left: `${xProp}%` }"
    >
      <div class="cy-player-progress-indicator-time">{{ moveVideoTime }}</div>
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
$progress-indicator-time-color: rgba(0, 0, 0, 0.5);
$progress-bar-width: 5px;
$progress-slider-diameter: 10px;
$progress-radius:1.5px;

.cy-player-progress-bar {
  width: 96%;
  margin: auto;
  height: $progress-bar-width;
  position: relative;
  background-color: $progress-base-color;
  z-index: $top-layer;
  cursor: pointer;
  border-radius: $progress-radius;

  .cy-player-progress-indicator {
    @include selectable(none);
    height: 100%;
    width: 1px;
    position: relative;

    .cy-player-progress-indicator-time {
      @include position(absolute, 0, auto, auto, 0);
      width: 50px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      background-color: $progress-indicator-time-color;
      color: #fff;
      transform: translate(-50%, -150%);
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
