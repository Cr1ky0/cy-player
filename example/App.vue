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
    'https://criik-blog-image-storage.oss-cn-chengdu.aliyuncs.com/1630377480138360p.mp4',
  // 'https://criik-blog-image-storage.oss-cn-chengdu.aliyuncs.com/m3u8/input.m3u8',
  // 'https://criik-blog-image-storage.oss-cn-chengdu.aliyuncs.com/m3u8_1/input.m3u8',
  // 'http://localhost:3000/test.mp4',
  // 'http://localhost:3000/input.m3u8',
  // '1231313231212333333333333333333333333333333333333333333333',
  sourceType: 'auto', // 默认h264(auto需要跨域支持)
  autoPlay: false,
  videoAutoFix: false,
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
  // poster:
  //   'https://criik-blog-image-storage.oss-cn-chengdu.aliyuncs.com/blog_image/-RlDl1ILrKky8kDo3TCf2.jpg',
  // quality: [
  //   {
  //     vQ: '8K',
  //     src: 'https://criik-blog-image-storage.oss-cn-chengdu.aliyuncs.com/m3u8/input.m3u8',
  //   },
  //   {
  //     vQ: '4K',
  //     src: 'https://criik-blog-image-storage.oss-cn-chengdu.aliyuncs.com/m3u8_1/input.m3u8',
  //   },
  //   {
  //     vQ: '2K',
  //     src: 'https://cdn.gudsen.vip/2022/11/14/422e7528fce64f03bf1b378cff393237.mp4',
  //   },
  //   {
  //     vQ: '720p',
  //     src: 'https://criik-blog-image-storage.oss-cn-chengdu.aliyuncs.com/1630377480138360p.mp4',
  //     // chosen: true,
  //   },
  //   {
  //     vQ: '480p',
  //     src: 'https://criik-blog-image-storage.oss-cn-chengdu.aliyuncs.com/1630377480138360p.mp4',
  //   },
  // ],
  // qualitySave: true,
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
    console.log('mousedown');
  },
  onProgressMouseMove: (e) => {
    console.log('mousemove');
  },
  onProgressMouseUp: (e) => {
    console.log('mouseup');
  },
};
const change = () => {
  // console.log(playerRef.value?.videoElement);
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
