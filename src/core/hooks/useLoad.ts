import { onMounted, reactive, Ref, ref, watch } from 'vue';
import { HttpLoadState, PlayerOption } from '@/types';
import Hls from 'hls.js';

/**
 *  @description 支持的HTTP传输对象类别(Content-Type)
 */
export const supportTypes = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'application/vnd.apple.mpegurl',
  'application/x-mpegurl',
];
/**
 * @description 用于视频加载
 * @param videoRef vref
 * @param option 播放器选项
 */
export const useLoad = (
  videoRef: Ref<HTMLVideoElement | undefined>,
  option: PlayerOption,
) => {
  const httpStates: HttpLoadState = reactive({
    httpStateCode: 404,
    failReason: '',
  });
  /**
   * @description 内部ref
   */
  const vRef = ref<HTMLVideoElement | null>(null);
  /**
   * @description useful标志
   */
  const useful = ref<boolean | null>(null);
  /**
   *  @description 源文件类型
   */
  const sourceFileType = ref<string | null>('');

  /**
   * @description HLS导入
   */
  const setHls = (videoElem: HTMLVideoElement, src: string) => {
    // 检查浏览器是否支持hls格式
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src); // 将视频源加载到 HLS 对象中
      hls.attachMedia(videoElem); // 将 HLS 对象附加到 videoElem 上
    } else {
      //TODO:浏览器不支持操作
      console.log('当前浏览器不支持HLS');
    }
  };

  /**
   * @description 将其他属性导入video
   */
  const loadOption = () => {
    const videoElement = vRef.value!;
    // 导入poster
    videoElement.poster = option.poster ? option.poster : '';
  };

  /**
   * @description load src
   */
  const loadSrc = (type: string, src: string) => {
    const videoElement = <HTMLVideoElement>vRef.value;
    // 导入src
    // 注意必须在setHls之前执行，因为如果src为空那么attach会失败
    videoElement.src = src;
    // Source源修改
    const child = <HTMLSourceElement>videoElement.firstElementChild;
    child.src = src;
    child.type = type;
  };

  /**
   * @description 将属性从video卸载
   */
  const unloadOption = () => {
    const videoElement = <HTMLVideoElement>vRef.value;
    videoElement.src = '';
    // Source源修改
    const child = <HTMLSourceElement>videoElement.firstElementChild;
    child.src = '';
    child.type = '';
    videoElement.poster = '';
  };

  /**
   * @description 源视频文件校验以及加载，支持h264(.mp4,.webm,.ogg)，hls(m3u8),默认h264格式，要跨域（已弃用）
   * @param url 源视频文件链接
   */
  const loadVideo = async (url: string) => {
    try {
      const response = await fetch(url);
      httpStates.httpStateCode = response.status;
      if (!response.ok) {
        throw new Error('HTTP传输失败');
      }
      // content type
      const contentTypes = response.headers
        .get('content-type')!
        .toLowerCase()
        .split(';')
        .map((item) => item.trim());
      let type =
        contentTypes.find((type) => {
          return supportTypes.includes(type);
        }) || null;
      // 类型检测
      if (type) {
        // LOAD OPTIONS
        const isHls =
          type === 'application/vnd.apple.mpegurl' ||
          type === 'application/x-mpegurl';
        if (isHls) type = type.slice(0, -3) + type.slice(-3).toUpperCase();
        // 将src和其他属性附加到video上
        loadSrc(type, url);
        loadOption();
        if (isHls) {
          // HLS支持
          setHls(vRef.value!, url);
        }
        sourceFileType.value = type;
        useful.value = true;
        httpStates.failReason = '';
      } else throw new Error('视频源不存在或不支持的视频种类');
    } catch (error: any) {
      httpStates.failReason = error.message;
      useful.value = false;
      sourceFileType.value = null;
      // UNLOAD OPTIONS
      unloadOption();
    }
  };

  onMounted(() => {
    if (videoRef.value) vRef.value = videoRef.value;
  });

  // 监听其他选项
  watch([() => option.poster], () => {
    loadOption();
  });

  return {
    httpStates,
    sourceFileType,
    useful,
    loadVideo,
  };
};
