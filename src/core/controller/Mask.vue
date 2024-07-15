<script setup lang="ts">
import { PlayerOption, VideoController, VideoState } from 'types';
import { computed, inject, ref, Ref, useSlots, watch } from 'vue';
import SvgIcon from '@/components/svgicon/SvgIcon.vue';
import { useToast } from '@/core/hooks/useToast.ts';
import { Operator, useTouchHandler } from '@/core/hooks/useTouchHandler.ts';
import { formatTime } from '@/utils';
import VolumeSlider from '@/core/controls/volume/VolumeSlider.vue';

const videoStates = <VideoState>inject('videoStates');
const videoController = <VideoController>inject('videoController');
const playerOption = <PlayerOption>inject('playerOption');
const isDrag = <Ref>inject('isDrag');
const styles = computed(() => {
  return videoStates.isPlayEnd || videoStates.isError
    ? { backgroundColor: 'rgba(0,0,0,.3)' }
    : undefined;
});
const pos = computed(() => {
  return playerOption.maskIconPlacement
    ? playerOption.maskIconPlacement
    : 'center';
});

const cusPos = computed(() => {
  return playerOption.customizedItemPlacement
    ? playerOption.customizedItemPlacement
    : 'center';
});

const { showToast } = useToast(playerOption);

const handleClick = () => {
  if (videoStates.isPlay) videoController.pause();
  else videoController.play();
};

watch(
  () => videoStates.isError,
  () => {
    if (videoStates.isError) {
      showToast('视频因未知原因加载失败');
    }
  },
);

// 移动端Touch操作修改音量和progress
const maskContainer = ref<HTMLDivElement>();

const touchStartEffect = (operator: Operator) => {
  if (operator === 'Progress') {
    // 视频暂停并打开isDrag
    videoController.pause();
    isDrag.value = true;
  }
};

const touchEndEffect = (operator: Operator) => {
  if (operator === 'Progress') {
    videoController.play();
    isDrag.value = false;
    showToast(
      `视频快进至:${formatTime(Math.floor(videoStates.currentPlayTime))}`,
    );
  }
  if (operator === 'Volume')
    showToast(`音量调节至:${Math.floor(videoStates.volume)}`);
};

const handleChangeProgress = (xChangeProp: number) => {
  const mutiple = 3; // 操作速率，指定滑动前进的快慢 TODO:后续可以放在参数位置传入
  let curTime =
    videoStates.currentPlayTime + (xChangeProp / 100) * videoStates.duration;
  // 判断是否<=0或超出播放总时长
  curTime =
    curTime <= 0
      ? 0
      : curTime >= videoStates.duration
        ? videoStates.duration
        : curTime;
  // 乘以倍数
  curTime =
    videoStates.currentPlayTime +
    (curTime - videoStates.currentPlayTime) * mutiple;
  videoController.setCurTime(curTime);
};

const handleChangeVolume = (yChangeProp: number) => {
  let curVolume = videoStates.volume - yChangeProp;
  curVolume = curVolume <= 0 ? 0 : curVolume >= 100 ? 100 : curVolume;
  videoController.setVolume(curVolume);
};

const { showVolume } = useTouchHandler(maskContainer, {
  handleChangeProgress,
  handleChangeVolume,
  touchEndEffect,
  touchStartEffect,
});

const volumeStyles = {
  left:'auto',
  right: '10%',
  top: '50%',
  transform: 'translate(0,-50%)',
  height:'9rem',
};

// slots
const slots = useSlots();
</script>

<template>
  <div
    :class="`cy-player-controller-mask cy-player-controller-mask-${pos}`"
    @click="handleClick"
    :style="styles"
    ref="maskContainer"
  >
    <div
      v-if="slots.customized"
      :class="`cy-player-controller-mask-customized cy-player-controller-mask-${cusPos}`"
    >
      <slot name="customized"></slot>
    </div>
    <div v-if="videoStates.isError" class="cy-player-error">
      <slot v-if="slots.error" name="error"></slot>
      <div v-else>
        <div class="cy-player-error-icon">
          <SvgIcon
            icon-name="close"
            fill="rgba(255,255,255,.8)"
            font-size="3rem"
            :style="{ cursor: 'default' }"
          ></SvgIcon>
        </div>
        <div class="cy-player-error-tip">视频出错了</div>
      </div>
    </div>
    <div v-else-if="videoStates.isPlayEnd" class="cy-player-replay">
      <slot v-if="slots.playend" name="playend"></slot>
      <div v-else>
        <div class="cy-player-replay-icon">
          <SvgIcon
            icon-name="replay"
            fill="rgba(255,255,255,.8)"
            font-size="1.875rem"
            :styles="{ cursor: 'default' }"
          ></SvgIcon>
        </div>
        <div class="cy-player-replay-tip">重播</div>
      </div>
    </div>
    <div
      v-else-if="!isDrag && !videoStates.isPlay"
      class="cy-player-pause-icon"
    >
      <slot v-if="slots.paused" name="paused"></slot>
      <SvgIcon
        v-else
        icon-name="player"
        fill="rgba(255,255,255,.8)"
        font-size="3.125rem"
        :styles="{ cursor: 'default' }"
      ></SvgIcon>
    </div>
    <div v-else-if="videoStates.isWaiting" class="cy-player-loading-icon">
      <slot v-if="slots.waiting" name="waiting"></slot>
      <SvgIcon
        v-else
        icon-name="loading"
        fill="rgba(255,255,255,.8)"
        font-size="3rem"
        :style="{ cursor: 'default' }"
      ></SvgIcon>
    </div>
    <VolumeSlider v-if="showVolume" :styles="volumeStyles" :show-icon="true"></VolumeSlider>
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

  .cy-player-controller-mask-customized {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: $top-layer;
  }

  .cy-player-replay-icon {
    width: 3.125rem;
    height: 3.125rem;
    margin: auto;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .cy-player-replay-tip {
    text-align: center;
    font-size: 0.8rem;
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
