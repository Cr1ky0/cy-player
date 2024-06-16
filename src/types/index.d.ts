// 位置选项
export type Position =
  | 'left-top'
  | 'right-top'
  | 'left-bottom'
  | 'right-bottom'
  | 'center';

// Player选项
import { CSSProperties } from 'vue';

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
   * @description 播放器高度
   */
  height?: T | K;
  /**
   * @description 播放器宽度
   */
  width?: T | K;
  /**
   * @description 视频封面
   */
  poster?: T;
  /**
   * @description 是否显示Toast
   */
  showToast?: U;
  /**
   * @description container css样式
   */
  styles?: CSSProperties;
  /**
   * @description 遮罩图标位置
   */
  maskIconPlacement?:
}

// Video回调
export type CallbackType<T = VideoState> = (e: T) => void;
export type HttpLoadState = {
  /**
   *  @description 视频Http加载状态
   */
  httpStateCode: number;
  /**
   *  @description 视频加载失败原因
   */
  failReason: string;
};

export interface VideoCallback<T = CallbackType> {
  /**
   * @description 视频开始播放回调
   */
  onPlay?: T;
  /**
   * @description 视频暂停播放的回调
   */
  onPause?: T;
  /**
   * @description 视频在播放，时间变化回调
   */
  onTimeChange?: T;
  /**
   * @description 视频结束时回调
   */
  onPlayEnd?: T;
  /**
   * @description 音量改变时的回调
   */
  onVolumeChange?: T;
  /**
   * @description 视频加载成功以后回调
   */
  onLoaded?: T;
  /**
   * @description 视频加载错误回调
   */
  onError?: (e: HttpLoadState) => void;
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
  isPlayEnd: U;
  /**
   * @description 视频播放过程中的waiting
   */
  isWaiting: U;
}

// Video操作
export interface VideoController {
  load: () => void;
  play: () => void;
  pause: () => void;
  setVolume: (volume: number) => void;
  setCurTime: (curTime: number) => void;
}
