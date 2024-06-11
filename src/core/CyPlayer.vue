<script setup lang="ts">

import {onMounted, ref, VNodeRef} from "vue";
import {PlayerProps} from "@/types";
import Hls from 'hls.js';
import {useVideo} from "@/core/useVideo.ts";


// Props
const props = defineProps<PlayerProps>()
const {videoSrc, autoPlay, videoType} = props.option;

const videoRef = ref<VNodeRef | null>(null)

// hooks
const {
  sourceFile,
  sourceFileType
} = useVideo(videoSrc, videoRef)

// HLS支持
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
  setHls(videoRef.value)
})
</script>

<template>
  <div class="cy-player-container">
    <video class="cy-player" ref="videoRef" :src="videoSrc" :autoplay="autoPlay" muted>
      <source v-if="sourceFile" :src="sourceFile"
              :type="sourceFileType!"/>
    </video>
  </div>
</template>

<style scoped>
.cy-player {
  width: 1000px;
  height: 600px;
}
</style>