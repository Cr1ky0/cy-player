<script setup lang="ts">
import { inject, Ref } from 'vue';
import { useVideo } from '@/core/hooks/useVideo.ts';
import { PlayerOption } from '@/types';

const videoRef = <Ref>inject('videoRef');
const playerOption = <PlayerOption>inject('playerOption');

const { videoStates } = useVideo(videoRef, playerOption);

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
