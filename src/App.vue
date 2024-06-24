<script setup lang="ts">
import CyPlayer from '@/core/CyPlayer.vue';
import { onMounted, reactive, ref, watch } from 'vue';
import { PlayerOption, VideoCallback } from '@/types';
import { useViewport } from '@/useViewport.ts';

const test = ref(true);

/**
 * @description 提供响应式option
 */
const option = reactive<PlayerOption>({
  videoSrc:
    'https://criik-blog-image-storage.oss-cn-chengdu.aliyuncs.com/1630377480138360p.mp4',
  // 'https://criik-blog-image-storage.oss-cn-chengdu.aliyuncs.com/m3u8/input.m3u8',
  // 'http://localhost:3000/test.mp4',
  // 'http://localhost:3000/input.m3u8',
  // '1231313231212333333333333333333333333333333333333333333333',
  sourceType: 'h264', // 默认h264
  // autoPlay: true,
  // width: '60vw',
  // height: '300px',
  // themeColor: 'yellow',
  // videoAutoFix: false, // 默认true
  // showToast: false, // 默认true
  maskIconPlacement: 'center',
  toastPlacement: 'left-top',
  // keepControllerShow: true,
  // isSettingShow: true,
  // isPicInPicShow: true,
  // isWebScreenFullShow: true,
  // isScreenFullShow: true,
  // isMultiplePlayShow: true,
  // styles: {
  //   width: '1000px',
  // },
  // controllerStyles: {
  //   backgroundColor: 'transparent',
  // },
  // poster:
  //   'https://criik-blog-image-storage.oss-cn-chengdu.aliyuncs.com/blog_image/-RlDl1ILrKky8kDo3TCf2.jpg',
  quality: [
    {
      vQ: '4K',
      src: '123',
    },
    {
      vQ: '2K',
      src: 'https://cdn.gudsen.vip/2022/11/14/422e7528fce64f03bf1b378cff393237.mp4',
      // chosen: true,
    },
    {
      vQ: '720p',
      src: 'https://criik-blog-image-storage.oss-cn-chengdu.aliyuncs.com/1630377480138360p1.mp4',
      // chosen: true,
    },
    {
      vQ: '480p',
      src: 'https://criik-blog-image-storage.oss-cn-chengdu.aliyuncs.com/1630377480138360p.mp4',
    },
  ],
  // qualitySave: true,
});

// 适配测试
// const setSize = (xw: number) => {
//   if (xw <= 480) {
//     option.width = '100vw';
//     option.height = '300px';
//   } else if (xw <= 720) {
//     option.width = '100vw';
//     option.height = '500px';
//   } else {
//     option.width = '1000px';
//     option.height = '600px';
//   }
// };
//
// const { xWidth } = useViewport();
//
// watch(xWidth, () => {
//   setSize(xWidth.value);
// });
//
// onMounted(() => {
//   setSize(window.innerWidth);
// });

const callbacks = <VideoCallback>{
  onPlay: (e) => {
    // console.log('play');
  },
  onPlayEnd: (e) => {
    // console.log('playend');
  },
  onPause: (e) => {
    // console.log('pause');
  },
  onVolumeChange: (e) => {
    // console.log('volumechange');
  },
  onTimeChange: (e) => {
    // console.log('timechange');
  },
  onWaiting(e) {
    // console.log('waiting');
  },
  onError() {
    // console.log('err');
  },
};
// TODO: slider
const change = () => {
  // option.videoSrc =
  // 'https://criik-blog-image-storage.oss-cn-chengdu.aliyuncs.com/m3u8/input.m3u8';
  // option.videoSrc = '112312';
  // option.poster = 'https://criik-blog-image-storage.oss-cn-chengdu.aliyuncs.com/blog_image/wqyZDFQ3PtTCl2TxZF4Xe.png'
  // option.width = '50vw';
  // option.isScreenFullShow = false;
  // option.showToast = false;
  // option.toastPlacement = 'center';
  // option.maskIconPlacement = 'center';
  // option.themeColor = 'red';
  option.keepControllerShow = !option.keepControllerShow;
};
</script>

<template>
  <CyPlayer v-if="test" :option="option" :callback="callbacks">
    <!--        <template #playend>-->
    <!--          <div>playend</div>-->
    <!--        </template>-->
    <!--    <template #waiting>-->
    <!--      <div>waiting</div>-->
    <!--    </template>-->
    <!--        <template #paused>-->
    <!--          <div>paused</div>-->
    <!--        </template>-->
    <!--    <template #error>-->
    <!--      <div>error</div>-->
    <!--    </template>-->
    <!--    <template #progress-slider>-->
    <!--      <div>slider</div>-->
    <!--    </template>-->
  </CyPlayer>
  <button @click="test = false">卸载</button>
  <button @click="change">change</button>
</template>

<style scoped></style>
