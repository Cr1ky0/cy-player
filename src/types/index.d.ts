// VideoType
export type VideoType = 'h264' | 'hls';

// Player Props
export interface PlayerProps {
  option: PlayerOption;
}

// Player选项
export interface PlayerOption<T = string, U = boolean, K = number> {
  /**
   * @description 视频地址
   */
  videoSrc: T;
  /**
   * @description 自动播放
   */
  autoPlay?: U;
  /**
   * @description 视频播放格式，支持h264(.mp4,.webm,.ogg)，hls(m3u8),默认h264格式
   */
  videoType?: VideoType;
  /**
   * @description 播放器高度
   */
  height?: number;
  /**
   * @description 播放器宽度
   */
  width?: number;
}

// Video状态
export interface VideoState<T = number, U = boolean> {
  /**
   * @description 是否播放
   */
  isPlay: U;
  /**
   * @description 当前播放时间/s
   */
  currentPlayTime: T;
  /**
   * @description 总时长
   */
  duration: T;
  /**
   * @description 缓存时长/s
   */
  bufferedTime: T;
  /**
   * @description 音量
   */
  volume: T;

  /**
   * @description 是否结束
   */
  isPlayEnd: K;
}
