<script setup lang="ts">
import CyPlayer from '@/core/CyPlayer.vue';
import { ref } from 'vue';
import { PlayerOption, VideoCallback } from '@/types';

const test = ref(true);

const option = <PlayerOption>{
  videoSrc:
    'https://criik-blog-image-storage.oss-cn-chengdu.aliyuncs.com/1630377480138360p.mp4',
    // 'https://criik-blog-image-storage.oss-cn-chengdu.aliyuncs.com/m3u8/input.m3u8',
    // 'http://localhost:3000/test.mp4',
    // 'http://localhost:3000/input.m3u8',
  autoPlay: true,
  width: 800,
  height: 500,
};

const callbacks = <VideoCallback>{
  onTimeChange: (e) => {
    // console.log(e);
  },
  onError(e) {
      console.log(e);
  },
};
</script>

<template>
  <CyPlayer v-if="test" :option="option" :callback="callbacks"></CyPlayer>
  <button @click="test = false">卸载</button>
</template>

<style scoped></style>
