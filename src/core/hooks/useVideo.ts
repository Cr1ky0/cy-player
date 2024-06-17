import { onBeforeUnmount, onMounted, reactive, ref, Ref, watch } from 'vue';
import { PlayerOption, VideoController, VideoState } from '@/types';

/**
 * @description video状态管理和控制
 * @param videoRef VideoDOM Ref
 * @param option Player Options
 */
export const useVideo = (
  videoRef: Ref<HTMLVideoElement | undefined>,
  option: Partial<PlayerOption>,
) => {
  /**
   * @description 内部ref，全局事件监听或卸载只在该对象上进行，避免组件卸载后无法进行事件移除
   */
  const vRef = ref<HTMLVideoElement>();
  /**
   * @description 轮询状态刷新计时器，类似curTime这类属性需要监控到连续的变化，不用原生实现
   *
   */
  const interval = ref<NodeJS.Timeout | null>(null);
  /**
   * @description waiting计时器，playing后一段时间再置为false
   */
  const timer = ref<NodeJS.Timeout | null>(null);
  /**
   * @description video本身的相关状态
   */
  const videoStates = reactive<VideoState>({
    isPlay: option.autoPlay || false, // 是否播放
    isPlayEnd: false, // 是否播放结束
    isWaiting: false, // 视频播放过程中的暂停
    currentPlayTime: 0, // 当前时间/s
    duration: 0, // 总时长
    bufferedTime: 0, // 缓存时长/s
    volume: localStorage.getItem('volume')
      ? parseInt(localStorage.getItem('volume')!)
      : 50, // 音量
  });

  /**
   * @description video本身的控制方法
   */
  const videoController = reactive<VideoController>({
    load: () => vRef.value?.load(),
    play: () => vRef.value?.play(),
    pause: () => vRef.value?.pause(),
    setVolume: (volume) => {
      if (vRef.value) {
        // 记录上一次音量值
        if (volume > 0)
          localStorage.setItem('lastVolume', String(volume));
        // muted状态下始终为0
        const v = volume <= 0 ? 0 : volume >= 100 ? 100 : volume;
        vRef.value.volume = volume <= 0 ? 0 : volume >= 100 ? 1 : volume / 100;
        videoStates.volume = v;
        // 存储音量值
        localStorage.setItem('volume', String(v));
      }
    },
    setCurTime: (curTime) => {
      if (vRef.value) vRef.value.currentTime = curTime;
    },
  });

  /**
   * @description 视频是否播放
   */
  const setIsPlay = () => {
    if (vRef.value) {
      videoStates.isPlay = !vRef.value.paused;
      if (videoStates.isPlay) videoStates.isPlayEnd = false; // 播放时重置
    }
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
    if (vRef.value) {
      videoStates.duration = vRef.value.duration || 0;
    }
  };

  /**
   * @description 缓冲时间
   */
  const setBufferedTime = () => {
    if (vRef.value && vRef.value.buffered.length >= 1)
      videoStates.bufferedTime = vRef.value.buffered.end(0) || 0; // 浏览器已经缓冲的媒体数据的最远时间点
  };
  /**
   * @description 视频播放中的waiting
   */
  const onWaiting = () => {
    videoStates.isWaiting = true;
  };
  /**
   * @description 从waiting恢复播放
   */
  const onIsPlaying = () => {
    if (timer.value) clearTimeout(timer.value);
    timer.value = setTimeout(() => {
      videoStates.isWaiting = false; // waiting结束
    }, 100);
  };

  const addEvents = (videoElement: HTMLVideoElement) => {
    videoElement.addEventListener('canplay', setDuration);
    videoElement.addEventListener('progress', setBufferedTime);
    videoElement.addEventListener('pause', setIsPlay);
    videoElement.addEventListener('play', setIsPlay);
    videoElement.addEventListener('ended', setIsPlayEnd);
    videoElement.addEventListener('waiting', onWaiting);
    videoElement.addEventListener('playing', onIsPlaying);
  };

  const removeEvents = (videoElement: HTMLVideoElement) => {
    videoElement.removeEventListener('canplay', setDuration);
    videoElement.removeEventListener('progress', setBufferedTime);
    videoElement.removeEventListener('pause', setIsPlay);
    videoElement.removeEventListener('play', setIsPlay);
    videoElement.removeEventListener('ended', setIsPlayEnd);
    videoElement.removeEventListener('waiting', onWaiting);
    videoElement.removeEventListener('playing', onIsPlaying);
  };

  // 监听src重置状态
  watch(
    () => option.videoSrc,
    () => {
      videoStates.isPlay = option.autoPlay || false;
      videoStates.isPlayEnd = false;
      videoStates.isWaiting = false;
      videoStates.duration = 0;
      videoStates.currentPlayTime = 0;
      videoStates.bufferedTime = 0;
    },
  );

  onMounted(() => {
    if (videoRef.value) {
      vRef.value = videoRef.value;
      const videoElement = <HTMLVideoElement>vRef.value;
      // 设置音量为记录音量
      videoElement.volume = videoStates.volume / 100;
      addEvents(videoElement);
      // interval
      interval.value = setInterval(() => {
        videoStates.currentPlayTime = videoRef.value!.currentTime;
        videoStates.volume = videoRef.value!.volume * 100;
      }, 10);
    }
  });

  // remove events
  onBeforeUnmount(() => {
    if (vRef.value) {
      const videoElement = <HTMLVideoElement>vRef.value;
      removeEvents(videoElement);
      clearInterval(interval.value!);
    }
  });

  return {
    videoStates,
    videoController,
    setIsPlay,
    setIsPlayEnd,
    setDuration,
    setBufferedTime,
    onWaiting,
    onIsPlaying,
  };
};
