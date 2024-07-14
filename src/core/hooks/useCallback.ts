import { VideoCallback, VideoState } from 'types';
import { readonly, watch } from 'vue';

export const useCallback = (videoStates: VideoState, emits: VideoCallback) => {
  // 播放和暂停的回调（含自动播放）
  watch(
    () => videoStates.isPlay,
    () => {
      if (videoStates.isPlay) {
        emits('play', readonly(videoStates));
      } else {
        emits('pause', readonly(videoStates));
      }
    },
  );

  // 播放结束回调
  watch(
    () => videoStates.isPlayEnd,
    () => {
      if (videoStates.isPlayEnd) {
        emits('playEnd', readonly(videoStates));
      }
    },
  );

  // 声音改变回调
  watch(
    () => videoStates.volume,
    () => {
      emits('volumeChange', readonly(videoStates));
    },
  );

  // 播放时间改变回调
  watch(
    () => videoStates.currentPlayTime,
    () => {
      emits('timeChange', readonly(videoStates));
    },
  );

  // 视频等待回调
  watch(
    () => videoStates.isWaiting,
    () => {
      emits('waiting', readonly(videoStates));
    },
  );

  // 错误回调
  watch(
    () => videoStates.isError,
    () => {
      emits('error');
    },
  );
};
