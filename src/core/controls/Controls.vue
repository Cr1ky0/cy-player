<script setup lang="ts">
import Volume from '@/core/controls/volume/Volume.vue';
import ControlTool from '@/components/controltool/ControlTool.vue';
</script>

<template>
  <div class="cy-player-controller-controls">
    <Volume></Volume>
    <ControlTool icon-name="inPicture" tip="画中画"/>
    <ControlTool icon-name="webFullScreen" tip="网页全屏"/>
    <ControlTool icon-name="fullScreen" tip="全屏"/>
  </div>
</template>

<style scoped lang="scss">
.cy-player-controller-controls {
  height: 100%;
  display: flex;
  justify-content: space-around;
}
</style>
