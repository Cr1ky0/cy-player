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
   *  @description 视频Http加载状态
   */
  const httpState = ref<number>(404);
  /**
   *  @description 视频加载失败原因
   */
  const failReason = ref<string>('Load Error');
  /**
   *  @description 下载的视频源文件
   */
  const sourceFile = ref<string | null>('');
  /**
   *  @description 下载的源文件类型
   */
  const sourceFileType = ref<string | null>('');

  // download
  const downloadFile = async (url: string) => {
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
        // file source
        const blob = await response.blob();
        sourceFile.value = URL.createObjectURL(blob);
      } else throw new Error('类型不匹配');
    } catch (error: any) {
      failReason.value = error.message;
      sourceFile.value = null;
      sourceFileType.value = null;
    }
  };

  // videoSrc监听
  watchEffect(() => {
    downloadFile(videoSrc);
  });

  // sourceFile监听
  watch(sourceFile, () => {
    if (!sourceFile.value) {
      console.log(
        `视频加载失败:${failReason.value} HTTP STATUS: ${httpState.value}`,
      );
      // TODO: 源文件不存在弹出提示错误
    }
  });

  return {
    httpState,
    failReason,
    sourceFile,
    sourceFileType,
  };
};
