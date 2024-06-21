<script setup lang="ts">
import { computed, inject } from 'vue';
import { PlayerOption, VideoState } from '@/types';

const props = defineProps(['mouseEnter']);
const videoStates = <VideoState>inject('videoStates');
const playerOption = <PlayerOption>inject('playerOption');
const themeColorStyle = computed(() => {
  return {
    backgroundColor: playerOption.themeColor
      ? playerOption.themeColor
      : '#00aeec',
  };
});

const keepShow = computed(()=>{
  return typeof playerOption.keepShowController === 'boolean' ? playerOption.keepShowController : false;
})

/**
 * @description 已播放百分比
 */
const completedProportion = computed(() => {
  if (videoStates.duration !== 0)
    return (videoStates.currentPlayTime / videoStates.duration) * 100;
  else return 0;
});
</script>

<template>
  <div v-if="!props.mouseEnter && !keepShow" class="cy-player-bottom-progress">
    <div
      class="cy-player-bottom-progress-completed"
      :style="{ width: `${completedProportion}%`, ...themeColorStyle }"
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

.cy-player-bottom-progress {
  @include position(absolute, auto, 0, auto, 0);
  width: 100%;
  height: 3px;
  background-color: transparent;
  z-index: $top-layer;
  cursor: default;
  animation: show 0.3s ease;

  .cy-player-bottom-progress-completed {
    @include position(absolute, 0, auto, auto, 0);
    width: 0;
    height: 100%;
    background-color: red;
    z-index: $second-top-layer;
    border-radius: 1px;
  }
}
</style>
