<script setup lang="ts">
import SvgIcon from '@/components/svgicon/SvgIcon.vue';
import { computed, inject, Ref } from 'vue';
import { formatTime } from '@/utils';
import { VideoController, VideoState } from '@/types';

const videoStates = <VideoState>inject('videoStates');
const videoController = <VideoController>inject('videoController');
const useful = <Ref>inject('useful');
const curTime = computed(() => {
  return formatTime(Math.floor(videoStates.currentPlayTime));
});
const duration = computed(() => {
  return useful.value
    ? formatTime(Math.floor(videoStates.duration))
    : formatTime(0);
});

const handleClick = () => {
  if (videoStates.isPlay) videoController.pause();
  else videoController.play();
};
</script>

<template>
  <div class="cy-player-playback-controls-container">
    <div class="cy-player-playback-controls-btn">
      <SvgIcon
        v-if="!videoStates.isPlay"
        icon-name="player"
        fill="#FFF"
        font-size="20px"
        :on-click="handleClick"
      ></SvgIcon>
      <SvgIcon
        v-else
        icon-name="pause"
        fill="#FFF"
        font-size="20px"
        :on-click="handleClick"
      ></SvgIcon>
    </div>
    <div class="cy-player-playback-controls-time">
      <div>{{ curTime }}</div>
      <div>&nbsp;/&nbsp;</div>
      <div>{{ duration }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/css/mixin';
@import '@/assets/css/var';

.cy-player-playback-controls-container {
  @include selectable(none);
  display: flex;
  justify-content: space-around;
  align-items: center;

  .cy-player-playback-controls-btn {
    @include childCenter;
    padding:0 10px;
    height: 100%;
  }

  .cy-player-playback-controls-time {
    display: flex;
    justify-content: center;
    color: #fff;
    line-height: $controls-height;
    padding:0 10px;

    & > div {
      font-size: 13px;
    }
  }
}
</style>
