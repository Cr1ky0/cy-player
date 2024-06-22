<script setup lang="ts">
import { onBeforeUnmount, onMounted, provide, ref, useSlots, watch } from 'vue';
import { PlayerOption, VideoCallback } from '@/types';
import { useCallback } from '@/core/hooks/useCallback.ts';
import { useVideo } from '@/core/hooks/useVideo.ts';
import Controller from '@/core/controller/Controller.vue';
import { useMouseCheck } from '@/utils/useMouseCheck.ts';
import BottomProgress from '@/core/progress/BottomProgress.vue';
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

// Refs
/**
 * @description video对象
 */
const videoRef = ref<HTMLVideoElement>();
const containerRef = ref<HTMLDivElement>();

// Hooks
const { videoStates, videoController } = useVideo(videoRef, option);
const { mouseEnter, handleMouseEnter, handleMouseLeave } = useMouseCheck();
useCallback(videoStates, {
  onTimeChange: callback?.onTimeChange,
  onPause: callback?.onPause,
  onPlay: callback?.onPlay,
  onPlayEnd: callback?.onPlayEnd,
  onVolumeChange: callback?.onVolumeChange,
  onWaiting: callback?.onWaiting,
  onError: callback?.onError,
});

// Provide
provide('containerRef', containerRef);
provide('videoRef', videoRef);
provide('playerOption', option);
provide('videoStates', videoStates);
provide('videoController', videoController);

/**
 * @description Set Video Size
 */
const setVideoSize = () => {
  const videoElement = <HTMLVideoElement>videoRef.value;
  const videoContainer = <HTMLDivElement>containerRef.value;
  const videoWidth = videoElement.videoWidth;
  const videoHeight = videoElement.videoHeight;
  if (!option.width && !option.styles?.width)
    videoContainer.style.width = `${videoWidth}px`;
  if (!option.height && !option.styles?.height)
    videoContainer.style.height = `${videoHeight}px`;
  if (option.height) {
    if (typeof option.height === 'number')
      videoContainer.style.height = `${option.height}px`;
    else videoContainer.style.height = option.height;
  }
  if (option.width) {
    if (typeof option.width === 'number')
      videoContainer.style.width = `${option.width}px`;
    else videoContainer.style.width = option.width;
  }
};

onMounted(() => {
  setVideoSize();
  const vElement = <HTMLVideoElement>videoRef.value;
  vElement.addEventListener('canplay', setVideoSize);
});

onBeforeUnmount(() => {
  const vElement = <HTMLVideoElement>videoRef.value;
  vElement.removeEventListener('canplay', setVideoSize);
});

watch([() => option.width, () => option.height], () => {
  setVideoSize();
});

const slots = useSlots();
</script>

<template>
  <div
    id="cy-player-container"
    class="cy-player-container"
    ref="containerRef"
    :style="{ ...option.styles }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <video
      class="cy-player"
      id="cy-player"
      ref="videoRef"
      :autoplay="option.autoPlay"
      :src="option.videoSrc"
    >
      <source :src="option.videoSrc" type="video/mp4" />
      <source :src="option.videoSrc" type="video/ogg" />
      <source :src="option.videoSrc" type="video/webm" />
      <source :src="option.videoSrc" type="video/webm" />
      <source :src="option.videoSrc" type="application/vnd.apple.mpegURL" />
      <source :src="option.videoSrc" type="application/x-mpegURL" />
    </video>
    <Controller :mouseEnter="mouseEnter">
      <template v-for="(_, key) in slots" :key="key" v-slot:[key]>
        <slot :name="key" />
      </template>
    </Controller>
    <BottomProgress :mouseEnter="mouseEnter" />
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/css/var';

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
  z-index: $top-layer;
}

.cy-player {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
