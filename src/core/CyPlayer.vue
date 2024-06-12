<script setup lang="ts">
import { computed, onMounted, provide, ref, watch } from 'vue';
import { PlayerOption, VideoCallback } from '@/types';
import Hls from 'hls.js';
import { useLoad } from '@/core/hooks/useLoad.ts';
import { useVideo } from '@/core/hooks/useVideo.ts';
import Test from './Test.vue';
import { useCallback } from '@/core/hooks/useCallback.ts';

export interface PlayerProps {
  option: PlayerOption;
  callback?: VideoCallback;
}

// Props
const props = defineProps<PlayerProps>();
const { videoSrc, autoPlay, videoType, height, width } = props.option;

// States
const videoRef = ref<HTMLVideoElement>();
const styles = computed(() => {
  return {
    height: `${height}px`,
    width: `${width}px`,
  };
});
provide('videoRef', videoRef);
provide('playerOption', props.option);

// Hooks
const { usefulCheck, sourceFileType, isHls } = useLoad(videoSrc);
const { videoStates } = useVideo(videoRef, { autoPlay });
useCallback(videoStates, {
  onTimeChange: props.callback?.onTimeChange,
  onPause: props.callback?.onPause,
  onPlay: props.callback?.onPlay,
  onPlayEnd: props.callback?.onPlayEnd,
  onVolumeChange: props.callback?.onVolumeChange,
});

// LifeCircle
onMounted(() => {
  // 如果直接在标签上加src，初始化时为空
  // 注意必须在setHls之前执行，因为如果src为空那么attach会失败
  videoRef.value!.src = videoSrc;
});

// HLS Support
const setHls = (videoElem: HTMLVideoElement) => {
  // 检查浏览器是否支持hls格式
  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(videoSrc); // 将视频源加载到 HLS 对象中
    hls.attachMedia(videoElem); // 将 HLS 对象附加到 videoElem 上
  } else {
    //TODO:浏览器不支持操作
    console.log('当前浏览器不支持HLS');
  }
};

// Watch
watch(isHls, () => {
  if (isHls) setHls(videoRef.value!);
});
</script>

<template>
  <div class="cy-player-container" :style="styles">
    <video
      class="cy-player"
      id="cy-player"
      ref="videoRef"
      :autoplay="autoPlay"
      muted
    >
      <source v-if="usefulCheck" :src="videoSrc" :type="sourceFileType!" />
    </video>
  </div>
  <Test></Test>
</template>

<style scoped>
.cy-player {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
