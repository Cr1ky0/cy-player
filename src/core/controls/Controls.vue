<script setup lang="ts">
import Volume from '@/core/controls/volume/Volume.vue';
import ControlTool from '@/components/controltool/ControlTool.vue';
import { inject, Ref } from 'vue';
import { useScreenFull } from '@/core/hooks/useScreenFull.ts';
import { useWebScreenFull } from '@/core/hooks/useWebScreenFull.ts';
import { PlayerOption } from '@/types';
import { usePictureInPicture } from '@/core/hooks/usePictureInPicture.ts';

const containerRef = <Ref>inject('containerRef');
const videoRef = <Ref>inject('videoRef');
const playerOption = <PlayerOption>inject('playerOption');
const { isScreenFull, toggleScreenFull } = useScreenFull(
  containerRef,
  playerOption,
);
const { isWebScreenFull, toggleWebScreenFull } = useWebScreenFull(containerRef);
const { togglePictureInPicture } = usePictureInPicture(
  videoRef,
  playerOption,
);
</script>

<template>
  <div class="cy-player-controller-controls">
    <Volume></Volume>
    <ControlTool
      active-icon-name="inPicture"
      :flag="true"
      tip="画中画"
      @click="togglePictureInPicture"
    />
    <ControlTool
      active-icon-name="closeWebFullScreen"
      inactive-icon-name="webFullScreen"
      :flag="isWebScreenFull"
      tip="网页全屏"
      @click="toggleWebScreenFull"
    />
    <ControlTool
      active-icon-name="closeFullScreen"
      inactive-icon-name="fullScreen"
      :flag="isScreenFull"
      tip="全屏"
      @click="toggleScreenFull"
    />
  </div>
</template>

<style scoped lang="scss">
.cy-player-controller-controls {
  height: 100%;
  display: flex;
  justify-content: space-around;
}
</style>
