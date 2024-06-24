<script setup lang="ts">
import { onBeforeUnmount, onMounted, provide, ref, useSlots, watch } from 'vue';
import { PlayerOption, VideoCallback } from '@/types';
import { useCallback } from '@/core/hooks/useCallback.ts';
import { useVideo } from '@/core/hooks/useVideo.ts';
import Controller from '@/core/controller/Controller.vue';
import { useMouseCheck } from '@/utils/useMouseCheck.ts';
import BottomProgress from '@/core/progress/BottomProgress.vue';
import { useSetSize } from '@/core/hooks/useSetSize.ts';
import 'virtual:svg-icons-register';
import './index.css';

export interface PlayerProps {
  option: PlayerOption;
  callback?: VideoCallback;
}

// Props
const props = defineProps<PlayerProps>();
const option = props.option;
const callback = props.callback || null;
// default props
option.videoAutoFix =
  typeof option.videoAutoFix === 'boolean' ? option.videoAutoFix : true;
option.showToast =
  typeof option.showToast === 'boolean' ? option.showToast : true;
option.showProgressFloat =
  typeof option.showProgressFloat === 'boolean'
    ? option.showProgressFloat
    : true;
option.sourceType = option.sourceType || 'h264';
// Refs
const videoRef = ref<HTMLVideoElement>();
const containerRef = ref<HTMLDivElement>();

// Hooks
const { videoStates, videoController } = useVideo(videoRef, option);
const { mouseEnter, isMobile } = useMouseCheck(containerRef);
const { setTotalSize } = useSetSize(
  videoRef,
  containerRef,
  option,
  videoStates,
);
useCallback(videoStates, {
  onTimeChange: callback?.onTimeChange,
  onPause: callback?.onPause,
  onPlay: callback?.onPlay,
  onPlayEnd: callback?.onPlayEnd,
  onVolumeChange: callback?.onVolumeChange,
  onWaiting: callback?.onWaiting,
  onError: callback?.onError,
}); // quality回调在Quality.vue中

// Provide
provide('containerRef', containerRef);
provide('videoRef', videoRef);
provide('playerOption', option);
provide('videoStates', videoStates);
provide('videoController', videoController);
provide('callback',callback);

const handleSize = () => {
  setTotalSize(option.videoAutoFix);
};

onMounted(() => {
  //TODO: 自定义mount
  // 初始化时没有宽高自动设定一个值，避免初始化加载error元素尺寸消失
  if (
    !option.width &&
    !option.height &&
    !option.styles?.height &&
    !option.styles?.width
  ) {
    containerRef.value!.style.width = `800px`;
    containerRef.value!.style.height = `450px`;
  }
  // video size auto fix
  if (option.videoAutoFix) {
    const vElement = <HTMLVideoElement>videoRef.value;
    vElement.addEventListener('canplay', handleSize);
  }
  // 移动端修正音量
  if (isMobile.value) videoController.setVolume(80);
});

onBeforeUnmount(() => {
  if (option.videoAutoFix) {
    const vElement = <HTMLVideoElement>videoRef.value;
    vElement.removeEventListener('canplay', handleSize);
  }
});

// option size监视
watch([() => option.width, () => option.height], () => {
  setTotalSize();
});

const slots = useSlots();
// TODO:自动识别src
</script>

<template>
  <div
    id="cy-player-container"
    class="cy-player-container"
    ref="containerRef"
    :style="{ ...option.styles }"
  >
    <video
      class="cy-player"
      id="cy-player"
      ref="videoRef"
      :src="option.videoSrc"
    >
      <source :src="option.videoSrc" type="video/mp4" />
      <source :src="option.videoSrc" type="video/ogg" />
      <source :src="option.videoSrc" type="video/webm" />
      <source :src="option.videoSrc" type="application/vnd.apple.mpegURL" />
      <source :src="option.videoSrc" type="application/x-mpegURL" />
    </video>
    <Controller :mouseEnter="mouseEnter">
      <template v-for="(_, key) in slots" :key="key" v-slot:[key]>
        <slot :name="key" />
      </template>
    </Controller>
    <BottomProgress v-if="option.showProgressFloat" :mouseEnter="mouseEnter" />
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/css/var';
@import '@/assets/css/mixin';

.cy-player-container-web-fullscreen-active {
  position: fixed !important;
  left: 0 !important;
  top: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  z-index: $top-layer !important;
}

.cy-player-container {
  position: relative;
  //overflow: hidden;
  background-color: #000;
  z-index: $top-layer;
}

.cy-player {
  @include position(absolute, 50%, auto, auto, 50%);
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
