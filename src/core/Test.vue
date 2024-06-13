<script setup lang="ts">
import { inject, Ref, watch } from 'vue';
import { useVideo } from '@/core/hooks/useVideo.ts';
import { PlayerOption } from '@/types';

const props = defineProps(['useful'])
const videoRef = <Ref>inject('videoRef');
const playerOption = <PlayerOption>inject('playerOption');

const { videoStates } = useVideo(videoRef, playerOption);
// watch(()=>props.useful, () => {
//   if (!props.useful.value) {
//     console.log(123);
//     // TODO: 错误弹窗
//   }
// });
</script>

<template>
  <div>
    <div>{{ videoStates.isPlay }}</div>
    <div>{{ videoStates.currentPlayTime }}</div>
    <div>{{ videoStates.duration }}</div>
    <div>{{ videoStates.bufferedTime }}</div>
    <div>{{ videoStates.volume }}</div>
    <div>{{ videoStates.isPlayEnd }}</div>
  </div>
</template>

<style scoped></style>
