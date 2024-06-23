<script setup lang="ts">
import Volume from '@/core/controls/volume/Volume.vue';
import ControlTool from '@/components/controltool/ControlTool.vue';
import { computed, inject, Ref } from 'vue';
import { useScreenFull } from '@/core/hooks/useScreenFull.ts';
import { useWebScreenFull } from '@/core/hooks/useWebScreenFull.ts';
import { PlayerOption } from '@/types';
import { usePictureInPicture } from '@/core/hooks/usePictureInPicture.ts';
import Setting from '@/core/controls/setting/Setting.vue';
import MultiplePlay from '@/core/controls/multiple/MultiplePlay.vue';
import Quality from '@/core/controls/quality/Quality.vue';

const containerRef = <Ref>inject('containerRef');
const videoRef = <Ref>inject('videoRef');
const playerOption = <PlayerOption>inject('playerOption');

const videoSizeProp = computed(() => {
  const vElem = <HTMLVideoElement>videoRef.value;
  return (vElem.videoWidth / vElem.videoHeight) * 100;
});

const hasQuality = computed(() => {
  return playerOption.quality && playerOption.quality.length > 0;
});
const showSetting = computed(() => {
  return typeof playerOption.isSettingShow === 'boolean'
    ? playerOption.isSettingShow
    : true;
});
const showPicInPic = computed(() => {
  return typeof playerOption.isPicInPicShow === 'boolean'
    ? playerOption.isPicInPicShow
    : true;
});
const showWebScreenFull = computed(() => {
  return typeof playerOption.isWebScreenFullShow === 'boolean'
    ? playerOption.isWebScreenFullShow
    : true;
});
const showScreenFull = computed(() => {
  return typeof playerOption.isScreenFullShow === 'boolean'
    ? playerOption.isScreenFullShow
    : true;
});
const showMultiplePlay = computed(() => {
  return typeof playerOption.isMultiplePlayShow === 'boolean'
    ? playerOption.isMultiplePlayShow
    : true;
});

const { isWebScreenFull, toggleWebScreenFull } = useWebScreenFull(containerRef);
const { togglePictureInPicture } = usePictureInPicture(videoRef, playerOption);
const { isScreenFull, toggleScreenFull } = useScreenFull(
  containerRef,
  playerOption,
);
/**
 * @description 视频缩放调节
 */
const videoScale = () => {
  if (!isScreenFull.value) {
    const elem = <HTMLVideoElement>videoRef.value;
    const eWidth = parseFloat(getComputedStyle(elem).width);
    // 比例设为 当前宽度 / 宽高比 即根据视频宽高比以及当前宽度计算出来的合适高度
    const adaptiveHeight = eWidth / (videoSizeProp.value / 100);
  }
};

const handleScreenFull = () => {
  videoScale();
  toggleScreenFull();
};
</script>

<template>
  <div class="cy-player-controller-controls">
    <Quality v-if="hasQuality" />
    <MultiplePlay v-if="showMultiplePlay" />
    <Volume />
    <Setting v-if="showSetting" />
    <ControlTool
      v-if="showPicInPic"
      active-icon-name="inPicture"
      :flag="true"
      tip="画中画"
      @click="togglePictureInPicture"
    />
    <ControlTool
      v-if="showWebScreenFull"
      active-icon-name="closeWebFullScreen"
      inactive-icon-name="webFullScreen"
      :flag="isWebScreenFull"
      tip="网页全屏"
      @click="toggleWebScreenFull"
    />
    <ControlTool
      v-if="showScreenFull"
      active-icon-name="closeFullScreen"
      inactive-icon-name="fullScreen"
      :flag="isScreenFull"
      tip="全屏"
      @click="handleScreenFull"
    />
  </div>
</template>

<style scoped lang="scss">
.cy-player-controller-controls {
  height: 100%;
  display: flex;
  justify-content: space-around;
}
</style>
