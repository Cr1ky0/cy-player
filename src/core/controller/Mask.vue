<script setup lang="ts">
import {
  HttpLoadState,
  PlayerOption,
  VideoController,
  VideoState,
} from '@/types';
import { computed, inject, Ref, watch } from 'vue';
import SvgIcon from '@/components/svgicon/SvgIcon.vue';
import { useToast } from '@/core/hooks/useToast.ts';

const videoStates = <VideoState>inject('videoStates');
const videoController = <VideoController>inject('videoController');
const playerOption = <PlayerOption>inject('playerOption');
const useful = <Ref>inject('useful');
const httpStates = <HttpLoadState>inject('httpStates');
const isDrag = <Ref>inject('isDrag');
const isError = computed(() => {
  return useful.value !== null && !useful.value;
});
const styles = computed(() => {
  return videoStates.isPlayEnd || isError.value
    ? { backgroundColor: 'rgba(0,0,0,.3)' }
    : undefined;
});
const pos = computed(() => {
  return playerOption.maskIconPlacement
    ? playerOption.maskIconPlacement
    : 'center';
});

const toast = computed(() => {
  return useToast({
    message: `ErrorOccurred! ErrorReason:${httpStates.failReason} HttpCode:${httpStates.httpStateCode}`,
    duration: 200000,
    option: playerOption,
  });
});

watch(isError, () => {
  if (isError.value) {
    toast.value.showToast();
  }
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
    <div v-if="isError" class="cy-player-error">
      <div class="cy-player-error-icon">
        <SvgIcon
          icon-name="close"
          fill="rgba(255,255,255,.8)"
          font-size="50px"
          :style="{ cursor: 'default' }"
        ></SvgIcon>
      </div>
      <div class="cy-player-error-tip">视频出错了</div>
    </div>
    <div v-else-if="videoStates.isWaiting" class="cy-player-loading-icon">
      <SvgIcon
        icon-name="loading"
        fill="rgba(255,255,255,.8)"
        font-size="50px"
        :style="{ cursor: 'default' }"
      ></SvgIcon>
    </div>
    <div v-else-if="videoStates.isPlayEnd" class="cy-player-replay">
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
    <div
      v-else-if="!isDrag && !videoStates.isPlay"
      class="cy-player-pause-icon"
    >
      <SvgIcon
        icon-name="player"
        fill="rgba(255,255,255,.8)"
        font-size="50px"
        :styles="{ cursor: 'default' }"
      ></SvgIcon>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/css/mixin';
@import '@/assets/css/var';

.cy-player-controller-mask {
  @include position(absolute, 0, auto, auto, 0);
  @include selectable(none);
  width: 100%;
  height: 100%;

  .cy-player-replay-icon {
    width: 50px;
    height: 50px;
    margin: auto;
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

  .cy-player-error {
    .cy-player-error-icon {
      @extend .cy-player-replay-icon;
    }

    .cy-player-error-tip {
      @extend .cy-player-replay-tip;
      color: #fff;
    }
  }
}

.cy-player-controller-mask-center {
  @include childCenter;
}

.cy-player-controller-mask-left-top > div {
  @include position(absolute, $y-dist-top, auto, auto, $x-dist);
}

.cy-player-controller-mask-left-bottom > div {
  @include position(absolute, auto, $y-dist-bottom, auto, $x-dist);
}

.cy-player-controller-mask-right-top > div {
  @include position(absolute, $y-dist-top, auto, $x-dist, auto);
}

.cy-player-controller-mask-right-bottom > div {
  @include position(absolute, auto, $y-dist-bottom, $x-dist, auto);
}

.cy-player-controller-mask-center > div {
  @include position(absolute, 50%, auto, auto, 50%);
  transform: translate(-50%, -50%);
}
</style>
