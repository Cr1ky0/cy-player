<script setup lang="ts">
import { useVideo } from '@/core/hooks/useVideo.ts';
import { computed, inject, Ref } from 'vue';
import { PlayerOption } from '@/types';

const videoRef = <Ref>inject('videoRef');
const option = <PlayerOption>inject('playerOption');
const { videoStates, videoController } = useVideo(videoRef, option);
/**
 * @description 完成部分百分比
 */
const completedProportion = computed(() => {
  return videoStates.currentPlayTime / videoStates.duration * 100;
});
</script>

<template>
  <div class="cy-player-progress-bar">
    <div class="cy-player-progress-completed" :style="{width:`${completedProportion}%`}"></div>
    <div class="cy-player-progress-buffered"></div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/css/mixin';
@import '@/assets/css/var';

$progress-base-color: rgba(255, 255, 255, 0.15);
$progress-buffered-color: rgba(255, 255, 255, 0.3);

.cy-player-progress-bar {
  width: 100%;
  height: 7.5%;
  position: relative;
  background-color: $progress-base-color;
  z-index: $top-layer;

  .cy-player-progress-completed {
    @include position(absolute, 0, auto, auto, 0);
    width: 70%;
    height: 100%;
    background-color: red;
    z-index: $top-layer;
  }

  .cy-player-progress-buffered {
    @include position(absolute, 0, auto, auto, 0);
    width: 90%;
    height: 100%;
    background-color: $progress-buffered-color;
    z-index: $second-top-layer;
  }
}
</style>
