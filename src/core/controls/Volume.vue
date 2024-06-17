<script setup lang="ts">
import SvgIcon from '@/components/svgicon/SvgIcon.vue';
import { computed, inject, ref } from 'vue';
import { VideoController, VideoState } from '@/types';
import VolumeSlider from '@/core/controls/VolumeSlider.vue';

const videoStates = <VideoState>inject('videoStates');
const videoController = <VideoController>inject('videoController');
const mouseEnter = ref<boolean>(false);
const isDrag = ref<boolean>(false);
const isMuted = computed(() => {
  return videoStates.volume === 0;
});

const handleIconClick = () => {
  if (!isMuted.value) {
    videoController.setVolume(0);
  } else {
    const lastVolume = localStorage.getItem('lastVolume');
    if (lastVolume) videoController.setVolume(parseInt(lastVolume));
    else videoController.setVolume(50);
  }
};

const changeIsDrag = (value: boolean) => {
  isDrag.value = value;
};

const handleMouseEnter = () => {
  mouseEnter.value = true;
};

const handleMouseLeave = () => {
  mouseEnter.value = false;
};
</script>

<template>
  <div
    class="cy-player-volume-controller-container"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="cy-player-volume-icon" @click="handleIconClick">
      <SvgIcon
        v-if="!isMuted"
        icon-name="volume"
        fill="rgba(255,255,255,.8)"
        font-size="24px"
      ></SvgIcon>
      <SvgIcon
        v-else
        icon-name="mute"
        fill="rgba(255,255,255,.8)"
        font-size="24px"
      ></SvgIcon>
    </div>
    <VolumeSlider
      v-if="mouseEnter || isDrag"
      :changeIsDrag="changeIsDrag"
    ></VolumeSlider>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/css/mixin';
@import '@/assets/css/var';

.cy-player-volume-controller-container {
  @include selectable(none);
  @include childCenter();
  height: 100%;
  position: relative;
  cursor: pointer;

  //.cy-player-volume-slider-container {
  //  @include position(absolute, 0, auto, auto, 0);
  //  z-index: $top-layer;
  //  transform: translate(-25%, -100%);
  //  background-color: rgba(0, 0, 0, 0.8);
  //  height: 120px;
  //  width: 40px;
  //  border-radius: 3px;
  //  display: flex;
  //  flex-direction: column;
  //  align-items: center;
  //  transition: opacity 0.3s ease;
  //
  //  .cy-player-volume-number {
  //    color: #fff;
  //    font-size: 14px;
  //    padding: 5px 0;
  //  }
  //
  //  .cy-player-volume-progress {
  //    @include childCenter;
  //    position: relative;
  //    height: 60%;
  //    width: 100%;
  //    cursor: pointer;
  //
  //    .cy-player-volume-base {
  //      position: relative;
  //      width: 2px;
  //      height: 100%;
  //      background-color: #fff;
  //
  //      .cy-player-volume-slider {
  //        @include position(absolute, auto, 0, auto, 0);
  //        transform: translate(-40%, 50%);
  //        width: 8px;
  //        height: 8px;
  //        background-color: red;
  //        border-radius: 100%;
  //        cursor: pointer;
  //      }
  //
  //      .cy-player-volume-proportion {
  //        @include position(absolute, auto, 0, auto, 0);
  //        width: 2px;
  //        height: 0;
  //        background-color: red;
  //      }
  //    }
  //  }
  //}
}
</style>
