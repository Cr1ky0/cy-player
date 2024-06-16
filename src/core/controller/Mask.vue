<script setup lang="ts">
import { useVideo } from '@/core/hooks/useVideo.ts';
import { PlayerOption } from '@/types';
import { computed, inject, Ref } from 'vue';
import SvgIcon from '@/components/svgicon/SvgIcon.vue';

const videoRef = <Ref>inject('videoRef');
const playerOption = <PlayerOption>inject('playerOption');
const { videoStates, videoController } = useVideo(videoRef, playerOption);
const styles = computed(() => {
  return videoStates.isPlayEnd
    ? { backgroundColor: 'rgba(0,0,0,.3)' }
    : undefined;
});
const pos = computed(() => {
  return playerOption.maskIconPlacement
    ? playerOption.maskIconPlacement
    : 'center';
});
const handleClick = () => {
  if (videoStates.isPlay) videoController.pause();
  else videoController.play();
};
</script>

<template>
  <div
    :class="`cy-player-controller-mask cy-player-controller-mask-${pos}`"
    @click="handleClick"
    :style="styles"
  >
    <div
      v-if="!videoStates.isPlay && !videoStates.isPlayEnd"
      class="cy-player-pause-icon"
    >
      <SvgIcon
        icon-name="player"
        fill="rgba(255,255,255,.8)"
        font-size="50px"
        :styles="{ cursor: 'default' }"
      ></SvgIcon>
    </div>
    <div v-if="videoStates.isPlayEnd" class="cy-player-replay">
      <div class="cy-player-replay-icon">
        <SvgIcon
          icon-name="replay"
          fill="rgba(255,255,255,.8)"
          font-size="30px"
          :styles="{ cursor: 'default' }"
        ></SvgIcon>
      </div>
      <div class="cy-player-replay-tip">重播</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/css/mixin';

.cy-player-controller-mask {
  @include position(absolute, 0, auto, auto, 0);
  width: 100%;
  height: 100%;

  .cy-player-replay-icon {
    width: 50px;
    height: 50px;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .cy-player-replay-tip {
    text-align: center;
    font-size: 16px;
    color: #fff;
  }
}

.cy-player-controller-mask-center {
  @include childCenter;
}

.cy-player-controller-mask-left-top{

}
</style>
