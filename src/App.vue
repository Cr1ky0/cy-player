<script setup lang="ts">
import CyPlayer from '@/core/CyPlayer.vue';
import { ref } from 'vue';

const test = ref(true);
</script>

<template>
  <CyPlayer
    v-if="test"
    :option="{
      videoSrc:
        'https://criik-blog-image-storage.oss-cn-chengdu.aliyuncs.com/1630377480138360p.mp4',
      autoPlay: true,
      videoType: 'h264',
      width: 800,
      height: 1200,
    }"
  ></CyPlayer>
  <button @click="test = false">卸载</button>
</template>

<style scoped></style>
