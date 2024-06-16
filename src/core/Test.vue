<script setup lang="ts">
import { inject, Ref } from 'vue';
import { PlayerOption, VideoState } from '@/types';
import { useVideo } from '@/core/hooks/useVideo.ts';

// const videoRef = <Ref>inject('videoRef');
// const playerOption = <PlayerOption>inject('playerOption');
// const { videoStates } = useVideo(videoRef, playerOption);
const videoStates = <VideoState>inject('videoStates');
</script>

<template>
  <div style="margin-top: 20px">
    <div>{{ videoStates.currentPlayTime }}</div>
    <div>{{ videoStates.duration }}</div>
    <div>{{ videoStates.bufferedTime }}</div>
    <div>{{ videoStates.volume }}</div>
    <div>{{ videoStates.isPlayEnd }}</div>
    <div>{{ videoStates.isPlay }}</div>
  </div>
</template>

<style scoped></style>
