<script setup lang="ts">
import CyPlayer from '@/core/CyPlayer.vue';
import { onMounted, ref, watch } from 'vue';
import { PlayerOption, VideoCallback } from '@/types';
import { useViewport } from '@/useViewport.ts';

const test = ref(true);

/**
 * @description 提供响应式option
 */
const option = ref<PlayerOption>({
  videoSrc:
    'https://criik-blog-image-storage.oss-cn-chengdu.aliyuncs.com/1630377480138360p.mp4',
  // 'https://criik-blog-image-storage.oss-cn-chengdu.aliyuncs.com/m3u8/input.m3u8',
  // 'http://localhost:3000/test.mp4',
  // 'http://localhost:3000/input.m3u8',
  // '1231313231212333333333333333333333333333333333333333333333',
  sourceType: 'h264',
  // autoPlay: true,
  // width: '60vw',
  // height: '300px',
  // themeColor: 'yellow',
  maskIconPlacement: 'right-bottom',
  toastPlacement: 'left-top',
  keepShowController: true,
  isSettingShow: true,
  isPicInPicShow: true,
  isWebScreenFullShow: true,
  isScreenFullShow: true,
  isMultiplePlayShow: true,
  updateCurTimeDuration: 100,
  // styles: {
  //   width: '1000px',
  // },
  // controllerStyles: {
  //   backgroundColor: 'transparent',
  // },
  showToast: true, // 默认false
  poster:
    'https://criik-blog-image-storage.oss-cn-chengdu.aliyuncs.com/blog_image/-RlDl1ILrKky8kDo3TCf2.jpg',
  quality: [
    {
      vQ: '2K',
      src: 'https://cdn.gudsen.vip/2022/11/14/422e7528fce64f03bf1b378cff393237.mp4',
    },
    {
      vQ: '720p',
      src: 'https://criik-blog-image-storage.oss-cn-chengdu.aliyuncs.com/m3u8/input.m3u8',
    },
    {
      vQ: '480p',
      src: 'https://criik-blog-image-storage.oss-cn-chengdu.aliyuncs.com/1630377480138360p.mp4',
    },
  ],
});

// 适配测试
const setSize = (xw: number) => {
  if (xw <= 480) {
    option.value.width = '100vw';
    option.value.height = '300px';
  } else if (xw <= 720) {
    option.value.width = '100vw';
    option.value.height = '500px';
  } else {
    option.value.width = '1000px';
    option.value.height = '600px';
  }
};

const { xWidth } = useViewport();

watch(xWidth, () => {
  setSize(xWidth.value);
});

onMounted(() => {
  setSize(window.innerWidth);
});

const callbacks = <VideoCallback>{
  onPlay: (e) => {
    console.log('play');
  },
  onPlayEnd: (e) => {
    console.log('playend');
  },
  onPause: (e) => {
    console.log('pause');
  },
  onVolumeChange: (e) => {
    console.log('volumechange');
  },
  onTimeChange: (e) => {
    console.log('timechange');
  },
  onWaiting(e) {
    console.log('waiting');
  },
  onError() {
    console.log('err');
  },
};

const change = () => {
  // option.value.videoSrc =
  // 'https://criik-blog-image-storage.oss-cn-chengdu.aliyuncs.com/m3u8/input.m3u8';
  // option.value.videoSrc = '112312';
  // option.value.poster = 'https://criik-blog-image-storage.oss-cn-chengdu.aliyuncs.com/blog_image/wqyZDFQ3PtTCl2TxZF4Xe.png'
  // option.value.width = '50vw';
  // option.value.isScreenFullShow = false;
  // option.value.showToast = false;
  // option.value.toastPlacement = 'center';
  // option.value.maskIconPlacement = 'center';
  // option.value.themeColor = 'red';
};
</script>

<template>
  <CyPlayer v-if="test" :option="option" :callback="callbacks"></CyPlayer>
  <button @click="test = false">卸载</button>
  <button @click="change">change</button>
</template>

<style scoped></style>
