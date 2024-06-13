import { reactive, ref, watch } from 'vue';
import { HttpLoadState, PlayerOption } from '@/types';

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
 * @param option 播放器选项
 */
export const useLoad = (option: Partial<PlayerOption>) => {
  const httpStates: HttpLoadState = reactive({
    httpStateCode: 404,
    failReason: '',
    usefulCheck: true,
  });
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
        isHls.value =
          type === 'application/vnd.apple.mpegurl' ||
          type === 'application/x-mpegurl';
        if (isHls.value)
          type = type.slice(0, -3) + type.slice(-3).toUpperCase();
        sourceFileType.value = type;
        httpStates.usefulCheck = true;
        httpStates.failReason = '';
      } else throw new Error('不支持的视频种类！');
    } catch (error: any) {
      httpStates.failReason = error.message;
      httpStates.usefulCheck = false;
      sourceFileType.value = null;
    }
  };

  // videoSrc监听
  watch(
    () => option.videoSrc,
    () => {
      checkFile(option.videoSrc);
    },
  );

  // sourceFile监听
  watch(
    () => httpStates.usefulCheck,
    () => {
      if (!httpStates.usefulCheck) {
        console.log(httpStates.failReason, httpStates.httpStateCode);
        // TODO: 错误弹窗
      }
    },
  );

  return {
    httpStates,
    sourceFileType,
    isHls,
  };
};
