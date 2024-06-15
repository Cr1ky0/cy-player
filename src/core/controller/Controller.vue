<script setup lang="ts">
import ProgressBar from '@/core/controller/ProgressBar.vue';
</script>

<template>
  <div class="cy-player-controller-container">
    <ProgressBar></ProgressBar>
  </div>
</template>

<style scoped>
.cy-player-controller-container {
  width: 100%;
  height: 7.5%;
  background-color: transparent;
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>
