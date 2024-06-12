import { onBeforeUnmount, reactive, ref, Ref, VNodeRef, watch } from 'vue';
import { VideoController, VideoState } from '@/types';

export const useVideo = (videoRef: Ref) => {
  // 内部额外定义一个Ref的意义在于，全局事件监听或卸载只在该对象上进行，不用依赖传入的Ref
  // 传入的Ref的作用在于初始化vRef
  const vRef = ref<VNodeRef | null>(null);
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
    load: () => videoRef.value?.load(),
    play: () => videoRef.value?.play(),
    pause: () => videoRef.value?.pause(),
    setVolume: (volume) => {
      if (videoRef.value)
        videoRef.value.volume = volume < 1 ? volume : volume / 100;
    },
    setCurTime: (curTime) => {
      if (videoRef.value) videoRef.value.currentTime = curTime;
    },
  });

  // 相关监听事件
  /**
   * @description 视频暂停
   */
  const setIsPlay = () => {
    videoStates.isPlay = !videoRef.value?.paused;
  };
  /**
   * @description 视频结束
   */
  const setIsPlayEnd = () => {
    videoStates.isPlayEnd = videoRef.value?.ended;
  };
  /**
   *
   * @description 总时长
   */
  const setDuration = () => {
    videoStates.duration = videoRef.value?.duration;
  };

  /**
   * @description 缓冲时间
   */
  const setBufferedTime = () => {
    videoStates.bufferedTime = videoRef.value?.buffered.end(0); // 浏览器已经缓冲的媒体数据的最远时间点
  };
  /**
   * @description 播放时间
   */
  const setCurrentPlayTime = () => {
    videoStates.currentPlayTime = videoRef.value?.currentTime;
  };

  // 监听VideoRef
  watch(videoRef, () => {
    if (videoRef.value) {
      console.log('mount');
      vRef.value = videoRef.value;
      const videoElement = <HTMLVideoElement>vRef.value;
      videoElement.addEventListener('canplay', setDuration);
      videoElement.addEventListener('progress', setBufferedTime);
      videoElement.addEventListener('timeupdate', setCurrentPlayTime);
      videoElement.addEventListener('pause', setIsPlay);
      videoElement.addEventListener('ended', setIsPlayEnd);
    }
  });

  // remove events
  onBeforeUnmount(() => {
    if (vRef.value) {
      console.log('unmount');
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
