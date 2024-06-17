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
 * @description 轮询状态刷新计时器，类似curTime这类属性需要监控到连续的变化，不用原生实现
 */
const interval = ref<NodeJS.Timeout | null>(null);
/**
 * @description waiting计时器，playing后一段时间再置为false
 */
const timer = ref<NodeJS.Timeout | null>(null);
/**
 * @description video本身的相关状态
 */
const videoStates = reactive<VideoState>({
  isPlay: option.autoPlay || false, // 是否播放
  isPlayEnd: false, // 是否播放结束
  currentPlayTime: 0, // 当前时间/s
  duration: 0, // 总时长
  bufferedTime: 0, // 缓存时长/s
  volume: 0, // 音量
  isWaiting: false, // 视频播放过程中的暂停
});
/**
 * @description video本身的控制方法
 */
const videoController = reactive<VideoController>({
  load: () => videoRef.value?.load(),
  play: () => videoRef.value?.play(),
  pause: () => videoRef.value?.pause(),
  setVolume: (volume) => {
    if (videoRef.value) {
      // muted状态下始终为0
      const realVolume = volume < 1 ? volume : volume / 100;
      videoRef.value.volume = realVolume;
      videoStates.volume = realVolume;
    }
  },
  setCurTime: (curTime) => {
    if (videoRef.value) videoRef.value.currentTime = curTime;
  },
});
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

// Provide
// provide('videoRef',videoRef);
provide('playerOption', option);
provide('videoController', videoController);
provide('videoStates', videoStates);

// Hooks
const { httpStates, sourceFileType, useful } = useLoad(videoRef, option);
// const { videoStates, videoController } = useVideo(videoRef, option);
const { showToast, closeToast } = useToast({
  message: 'Test',
  duration: 2000000,
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

/*******************  video事件定义 *********************/
/**
 * @description 视频是否播放
 */
const setIsPlay = () => {
  if (videoRef.value) {
    videoStates.isPlay = !videoRef.value.paused;
    if (videoStates.isPlay) videoStates.isPlayEnd = false; // 播放时重置
  }
};
/**
 * @description 视频结束
 */
const setIsPlayEnd = () => {
  if (videoRef.value) videoStates.isPlayEnd = videoRef.value.ended;
};
/**
 *
 * @description 总时长
 */
const setDuration = () => {
  if (videoRef.value) {
    videoStates.duration = videoRef.value.duration || 0;
  }
};

/**
 * @description 缓冲时间
 */
const setBufferedTime = () => {
  if (videoRef.value && videoRef.value.buffered.length >= 1)
    videoStates.bufferedTime = videoRef.value.buffered.end(0) || 0; // 浏览器已经缓冲的媒体数据的最远时间点
};
/**
 * @description 视频播放中的waiting
 */
const onWaiting = () => {
  videoStates.isWaiting = true;
};
/**
 * @description 从waiting恢复播放
 */
const onIsPlaying = () => {
  if (timer.value) clearTimeout(timer.value);
  timer.value = setTimeout(() => {
    videoStates.isWaiting = false; // waiting结束
  }, 100);
};
/********************************************/
// Other funcs
const setVideoStates = (vS: Partial<VideoState>) => {
  if (typeof vS.isPlay === 'boolean') videoStates.isPlay = vS.isPlay;
  if (typeof vS.isPlayEnd === 'boolean') videoStates.isPlayEnd = vS.isPlayEnd;
  if (typeof vS.isWaiting === 'boolean') videoStates.isWaiting = vS.isWaiting;
  if (vS.duration) videoStates.duration = vS.duration;
  if (vS.currentPlayTime) videoStates.currentPlayTime = vS.currentPlayTime;
  if (vS.bufferedTime) videoStates.bufferedTime = vS.bufferedTime;
  if (vS.volume) videoStates.volume = vS.volume;
};

const addEvents = (videoElement: HTMLVideoElement) => {
  videoElement.addEventListener('canplay', setDuration);
  videoElement.addEventListener('progress', setBufferedTime);
  videoElement.addEventListener('pause', setIsPlay);
  videoElement.addEventListener('play', setIsPlay);
  videoElement.addEventListener('ended', setIsPlayEnd);
  videoElement.addEventListener('waiting', onWaiting);
  videoElement.addEventListener('playing', onIsPlaying);
};

const removeEvents = (videoElement: HTMLVideoElement) => {
  videoElement.removeEventListener('canplay', setDuration);
  videoElement.removeEventListener('progress', setBufferedTime);
  videoElement.removeEventListener('pause', setIsPlay);
  videoElement.removeEventListener('play', setIsPlay);
  videoElement.removeEventListener('ended', setIsPlayEnd);
  videoElement.removeEventListener('waiting', onWaiting);
  videoElement.removeEventListener('playing', onIsPlaying);
};

// 监听src重置状态
watch(
  () => option.videoSrc,
  () => {
    // TODO:动态换源
    setVideoStates({
      isPlay: false,
      isPlayEnd: false,
      isWaiting: false,
      duration: 0,
      currentPlayTime: 0,
      bufferedTime: 0,
      volume: 0,
    });
  },
);

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

onMounted(() => {
  const videoElement = <HTMLVideoElement>videoRef.value;
  addEvents(videoElement);
  // interval
  interval.value = setInterval(() => {
    videoStates.currentPlayTime = videoRef.value!.currentTime;
    videoStates.volume = videoRef.value!.volume;
  }, 10);
});

onBeforeUnmount(() => {
  const videoElement = <HTMLVideoElement>videoRef.value;
  removeEvents(videoElement);
  clearInterval(interval.value!);
});
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
