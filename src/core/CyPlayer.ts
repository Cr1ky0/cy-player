import { VideoQuality, VideoState } from 'types';

export const cyPlayerEmits = {
  play: (args: VideoState) => args !== null,
  pause: (args: VideoState) => args !== null,
  timeChange: (args: VideoState) => args !== null,
  playEnd: (args: VideoState) => args !== null,
  volumeChange: (args: VideoState) => args !== null,
  error: () => true,
  waiting: (args: VideoState) => args !== null,
  progressMouseDown: (args: VideoState) => args !== null,
  progressMouseMove: (args: VideoState) => args !== null,
  progressMouseUp: (args: VideoState) => args !== null,
  qualityChange: (quality: VideoQuality) => quality !== null,
  playerMounted: (
    videoElement: HTMLVideoElement,
    containerElement: HTMLDivElement,
  ) => videoElement !== null && containerElement !== null,
  playerBeforeUnmount: (
    videoElement: HTMLVideoElement,
    containerElement: HTMLDivElement,
  ) => videoElement !== null && containerElement !== null,
};
