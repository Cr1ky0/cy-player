import { HttpLoadState, VideoCallback, VideoState } from '@/types';
import { watch, watchEffect } from 'vue';

export const useCallback = (
  videoStates: VideoState,
  loadStates: HttpLoadState,
  callbacks: VideoCallback,
) => {
  const { onPlay, onPlayEnd, onVolumeChange, onPause, onTimeChange, onError } =
    callbacks;
  // 播放和暂停的回调（含自动播放）
  watch(
    () => videoStates.isPlay,
    () => {
      if (videoStates.isPlay) {
        onPlay && onPlay(videoStates);
      } else {
        onPause && onPause(videoStates);
      }
    },
  );

  // 播放结束回调
  watch(
    () => videoStates.isPlayEnd,
    () => {
      if (videoStates.isPlayEnd) {
        onPlayEnd && onPlayEnd(videoStates);
      }
    },
  );

  // 声音改变回调
  watch(
    () => videoStates.volume,
    () => {
      onVolumeChange && onVolumeChange(videoStates);
    },
  );

  // 播放时间改变回调
  watch(
    () => videoStates.currentPlayTime,
    () => {
      onTimeChange && onTimeChange(videoStates);
    },
  );

  // 视频加载错误回调
  watchEffect(() => {
    if (!loadStates.usefulCheck.value) onError && onError(loadStates);
  });
};
