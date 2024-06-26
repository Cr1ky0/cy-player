import { VideoCallback, VideoState } from 'types';
import { readonly, watch } from 'vue';

export const useCallback = (
  videoStates: VideoState,
  callbacks: VideoCallback,
) => {
  const {
    onPlay,
    onPlayEnd,
    onVolumeChange,
    onPause,
    onTimeChange,
    onWaiting,
    onError,
  } = callbacks;
  // 播放和暂停的回调（含自动播放）
  watch(
    () => videoStates.isPlay,
    () => {
      if (videoStates.isPlay) {
        onPlay && onPlay(readonly(videoStates));
      } else {
        onPause && onPause(readonly(videoStates));
      }
    },
  );

  // 播放结束回调
  watch(
    () => videoStates.isPlayEnd,
    () => {
      if (videoStates.isPlayEnd) {
        onPlayEnd && onPlayEnd(readonly(videoStates));
      }
    },
  );

  // 声音改变回调
  watch(
    () => videoStates.volume,
    () => {
      onVolumeChange && onVolumeChange(readonly(videoStates));
    },
  );

  // 播放时间改变回调
  watch(
    () => videoStates.currentPlayTime,
    () => {
      onTimeChange && onTimeChange(readonly(videoStates));
    },
  );

  // 视频等待回调
  watch(
    () => videoStates.isWaiting,
    () => {
      onWaiting && onWaiting(readonly(videoStates));
    },
  );

  // 错误回调
  watch(
    () => videoStates.isError,
    () => {
      onError && onError();
    },
  );
};
