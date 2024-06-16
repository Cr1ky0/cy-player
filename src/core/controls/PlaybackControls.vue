<script setup lang="ts">
import SvgIcon from '@/components/svgicon/SvgIcon.vue';
import { computed, inject, Ref } from 'vue';
import { formatTime } from '@/utils';
import { PlayerOption } from '@/types';
import { useVideo } from '@/core/hooks/useVideo.ts';

const videoRef = <Ref>inject('videoRef');
const playerOption = <PlayerOption>inject('playerOption');
const { videoStates, videoController } = useVideo(videoRef, playerOption);
const curTime = computed(() => {
  return formatTime(Math.floor(videoStates.currentPlayTime));
});
const duration = computed(() => {
  return formatTime(Math.floor(videoStates.duration));
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
        font-size="24px"
        :on-click="handleClick"
      ></SvgIcon>
      <SvgIcon
        v-else
        icon-name="pause"
        fill="#FFF"
        font-size="24px"
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
@import "@/assets/css/mixin";
@import '@/assets/css/var';

.cy-player-playback-controls-container {
  width: 15%;
  display: flex;
  justify-content: space-around;
  align-items: center;

  .cy-player-playback-controls-btn{
    height: 100%;
    @include childCenter;
  }

  .cy-player-playback-controls-time {
    display: flex;
    justify-content: center;
    color: #fff;
    line-height: $controls-height;

    & > div {
      font-size: 13px;
    }
  }
}
</style>
