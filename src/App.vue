<script setup lang="ts">
import CyPlayer from '@/core/CyPlayer.vue';
import { ref } from 'vue';
import { PlayerOption, VideoCallback } from '@/types';

const test = ref(true);

/**
 * @description 提供响应式option
 */
const option = ref<PlayerOption>({
  videoSrc:
    // '123',
    'https://criik-blog-image-storage.oss-cn-chengdu.aliyuncs.com/1630377480138360p.mp4',
  // 'https://criik-blog-image-storage.oss-cn-chengdu.aliyuncs.com/m3u8/input.m3u8',
  // 'http://localhost:3000/test.mp4',
  // 'http://localhost:3000/input.m3u8',
  // autoPlay: true,
  width: 800,
  height: 500,
  showToast: true, // 默认false
  poster:
    'https://criik-blog-image-storage.oss-cn-chengdu.aliyuncs.com/blog_image/-RlDl1ILrKky8kDo3TCf2.jpg',
});

const callbacks = <VideoCallback>{
  onTimeChange: (e) => {
    // console.log(e);
  },
  onError(e) {
    // console.log(123);
  },
  onLoaded(e) {
    // console.log(e);
  },
};

const change = () => {
  // option.value.videoSrc =
  //   'https://criik-blog-image-storage.oss-cn-chengdu.aliyuncs.com/m3u8/input.m3u8';
  // option.value.videoSrc = '112312';
  // option.value.poster = 'https://criik-blog-image-storage.oss-cn-chengdu.aliyuncs.com/blog_image/wqyZDFQ3PtTCl2TxZF4Xe.png'
  // option.value.width = '50vw'
  option.value.showToast = false;
};
</script>

<template>
  <CyPlayer v-if="test" :option="option" :callback="callbacks"></CyPlayer>
  <button @click="test = false">卸载</button>
  <button @click="change">change</button>
</template>

<style scoped></style>
