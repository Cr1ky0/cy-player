// 视频种类
export type SourceType = 'h264' | 'hls';
// 视频清晰度选项
export type VideoQuality =
  | '360p'
  | '480p'
  | '720p'
  | '1080p'
  | '2K'
  | '4K'
  | '8K';

// quality选项
interface QualityOption {
  vQ: VideoQuality;
  src: string;
  chosen?: boolean;
}

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
   * @description 播放器根样式
   */
  styles?: CSSProperties;
  /**
   * @description 遮罩图标位置，默认center
   */
  maskIconPlacement?: Position;
  /**
   * @description Toast位置
   */
  toastPlacement?: Position;
  /**
   * @description 播放器清晰度指定
   */
  quality?: QualityOption[];
  /**
   * @description 源视频种类
   */
  sourceType?: SourceType;
  /**
   * @description 播放器主题颜色
   */
  themeColor?: T;
  /**
   * @description 控制器根样式
   */
  controllerStyles?: CSSProperties;
  /**
   * @description 是否保持controller显示
   */
  keepControllerShow?: U;
  /**
   * @description 是否显示setting
   */
  isSettingShow?: U;
  /**
   * @description 是否显示画中画
   */
  isPicInPicShow?: U;
  /**
   * @description 是否显示网页全屏
   */
  isWebScreenFullShow?: U;
  /**
   * @description 是否显示全屏
   */
  isScreenFullShow?: U;
  /**
   * @description 是否显示倍速播放
   */
  isMultiplePlayShow?: U;
  /**
   * @description 视频质量是否进行默认选择记忆
   */
  qualitySave?: U;
}

// Video回调
export type CallbackType<T = VideoState> = (e: T) => void;
// export type HttpLoadState = {
//   /**
//    *  @description 视频Http加载状态
//    */
//   httpStateCode: number;
//   /**
//    *  @description 视频加载失败原因
//    */
//   failReason: string;
// };

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
   * @description 视频加载错误回调
   */
  onError?: () => void;
  /**
   * @description 视频等待时回调
   */
  onWaiting?: T;
}

// Video状态
export interface VideoState<T = number, U = boolean, K = string> {
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
  /**
   * @description 视频是否循环播放
   */
  isLoop: U;
  /**
   * @description 当前src
   */
  curSrc: K;
  /**
   * @description 是否错误
   */
  isError: U;
  /**
   * @description 当前video自己的宽度
   */
  videoWidth: T;
  /**
   * @description 当前video自己的宽度
   */
  videoHeight: T;
}

// Video操作
export interface VideoController {
  load: () => void;
  play: () => void;
  pause: () => void;
  setVolume: (volume: number) => void;
  setCurTime: (curTime: number) => void;
}
