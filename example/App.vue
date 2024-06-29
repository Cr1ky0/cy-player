<script setup lang="ts">
import CyPlayer from '@/core/index';
import { onMounted, reactive, ref, watch } from 'vue';
import { PlayerOption, VideoCallback, CyPlayerRef } from 'types';
import { useViewport } from './useViewport.ts';

const test = ref(true);
/**
 * @description 提供响应式option
 */
const option = reactive<PlayerOption>({
  videoSrc:
    'https://cdn.pixabay.com/video/2024/03/31/206294_small.mp4?download',
  sourceType: 'h264', // 默认h264(auto需要跨域支持)
  autoPlay: false,
  videoAutoFix: true,
  // width: '60vw',
  // height: '300px',
  // themeColor: 'yellow',
  // videoAutoFix: false, // 默认true
  // showToast: false, // 默认true
  // maskIconPlacement: 'center',
  // toastPlacement: 'left-top',
  // customizedItemPlacement: 'right-bottom',
  // showProgressFloat: false, // 默认为true
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
  quality: [
    {
      vQ: '720p',
      src: 'https://cdn.pixabay.com/video/2024/02/21/201308-915375262_small.mp4?download',
      // chosen: true,
    },
    {
      vQ: '480p',
      src: 'https://cdn.pixabay.com/video/2024/03/31/206294_small.mp4?download',
    },
  ],
});

// ref
const playerRef = ref<CyPlayerRef>();

// 适配测试
const setSize = (xw: number) => {
  if (xw <= 480) {
    option.width = '100vw';
    option.height = '300px';
  } else if (xw <= 720) {
    option.width = '100vw';
    option.height = '500px';
  } else {
    option.width = '1000px';
    option.height = '600px';
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
  onWaiting: (e) => {
    // console.log('waiting');
  },
  onError: () => {
    // console.log('err');
  },
  onQualityChange: (quality) => {
    // console.log(quality);
  },
  onPlayerMounted: (vElem, cElem) => {
    // console.log(vElem, cElem);
  },
  onPlayerBeforeUnmount: (vElem, cElem) => {
    // console.log(vElem, cElem);
  },
  onProgressMouseDown: (e) => {
    // console.log('mousedown');
  },
  onProgressMouseMove: (e) => {
    // console.log('mousemove');
  },
  onProgressMouseUp: (e) => {
    // console.log('mouseup');
  },
};
const change = () => {
  // option.videoSrc =
  // 'https://criik-blog-image-storage.oss-cn-chengdu.aliyuncs.com/m3u8/input.m3u8';
  // option.videoSrc = '112312';
  // option.poster = 'https://criik-blog-image-storage.oss-cn-chengdu.aliyuncs.com/blog_image/wqyZDFQ3PtTCl2TxZF4Xe.png'
  // option.width = '50vw';
  // option.isScreenFullShow = false;
  // option.toastPlacement = 'center';
  // option.maskIconPlacement = 'center';
  // option.themeColor = 'red';
  // option.keepControllerShow = !option.keepControllerShow;
};
</script>

<template>
  <CyPlayer ref="playerRef" v-if="test" :option="option" :callback="callbacks">
    <!--    <template #playend>-->
    <!--      <div>playend</div>-->
    <!--    </template>-->
    <!--    <template #waiting>-->
    <!--      <div>waiting</div>-->
    <!--    </template>-->
    <!--    <template #paused>-->
    <!--      <div>paused</div>-->
    <!--    </template>-->
    <!--    <template #error>-->
    <!--      <div>error</div>-->
    <!--    </template>-->
    <!--    <template #slider>-->
    <!--      <div>123</div>-->
    <!--    </template>-->
    <!--    <template #customized>-->
    <!--      <div style="color:#FFF">123123</div>-->
    <!--    </template>-->
  </CyPlayer>
  <button @click="test = false">卸载</button>
  <button @click="change">change</button>
</template>

<style scoped></style>
