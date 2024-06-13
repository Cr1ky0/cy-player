<script setup lang="ts">
import { computed, onMounted, provide, ref, watch } from 'vue';
import { PlayerOption, VideoCallback } from '@/types';
import Hls from 'hls.js';
import { useLoad } from '@/core/hooks/useLoad.ts';
import { useVideo } from '@/core/hooks/useVideo.ts';
import Test from './Test.vue';
import { useCallback } from '@/core/hooks/useCallback.ts';
import { useMandatoryUpdate } from '@/utils/useMandatoryUpdate.ts';

export interface PlayerProps {
  option: PlayerOption;
  callback?: VideoCallback;
}

// Props
const props = defineProps<PlayerProps>();
const option = props.option; // reactive
const callback = props.callback || null; // reactive

// States
const videoRef = ref<HTMLVideoElement>();
const styles = computed(() => {
  return {
    height: `${option.height}px`,
    width: `${option.width}px`,
  };
});
provide('videoRef', videoRef);
provide('playerOption', props.option);

// Hooks
const { httpStates, sourceFileType, isHls } = useLoad(option);
const { videoStates } = useVideo(videoRef, option);
const { key, forceUpdate } = useMandatoryUpdate();
useCallback(videoStates, httpStates, {
  onTimeChange: callback?.onTimeChange,
  onPause: callback?.onPause,
  onPlay: callback?.onPlay,
  onPlayEnd: callback?.onPlayEnd,
  onVolumeChange: callback?.onVolumeChange,
  onError: callback?.onError,
});

// LifeCircle
onMounted(() => {
  // 如果直接在标签上加src，初始化时为空
  // 注意必须在setHls之前执行，因为如果src为空那么attach会失败
  if (videoRef.value) videoRef.value.src = option.videoSrc;
});

// HLS Support
const setHls = (videoElem: HTMLVideoElement) => {
  // 检查浏览器是否支持hls格式
  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(option.videoSrc); // 将视频源加载到 HLS 对象中
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

/**
 * @description 监听option更改，强制刷新组件
 */
watch(
  () => props.option,
  () => {
    forceUpdate();
  },
  { deep: true },
);

</script>

<template>
  <div class="cy-player-container" :style="styles" :key="key">
    <video
      v-if="httpStates.usefulCheck"
      class="cy-player"
      id="cy-player"
      ref="videoRef"
      :autoplay="option.autoPlay"
      muted
    >
      <source :src="option.videoSrc" :type="sourceFileType!" />
    </video>
  </div>
  <!--  TEST PART  -->
  <Test></Test>
  <button @click="httpStates.usefulCheck = false">useful change false</button>
  <button @click="httpStates.usefulCheck = true">useful change true</button>
</template>

<style scoped>
.cy-player {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
