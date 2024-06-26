import { onMounted, ref, Ref } from 'vue';
import { PlayerOption, VideoState } from 'types';

export const useSetSize = (
  videoRef: Ref,
  containerRef: Ref,
  option: PlayerOption,
  videoStates: VideoState,
) => {
  const vRef = ref<HTMLVideoElement>();
  const cRef = ref<HTMLDivElement>();

  const getElementSize = (elem: HTMLElement) => {
    const width = parseFloat(getComputedStyle(elem).width);
    const height = parseFloat(getComputedStyle(elem).height);
    return { width, height };
  };

  /**
   * video自适应宽高
   * @param cWidth video父容器宽度
   * @param cHeight video父容器高度
   */
  const adaptiveVideoSize = (cWidth: number, cHeight: number) => {
    const vElem = <HTMLVideoElement>vRef.value;
    const containerSizeProp = cWidth / cHeight; // 父元素宽长比
    const videoSizeProp = videoStates.videoWidth / videoStates.videoHeight; // video元素宽长比
    // container比例 > video比例：说明video应该按宽度缩放，即height占满父元素，width按视频本身比例缩放（想象一个宽屏里放一个窄视频）
    if (containerSizeProp > videoSizeProp) {
      vElem.style.height = '100%'; // 不要用cHeight，不然全屏比例不对
      vElem.style.width = `${cHeight * videoSizeProp}px`; // vW / vH = (vW_ / vH_ )
    }
    // 否则按长度缩放，即width占满父元素，height按视频本身比例缩放（想象一个窄屏里放一个款视频）
    else {
      vElem.style.width = '100%';
      vElem.style.height = `${cWidth / videoSizeProp}px`; // vW / vH =  (vH_ / vW_)
    }
  };

  /**
   * @description 设置容器以及video宽高
   */
  const setTotalSize = (adaptVideo?: boolean) => {
    const videoElement = <HTMLVideoElement>vRef.value;
    const videoContainer = <HTMLDivElement>cRef.value;
    const videoWidth = videoElement.videoWidth;
    const videoHeight = videoElement.videoHeight;
    // container size
    if (!option.width && !option.styles?.width)
      videoContainer.style.width = `${videoWidth}px`;
    if (!option.height && !option.styles?.height)
      videoContainer.style.height = `${videoHeight}px`;
    if (option.height) {
      if (typeof option.height === 'number')
        videoContainer.style.height = `${option.height}px`;
      else videoContainer.style.height = option.height;
    }
    if (option.width) {
      if (typeof option.width === 'number')
        videoContainer.style.width = `${option.width}px`;
      else videoContainer.style.width = option.width;
    }
    // adapt video size
    if (typeof adaptVideo !== 'boolean' || adaptVideo) {
      const { width, height } = getElementSize(videoContainer);
      adaptiveVideoSize(width, height);
    }
  };

  onMounted(() => {
    if (videoRef.value) vRef.value = videoRef.value;
    if (containerRef.value) cRef.value = containerRef.value;
  });

  return { setTotalSize, adaptiveVideoSize, getElementSize };
};
