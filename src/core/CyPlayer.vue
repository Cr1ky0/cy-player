<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  provide,
  reactive,
  ref,
  watch,
} from 'vue';
import {
  PlayerOption,
  VideoCallback,
  VideoController,
  VideoState,
} from '@/types';
import { useLoad } from '@/core/hooks/useLoad.ts';
import Test from './Test.vue';
import { useCallback } from '@/core/hooks/useCallback.ts';
import { useToast } from '@/core/hooks/useToast.ts';
import Controller from '@/core/controller/Controller.vue';
import 'virtual:svg-icons-register';
import { useVideo } from '@/core/hooks/useVideo.ts';

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
const { httpStates, sourceFileType, useful } = useLoad(videoRef, option);
const { videoStates, videoController } = useVideo(videoRef, option);
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
provide('videoRef', videoRef);
provide('playerOption', option);
provide('useful', useful);
provide('videoStates',videoStates);
provide('videoController',videoController);

// useful监听:错误弹窗
watch(useful, () => {
  if (!useful.value) {
    // TODO: 错误弹窗及封面
    showToast();
  }
});

// waiting监听
watch(
  () => videoStates.isWaiting,
  () => {
    if (videoStates.isWaiting) {
      // TODO: waiting触发
      console.log('waiting');
    } else {
      // TODO:waiting结束
      console.log('结束waiting');
    }
  },
);

</script>

<template>
  <div id="cy-player-container" class="cy-player-container" :style="styles">
    <video
      class="cy-player"
      id="cy-player"
      ref="videoRef"
      :autoplay="option.autoPlay"
      muted
    >
      <source :src="option.videoSrc" :type="sourceFileType!" />
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

<style scoped>
.cy-player-container {
  position: relative;
}

.cy-player {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
