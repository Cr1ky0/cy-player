<script setup lang="ts">
import { onMounted, provide, ref, VNodeRef } from 'vue';
import { PlayerProps } from '@/types';
import Hls from 'hls.js';
import { useLoad } from '@/core/hooks/useLoad.ts';
import { useVideo } from '@/core/hooks/useVideo.ts';
import Test from './Test.vue';

// Props
const props = defineProps<PlayerProps>();
const { videoSrc, autoPlay, videoType, height, width } = props.option;


// States
const videoRef = ref<VNodeRef | null>(null);
provide('videoRef', videoRef);

// hooks
const { usefulCheck, sourceFileType } = useLoad(videoSrc);
const { videoStates } = useVideo(videoRef);

// HLS Support
const setHls = (videoElem: HTMLVideoElement) => {
  if (videoType && videoType === 'hls') {
    // 检查浏览器是否支持hls格式
    if (Hls.isSupported()) {
      var hls = new Hls();
      hls.loadSource(videoSrc); // 将视频源加载到 HLS 对象中
      hls.attachMedia(videoElem); // 将 HLS 对象附加到 videoElem 上
    }
  }
};

onMounted(() => {
  setHls(videoRef.value);
});
</script>

<template>
  <div class="cy-player-container" :style="{ width, height }">
    <video
      class="cy-player"
      id="cy-player"
      ref="videoRef"
      :src="videoSrc"
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
  width: 1000px;
  height: 600px;
}
</style>
