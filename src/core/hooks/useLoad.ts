import { ref, watch, watchEffect } from 'vue';

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
 * @param videoSrc 视频源链接
 */
export const useLoad = (videoSrc: string) => {
  /**
   * @description 可用性标志
   */
  const usefulCheck = ref<boolean>(false);
  /**
   *  @description 视频Http加载状态
   */
  const httpState = ref<number>(404);
  /**
   *  @description 视频加载失败原因
   */
  const failReason = ref<string>('Load Error');
  /**
   *  @description 源文件类型
   */
  const sourceFileType = ref<string | null>('');
  /**
   * @description 是否是HLS格式
   * @param url
   */
  const isHls = ref<boolean>(false);

  /**
   * @description 源文件校验，支持h264(.mp4,.webm,.ogg)，hls(m3u8),默认h264格式
   * @param url 源文件链接
   */
  const checkFile = async (url: string) => {
    try {
      const response = await fetch(url);
      httpState.value = response.status;
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
        isHls.value =
          type === 'application/vnd.apple.mpegurl' ||
          type === 'application/x-mpegurl';
        if (isHls.value)
          type = type.slice(0, -3) + type.slice(-3).toUpperCase();
        console.log(type);
        sourceFileType.value = type;
        usefulCheck.value = true;
      } else throw new Error('不支持的视频种类！');
    } catch (error: any) {
      failReason.value = error.message;
      usefulCheck.value = false;
      sourceFileType.value = null;
    }
  };

  // videoSrc监听
  watchEffect(() => {
    checkFile(videoSrc);
  });

  // sourceFile监听
  watch(usefulCheck, () => {
    if (!usefulCheck.value) {
      console.log(
        `视频加载失败:${failReason.value} HTTP STATUS: ${httpState.value}`,
      );
      // TODO: 源文件不存在弹出提示错误
    }
  });

  return {
    usefulCheck,
    httpState,
    failReason,
    sourceFileType,
    isHls,
  };
};
