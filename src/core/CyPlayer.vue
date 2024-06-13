<script setup lang="ts">
import { computed, onMounted, provide, ref, watch } from 'vue';
import { PlayerOption, VideoCallback } from '@/types';
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
const { httpStates, sourceFileType } = useLoad(videoRef, option);
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

// 监听option更改，强制刷新组件
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
      class="cy-player"
      id="cy-player"
      ref="videoRef"
      :autoplay="option.autoPlay"
      muted
    >
      <source :src="option.videoSrc" :type="sourceFileType!" />
    </video>
    <!--  TEST PART  -->
    <Test></Test>
    <button @click="httpStates.usefulCheck = false">useful change false</button>
    <button @click="httpStates.usefulCheck = true">useful change true</button>
  </div>
</template>

<style scoped>
.cy-player {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
