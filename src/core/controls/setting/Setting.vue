<script setup lang="ts">
import SvgIcon from '@/components/svgicon/SvgIcon.vue';
import Switch from '@/components/switch/Switch.vue';
import { inject, ref } from 'vue';
import { useLightOff } from '@/core/hooks/useLightOff.ts';
import { VideoState } from 'types';

const videoStates = <VideoState>inject('videoStates');
const showFunc = ref(false);
const { lightOn, handleLightOffModel } = useLightOff();

const handleLoop = () => {
  videoStates.isLoop = !videoStates.isLoop;
  localStorage.setItem('isLoop', String(videoStates.isLoop));
};
</script>

<template>
  <div class="cy-player-controls-setting">
    <SvgIcon
      class="cy-player-controls-setting-icon"
      @click="showFunc = !showFunc"
      icon-name="set"
      fill="rgba(255,255,255,.8)"
      font-size="1.25rem"
    ></SvgIcon>
    <div v-if="showFunc" class="cy-player-controls-setting-function">
      <div
        class="cy-player-controls-setting-light-off"
        @click="handleLightOffModel"
      >
        <div>关灯</div>
        <Switch :flag="lightOn"></Switch>
      </div>
      <div class="cy-player-controls-setting-loop" @click="handleLoop">
        <div>循环播放</div>
        <Switch :flag="videoStates.isLoop"></Switch>
      </div>
    </div>
    <div v-if="showFunc" class="cy-player-controls-setting-bottom"></div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/css/mixin';
@import '@/assets/css/var';

.cy-player-controls-setting {
  @include selectable(none);
  @include childCenter;
  height: 100%;
  position: relative;
  cursor: pointer;
  padding: 0 0.7rem;

  .cy-player-controls-setting-icon {
    transition: transform 0.3s ease;

    &:hover {
      transform: rotateZ(60deg);
    }
  }

  .cy-player-controls-setting-bottom {
    @include xCenterAlign(-100%);
    background-color: transparent;
    width: 7.5rem;
    height: 1.25rem;
    z-index: $top-layer;
  }

  .cy-player-controls-setting-function {
    @include xCenterAlign(-115%);
    color: #fff;
    width: 6.25rem;
    padding: 0.7rem;
    border-radius: 0.2rem;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    flex-direction: column;
    z-index: $top-layer;
    animation: show 0.3s ease;

    > div {
      margin: 0.3rem 0;
    }

    .cy-player-controls-setting-light-off {
      display: flex;
      justify-content: space-between;

      > div:first-child {
        font-size: 0.8rem;
        width: 4.7rem;
        text-align: center;
        letter-spacing: 0.3rem;
      }
    }

    .cy-player-controls-setting-loop {
      @extend .cy-player-controls-setting-light-off;

      > div:first-child {
        letter-spacing: 0.125rem;
      }
    }
  }
}
</style>
