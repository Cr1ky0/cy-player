<script setup lang="ts">
import { inject, onMounted, Ref } from 'vue';
import { VideoState } from '@/types';

const videoRef = <Ref>inject('videoRef');
const containerRef = <Ref>inject('containerRef');
// const playerOption = <PlayerOption>inject('playerOption');
// const { videoStates } = useVideo(videoRef, playerOption);
const videoStates = <VideoState>inject('videoStates');
onMounted(() => {});

const handleclick = () => {
  // const element = videoRef.value!;
  const element = containerRef.value!;
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    // Firefox
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    // Chrome, Safari and Opera
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    // IE/Edge
    element.msRequestFullscreen();
  }
};
</script>

<template>
  <div style="margin-top: 20px;">
    <div>{{ videoStates.currentPlayTime }}</div>
    <div>{{ videoStates.duration }}</div>
    <div>{{ videoStates.bufferedTime }}</div>
    <div>{{ videoStates.volume }}</div>
    <div>{{ videoStates.isPlayEnd }}</div>
    <div>{{ videoStates.isPlay }}</div>
    <button @click="handleclick">全屏</button>
  </div>
</template>

<style scoped></style>
