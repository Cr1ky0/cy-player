<script setup lang="ts">
import { computed, inject, onMounted, ref, Ref } from 'vue';
import { PlayerOption, VideoState } from '@/types';
import { useToast } from '@/core/hooks/useToast.ts';

const videoRef = <Ref>inject('videoRef');
const containerRef = <Ref>inject('containerRef');
const playerOption = <PlayerOption>inject('playerOption');
// const { videoStates } = useVideo(videoRef, playerOption);
const videoStates = <VideoState>inject('videoStates');
const message = ref('当前浏览器不支持全屏！');

const toast = computed(() => {
  return useToast({
    message: message.value,
    duration: 2000,
    option: playerOption,
  });
});
const show1 = () => {
  message.value = '当前浏览器不支持全屏！';
  toast.value.showToast();
};

const show2 = ()=>{
  message.value = '123！';
  toast.value.showToast();
}
</script>

<template>
  <div style="margin-top: 1.25rem">
    <div>{{ videoStates.currentPlayTime }}</div>
    <div>{{ videoStates.duration }}</div>
    <div>{{ videoStates.bufferedTime }}</div>
    <div>{{ videoStates.volume }}</div>
    <div>{{ videoStates.isPlayEnd }}</div>
    <div>{{ videoStates.isPlay }}</div>
    <button @click="show1">show1</button>
    <button @click="show2">show2</button>
  </div>
</template>

<style scoped></style>
