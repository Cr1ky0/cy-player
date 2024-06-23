<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  useSlots,
  watch,
} from 'vue';
import { PlayerOption, VideoCallback } from '@/types';
import { useCallback } from '@/core/hooks/useCallback.ts';
import { useVideo } from '@/core/hooks/useVideo.ts';
import Controller from '@/core/controller/Controller.vue';
import { useMouseCheck } from '@/utils/useMouseCheck.ts';
import BottomProgress from '@/core/progress/BottomProgress.vue';
import 'virtual:svg-icons-register';
import './index.css';
import Test from '@/core/Test.vue';

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
const { mouseEnter, isMobile } = useMouseCheck(containerRef);
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

// SIZE
const adaptiveVideoSize = (cWidth: number, cHeight: number) => {
  // const cElem = <HTMLDivElement>containerRef.value;
  const vElem = <HTMLVideoElement>videoRef.value;
  // const cWidth = parseFloat(getComputedStyle(cElem).width); // 父元素width,这里video的width始终占满该元素
  // const cHeight = parseFloat(getComputedStyle(cElem).height); // 父元素height
  const ContainerSizeProp = cWidth / cHeight; // 父元素宽长比
  const videoSizeProp = videoStates.videoWidth / videoStates.videoHeight; // video元素宽长比
  // container比例 > video比例：说明video应该按宽度缩放，即height占满父元素，width按视频本身比例缩放（想象一个宽屏里放一个窄视频）
  if (ContainerSizeProp > videoSizeProp) {
    vElem.style.height = cHeight + 'px';
    vElem.style.width = `${cHeight * videoSizeProp}px`; // vW / vH = (vW_ / vH_ )
  }
  // 否则按长度缩放，即width占满父元素，height按视频本身比例缩放（想象一个窄屏里放一个款视频）
  else {
    vElem.style.width = cWidth + 'px';
    vElem.style.height = `${cWidth / videoSizeProp}px`; // vW / vH =  (vH_ / vW_)
  }
};

const setTotalSize = () => {
  const videoElement = <HTMLVideoElement>videoRef.value;
  const videoContainer = <HTMLDivElement>containerRef.value;
  const videoWidth = videoElement.videoWidth;
  const videoHeight = videoElement.videoHeight;
  // container size
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
  // adapt video size
  const cWidth = parseFloat(getComputedStyle(videoContainer).width);
  const cHeight = parseFloat(getComputedStyle(videoContainer).height);
  adaptiveVideoSize(cWidth, cHeight);
};

onMounted(() => {
  // setTotalSize();
  const vElement = <HTMLVideoElement>videoRef.value;
  vElement.addEventListener('canplay', setTotalSize);
  // 移动端修正音量
  if (isMobile.value) videoController.setVolume(80);
});

onBeforeUnmount(() => {
  const vElement = <HTMLVideoElement>videoRef.value;
  vElement.removeEventListener('canplay', setTotalSize);
});

// option size监视
watch([() => option.width, () => option.height], () => {
  setTotalSize();
});

const slots = useSlots();
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
    <!--    <Test></Test>-->
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
  margin: auto;
  //width: 100%;
  //height: 100%;
  object-fit: cover;
}
</style>
