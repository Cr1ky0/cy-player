<script setup lang="ts">
import { computed, inject, Ref, ref, useSlots, watch } from 'vue';
import { PlayerOption, VideoController, VideoState } from 'types';
import { useMouseHandler } from '@/core/hooks/useMouseHandler.ts';
import { formatTime } from '@/utils';

const videoStates = <VideoState>inject('videoStates');
const videoController = <VideoController>inject('videoController');
const progressDrag = <Ref>inject('isDrag');
const playerOption = <PlayerOption>inject('playerOption');
const progressRef = ref<HTMLDivElement>();

const themeColor = computed(() => {
  return playerOption.themeColor || '#00aeec';
});

const showSlider = ref<boolean>(false);
const { xProp, isDrag, mouseEnter } = useMouseHandler(progressRef, {
  onMouseDown() {
    videoController.pause();
    videoController.setCurTime(moveTime.value);
  },
  onMouseMove() {
    if (isDrag.value) {
      // 不让100%进度状态设置以免视频处于播放结束状态拖动时出现bug
      if (xProp.value < 100) videoController.setCurTime(moveTime.value);
    }
  },
  onMouseUp() {
    if (isDrag.value && !videoStates.isPlayEnd) videoController.play(); // 要加判断，不然其他地方点击也会play，且要在重置isDrag之前
  },
});

// 计时显示关闭
const timer = ref<NodeJS.Timeout | null>(null);
watch(mouseEnter, () => {
  if (timer.value) clearTimeout(timer.value);
  timer.value = setTimeout(() => {
    showSlider.value = mouseEnter.value;
  }, 200);
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

watch(isDrag, () => {
  progressDrag.value = isDrag.value;
});

const slots = useSlots();
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
      <div
        class="cy-player-progress-indicator-down"
        :style="{ borderTopColor: themeColor }"
      ></div>
      <div
        class="cy-player-progress-indicator-up"
        :style="{ borderBottomColor: themeColor }"
      ></div>
    </div>
    <Transition>
      <div
        v-if="slots.slider"
        v-show="showSlider || isDrag"
        class="cy-player-progress-slider-base"
        :style="{
          left: `${completedProportion}%`,
        }"
      >
        <slot name="slider"></slot>
      </div>
      <div
        v-else
        v-show="showSlider || isDrag"
        class="cy-player-progress-slider-base cy-player-progress-slider"
        :style="{
          left: `${completedProportion}%`,
          backgroundColor: themeColor,
        }"
      ></div>
    </Transition>
    <div
      class="cy-player-progress-completed"
      :style="{ width: `${completedProportion}%`, backgroundColor: themeColor }"
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

$progress-base-color: rgba(255, 255, 255, 0.3);
$progress-buffered-color: rgba(255, 255, 255, 0.5);
$progress-indicator-time-color: rgba(0, 0, 0, 0.7);
$progress-slider-diameter: 0.7rem;
$progress-radius: 0.1rem;

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
      height: 1rem;
      line-height: 1rem;
      padding: 0 0.15rem;
      font-size: 0.75rem;
      text-align: center;
      background-color: $progress-indicator-time-color;
      color: #fff;
      transform: translate(-50%, -175%);
    }

    .cy-player-progress-indicator-down {
      @include position(absolute, 0, auto, auto, 0);
      transform: translate(-50%, -200%);
      width: 0;
      height: 0;
      border-left: 0.3rem solid transparent;
      border-right: 0.3rem solid transparent;
      border-top: 0.3rem solid $default-theme-color; /* Change the color and size as needed */
    }

    .cy-player-progress-indicator-up {
      @include position(absolute, auto, 0, auto, 0);
      transform: translate(-50%, 200%);
      width: 0;
      height: 0;
      border-left: 0.3rem solid transparent;
      border-right: 0.3rem solid transparent;
      border-bottom: 0.3rem solid $default-theme-color; /* 你可以更改颜色 */
    }
  }

  .cy-player-progress-completed {
    @include position(absolute, 0, auto, auto, 0);
    width: 0;
    height: 100%;
    background-color: $default-theme-color;
    z-index: $second-top-layer;
    border-radius: $progress-radius;
  }

  .cy-player-progress-slider-base {
    @include position(absolute, 50%, auto, auto, 0);
    transform: translate(-50%, -50%);
    z-index: $top-layer;
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
  }

  .cy-player-progress-slider {
    height: $progress-slider-diameter;
    width: $progress-slider-diameter;
    background-color: $default-theme-color;
    border-radius: 100%;
  }

  /* 用vue3格式的transition，出现时会闪现，这里沿用vue2格式的 */
  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }

  .v-enter-to,
  .v-leave-from {
    opacity: 1;
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
