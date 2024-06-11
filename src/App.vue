<script setup lang="ts">
import CyPlayer from '@/core/CyPlayer.vue';
import Test from '@/core/Test.vue';
</script>

<template>
  <CyPlayer
    :option="{
      videoSrc:
        'https://criik-blog-image-storage.oss-cn-chengdu.aliyuncs.com/1630377480138360p.mp4',
      autoPlay: true,
      videoType: 'h264',
      width: 800,
      height: 1200,
    }"
  ></CyPlayer>
</template>

<style scoped></style>
