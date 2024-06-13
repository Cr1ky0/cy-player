import { onBeforeUnmount, reactive, ref, Ref, watch } from 'vue';
import { PlayerOption, VideoController, VideoState } from '@/types';

export const useVideo = (
  videoRef: Ref<HTMLVideoElement | undefined>,
  option: Partial<PlayerOption>,
) => {
  /**
   * @description 内部ref，全局事件监听或卸载只在该对象上进行，避免组件卸载后无法进行事件移除
   */
  const vRef = ref<HTMLVideoElement>();
  // States
  const videoStates = reactive<VideoState>({
    isPlay: false, // 是否播放
    isPlayEnd: false, // 是否播放结束
    currentPlayTime: 0, // 当前时间/s
    duration: 0, // 总时长
    bufferedTime: 0, // 缓存时长/s
    volume: 0, // 音量
  });

  const videoController = reactive<VideoController>({
    load: () => vRef.value?.load(),
    play: () => vRef.value?.play(),
    pause: () => vRef.value?.pause(),
    setVolume: (volume) => {
      if (vRef.value) vRef.value.volume = volume < 1 ? volume : volume / 100;
    },
    setCurTime: (curTime) => {
      if (vRef.value) vRef.value.currentTime = curTime;
    },
  });

  // 相关监听事件
  /**
   * @description 视频暂停
   */
  const setIsPlay = () => {
    if (vRef.value) videoStates.isPlay = vRef.value.paused;
  };
  /**
   * @description 视频结束
   */
  const setIsPlayEnd = () => {
    if (vRef.value) videoStates.isPlayEnd = vRef.value.ended;
  };
  /**
   *
   * @description 总时长
   */
  const setDuration = () => {
    if (vRef.value) videoStates.duration = vRef.value.duration || 0;
  };

  /**
   * @description 缓冲时间
   */
  const setBufferedTime = () => {
    if (vRef.value)
      videoStates.bufferedTime = vRef.value.buffered.end(0) || 0; // 浏览器已经缓冲的媒体数据的最远时间点
  };
  /**
   * @description 播放时间
   */
  const setCurrentPlayTime = () => {
    if (vRef.value) videoStates.currentPlayTime = vRef.value.currentTime;
  };

  // 监听相关的options
  watch(
    () => option.autoPlay,
    () => {
      if (option.autoPlay) {
        videoStates.isPlay = option.autoPlay;
      }
    },
  );
  watch(
    () => option.videoSrc,
    () => {
      videoStates.isPlay = false;
      videoStates.isPlayEnd = false;
      videoStates.duration = 0;
      videoStates.currentPlayTime = 0;
      videoStates.bufferedTime = 0;
      videoStates.volume = 0;
    },
  );

  // 监听VideoRef
  watch(videoRef, (newVal, oldVal) => {
    if (videoRef.value) {
      vRef.value = videoRef.value;
      const videoElement = <HTMLVideoElement>vRef.value;
      videoElement.addEventListener('canplay', setDuration);
      videoElement.addEventListener('progress', setBufferedTime);
      videoElement.addEventListener('timeupdate', setCurrentPlayTime);
      videoElement.addEventListener('pause', setIsPlay);
      videoElement.addEventListener('ended', setIsPlayEnd);
    }
    // remove events
    if (!newVal) {
      const videoElement = <HTMLVideoElement>oldVal;
      videoElement.removeEventListener('canplay', setDuration);
      videoElement.removeEventListener('progress', setBufferedTime);
      videoElement.removeEventListener('timeupdate', setCurrentPlayTime);
      videoElement.removeEventListener('pause', setIsPlay);
      videoElement.removeEventListener('ended', setIsPlayEnd);
    }
  });

  // remove events
  onBeforeUnmount(() => {
    if (vRef.value) {
      const videoElement = <HTMLVideoElement>vRef.value;
      videoElement.removeEventListener('canplay', setDuration);
      videoElement.removeEventListener('progress', setBufferedTime);
      videoElement.removeEventListener('timeupdate', setCurrentPlayTime);
      videoElement.removeEventListener('pause', setIsPlay);
      videoElement.removeEventListener('ended', setIsPlayEnd);
    }
  });

  return {
    videoStates,
    videoController,
  };
};
