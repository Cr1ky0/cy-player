import { ref, watch, watchEffect } from 'vue';

/**
 *  @description 支持的HTTP传输对象类别(Content-Type)
 */
export const supportTypes = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/m3u8',
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

  // CheckFile
  const checkFile = async (url: string) => {
    try {
      const response = await fetch(url);
      httpState.value = response.status;
      if (!response.ok) {
        throw new Error('HTTP传输失败');
      }
      // content type
      const contentType = response.headers.get('content-type');
      // 类型检测
      if (contentType && supportTypes.includes(contentType)) {
        sourceFileType.value = contentType;
        usefulCheck.value = true;
      } else throw new Error('类型不匹配');
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
  };
};
