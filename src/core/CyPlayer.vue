<script setup lang="ts">
import { computed, onMounted, provide, ref, watch } from 'vue';
import { PlayerOption, VideoCallback } from '@/types';
import { useLoad } from '@/core/hooks/useLoad.ts';
import Test from './Test.vue';
import { useCallback } from '@/core/hooks/useCallback.ts';
import { useToast } from '@/core/hooks/useToast.ts';
import { useVideo } from '@/core/hooks/useVideo.ts';
import Controller from '@/core/controller/Controller.vue';
import 'virtual:svg-icons-register';

export interface PlayerProps {
  option: PlayerOption;
  callback?: VideoCallback;
}

// Props
const props = defineProps<PlayerProps>();
const option = props.option; // reactive
const callback = props.callback || null; // reactive

// Refs
/**
 * @description video对象
 */
const videoRef = ref<HTMLVideoElement>();
const containerRef = ref<HTMLDivElement>();
/**
 * @description 播放器的size以及其他styles
 */
const styles = computed(() => {
  let width, height;
  if (option.width) {
    if (typeof option.width === 'string') width = option.width;
    else width = `${option.width}px`;
  }
  if (option.height) {
    if (typeof option.height === 'string') height = option.height;
    else height = `${option.height}px`;
  }
  if (!option.width && !option.height) {
    width = 'auto';
    height = 'auto';
  }
  return { width, height, ...option.styles };
});

// Hooks
const { httpStates, useful, loadVideo } = useLoad(videoRef, option);
const { videoStates, videoController } = useVideo(videoRef, option, loadVideo);
const { showToast, closeToast } = useToast({
  message: 'Test',
  duration: 2000,
  option,
});
useCallback(useful, videoStates, httpStates, {
  onTimeChange: callback?.onTimeChange,
  onPause: callback?.onPause,
  onPlay: callback?.onPlay,
  onPlayEnd: callback?.onPlayEnd,
  onVolumeChange: callback?.onVolumeChange,
  onLoaded: callback?.onLoaded,
  onError: callback?.onError,
});

// Provide
provide('containerRef', containerRef);
provide('videoRef', videoRef);
provide('playerOption', option);
provide('useful', useful);
provide('httpStates', httpStates);
provide('videoStates', videoStates);
provide('videoController', videoController);
</script>

<template>
  <div
    id="cy-player-container"
    class="cy-player-container"
    ref="containerRef"
    :style="styles"
  >
    <video
      class="cy-player"
      id="cy-player"
      ref="videoRef"
      :autoplay="option.autoPlay"
    >
      <source src="" type="" />
    </video>
    <Controller></Controller>
    <!--  TEST PART  -->
    <Test></Test>
    <button @click="showToast">showToast</button>
    <button @click="closeToast">closeToast</button>
    <button @click="videoController.play">开始</button>
    <button @click="videoController.pause">暂停</button>
    <button @click="videoController.setCurTime(0)">时间调0</button>
    <button @click="videoController.setVolume(0)">设置音量为0</button>
    <button @click="videoController.setVolume(50)">设置音量为50</button>
    <button @click="videoController.setVolume(100)">设置音量为100</button>
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
