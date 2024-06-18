<script setup lang="ts">
import Volume from '@/core/controls/volume/Volume.vue';
import ControlTool from '@/components/controltool/ControlTool.vue';
import { inject, Ref } from 'vue';
import { useScreenFull } from '@/core/hooks/useScreenFull.ts';

const containerRef = <Ref>inject('containerRef');
const { isScreenFull, toggleScreenFull } = useScreenFull(containerRef);
</script>

<template>
  <div class="cy-player-controller-controls">
    <Volume></Volume>
    <ControlTool active-icon-name="inPicture" :flag="true" tip="画中画" />
    <ControlTool
      active-icon-name="webFullScreen"
      inactive-icon-name="closeWebFullScreen"
      :flag="true"
      tip="网页全屏"
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
