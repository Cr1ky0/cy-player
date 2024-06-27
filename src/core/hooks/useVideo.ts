import { onBeforeUnmount, onMounted, reactive, ref, Ref, watch } from 'vue';
import { PlayerOption, VideoController, VideoState } from 'types';
import Hls from 'hls.js';
import { supportTypes } from '@/core/hooks/useLoad.ts';

/**
 * @description video状态管理和控制
 * @param videoRef VideoDOM Ref
 * @param option Player Options
 */
export const useVideo = (
  videoRef: Ref<HTMLVideoElement | undefined>,
  option: PlayerOption,
) => {
  /**
   * @description 内部ref，全局事件监听或卸载只在该对象上进行，避免组件卸载后无法进行事件移除
   */
  const vRef = ref<HTMLVideoElement>();
  /**
   * @description 轮询状态刷新计时器，类似curTime这类属性需要监控到连续的变化，不用原生实现
   */
  const interval = ref<NodeJS.Timeout | null>(null);
  /**
   * @description waiting计时器，playing后一段时间再置为false
   */
  const timer = ref<NodeJS.Timeout | null>(null);
  /**
   * @description 全局hls对象
   */
  let curHls: Hls | null = null;
  /**
   * @description video本身的相关状态
   */
  const videoStates = reactive<VideoState>({
    curSrc: '', // 当前的src
    isPlay: option.autoPlay || false, // 是否播放
    isPlayEnd: false, // 是否播放结束
    isWaiting: false, // 视频播放过程中的暂停
    isLoop: false, // 视频是否循环播放
    currentPlayTime: 0, // 当前时间/s
    duration: 0, // 总时长
    bufferedTime: 0, // 缓存时长/s
    volume: 50, // 音量
    isError: false, // 是否出错
    videoWidth: 0, // 当前video自己的宽度
    videoHeight: 0, // 当前video自己的高度
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
        if (volume >= 1) localStorage.setItem('lastVolume', String(volume));
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
  /****************************事件处理**********************************/
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
    if (vRef.value) {
      if (videoStates.isLoop) videoController.play(); // 播放结束循环播放
      videoStates.isPlayEnd = vRef.value.ended;
    }
  };
  /**
   *
   * @description canplay
   */
  const handleCanplay = () => {
    if (vRef.value) {
      option.autoPlay && videoController.play(); // 自动播放（切换视频是也会调用）
      videoStates.isError = false;
      videoStates.duration = vRef.value.duration || 0;
      videoStates.videoWidth = vRef.value.videoWidth;
      videoStates.videoHeight = vRef.value.videoHeight;
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

  /**
   * @description error处理
   */
  const handleError = () => {
    videoStates.isError = true;
  };

  const addEvents = (videoElement: HTMLVideoElement) => {
    videoElement.addEventListener('canplay', handleCanplay);
    videoElement.addEventListener('progress', setBufferedTime);
    videoElement.addEventListener('pause', setIsPlay);
    videoElement.addEventListener('play', setIsPlay);
    videoElement.addEventListener('ended', setIsPlayEnd);
    videoElement.addEventListener('waiting', onWaiting);
    videoElement.addEventListener('playing', onIsPlaying);
    videoElement.addEventListener('error', handleError);
  };

  const removeEvents = (videoElement: HTMLVideoElement) => {
    videoElement.removeEventListener('canplay', handleCanplay);
    videoElement.removeEventListener('progress', setBufferedTime);
    videoElement.removeEventListener('pause', setIsPlay);
    videoElement.removeEventListener('play', setIsPlay);
    videoElement.removeEventListener('ended', setIsPlayEnd);
    videoElement.removeEventListener('waiting', onWaiting);
    videoElement.removeEventListener('playing', onIsPlaying);
    videoElement.removeEventListener('error', handleError);
  };
  /**************************************************************/

  const initStates = () => {
    videoStates.isPlay = option.autoPlay || false;
    videoStates.isPlayEnd = false;
    videoStates.isWaiting = false;
    videoStates.duration = 0;
    videoStates.currentPlayTime = 0;
    videoStates.bufferedTime = 0;
  };

  /**
   * @description HLS导入
   */
  const setHls = (videoElem: HTMLVideoElement, src: string) => {
    // 检查浏览器是否支持hls格式
    if (Hls.isSupported()) {
      if (curHls) {
        curHls.detachMedia();
        curHls.loadSource(src);
        curHls.attachMedia(videoElem);
      } else {
        const hls = new Hls();
        curHls = hls;
        hls.loadSource(src); // 将视频源加载到 HLS 对象中
        hls.attachMedia(videoElem); // 将 HLS 对象附加到 videoElem 上
      }
    }
  };

  /**
   * @description 根据url检测video类型（需要跨域支持）
   * @return 返回是否为HLS对象
   */
  const checkHls = async (url: string) => {
    const response = await fetch(url);
    if (response.ok) {
      // content type
      const contentTypes = response.headers
        .get('content-type')!
        .toLowerCase()
        .split(';')
        .map((item) => item.trim());
      const type =
        contentTypes.find((type) => {
          return supportTypes.includes(type);
        }) || null;
      // 类型检测
      if (type) {
        // LOAD OPTIONS
        return (
          type === 'application/vnd.apple.mpegurl' ||
          type === 'application/x-mpegurl'
        );
      }
      return false;
    }
    return false;
  };

  /**
   * @description 将src添加到元素上
   */
  const loadSrc = (src: string) => {
    const videoElement = <HTMLVideoElement>vRef.value;
    // 导入src
    // 注意必须在setHls之前执行，因为如果src为空那么attach会失败
    videoElement.src = src;
    // Source源修改
    const sources = videoElement.childNodes;
    sources.forEach((source) => {
      const element = <HTMLSourceElement>source;
      element.src = src;
    });
  };

  const loadVideo = (url: string) => {
    loadSrc(url);
    if (option.sourceType === 'hls') {
      setHls(vRef.value!, url);
    } else if (option.sourceType === 'auto') {
      checkHls(url).then((isHls) => {
        if (isHls) {
          setHls(vRef.value!, url);
        }
      });
    }
  };

  /**
   * @description 其他option
   */
  watch([() => vRef.value, () => option.poster], () => {
    if (vRef.value) {
      const videoElement = vRef.value!;
      // 导入poster
      videoElement.poster = option.poster ? option.poster : '';
    }
  });

  // 监听src更改状态
  watch(
    () => videoStates.curSrc,
    () => {
      initStates();
      loadVideo(videoStates.curSrc);
      // 切换quality时逻辑
      const curPlayTime = localStorage.getItem('curPlayTime');
      const curTime = parseFloat(curPlayTime || '0');
      videoController.setCurTime(curTime);
      localStorage.removeItem('curPlayTime'); // 切换完毕后删除，避免初始化时快进
    },
  );

  onMounted(() => {
    // 如果没有quality不需要切换，把curSrc去除
    // if (!option.quality || option.quality.length === 0)
    //   localStorage.removeItem('curSrc');
    // 初始化状态
    const isLoop = localStorage.getItem('isLoop');
    const volume = localStorage.getItem('volume');
    // const curSrc = localStorage.getItem('curSrc');
    if (isLoop) videoStates.isLoop = isLoop === 'true';
    if (volume) videoStates.volume = parseFloat(volume);
    // 初始Src设置
    const index = option.quality?.findIndex((item) => {
      return item.chosen;
    });
    // 存在chosen的src首先选择
    if (index && index !== -1) videoStates.curSrc = option.quality![index].src;
    // 如果打开了qualitySave则采用默认保存规则
    // else if (option.qualitySave && curSrc) videoStates.curSrc = curSrc;
    else videoStates.curSrc = option.videoSrc;
    // videoRef
    if (videoRef.value) {
      vRef.value = videoRef.value;
      const videoElement = <HTMLVideoElement>vRef.value;
      videoElement.volume = videoStates.volume / 100; // 设置音量
      addEvents(videoElement);
      // update计时器
      interval.value = setInterval(() => {
        videoStates.currentPlayTime = videoElement.currentTime;
      }, 20);
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
  };
};
