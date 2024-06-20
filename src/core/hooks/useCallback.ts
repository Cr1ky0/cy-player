import { VideoCallback, VideoState } from '@/types';
import { watch } from 'vue';

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
  } = callbacks;
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
};
