// 视频种类
import { CSSProperties } from 'vue';

export type SourceType = 'h264' | 'hls' | 'auto';
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
export interface QualityOption {
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
export interface PlayerOption<T = string, U = boolean, K = number> {
  /**
   * @description 视频地址
   */
  videoSrc: T;
  /**
   * @description 播放器高度
   */
  height?: T | K;
  /**
   * @description 播放器宽度
   */
  width?: T | K;
  /**
   * @description video的尺寸自适应
   */
  videoAutoFix?: U;
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
  // qualitySave?: U;
  /**
   * @description 是否显示悬浮提示进度条（controller隐藏后的进度条提示）
   */
  showProgressFloat?: U;
  /**
   * @description 自定义组件在屏幕上的所在位置
   */
  customizedItemPlacement?: Position;
}

// Video回调
export interface VideoCallback<T = VideoState> {
  /**
   * @description 视频开始播放回调
   */
  (e: 'play', arg: T): void;

  /**
   * @description 视频暂停播放的回调
   */
  (e: 'pause', arg: T): void;

  /**
   * @description 视频在播放，时间变化回调
   */
  (e: 'timeChange', arg: T): void;

  /**
   * @description 视频结束时回调
   */
  (e: 'playEnd', arg: T): void;

  /**
   * @description 音量改变时的回调
   */
  (e: 'volumeChange', arg: T): void;

  /**
   * @description 视频加载错误回调
   */
  (e: 'error'): void;

  /**
   * @description 视频等待时回调
   */
  (e: 'waiting', arg: T): void;

  /**
   * @description 视频质量切换时回调
   */
  (e: 'qualityChange', quality: VideoQuality): void;

  /**
   * @description 组件onMounted回调
   */
  (
    e: 'playerMounted',
    videoElement: HTMLVideoElement,
    containerElement: HTMLDivElement,
  ): void;

  /**
   * @description 组件onBeforeUnmount回调
   */
  (
    e: 'playerBeforeUnmount',
    videoElement: HTMLVideoElement,
    containerElement: HTMLDivElement,
  ): void;

  /**
   * @description 进度条MouseDown(TouchStart)事件
   */
  (e: 'progressMouseDown', arg: T): void;

  /**
   * @description 进度条MouseMove(TouchMove)事件
   */
  (e: 'progressMouseMove', arg: T): void;

  /**
   * @description 进度条MouseUp(TouchEnd)事件
   */
  (e: 'progressMouseUp', arg: T): void;
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
   * @description 总时长/s
   */
  duration: T;
  /**
   * @description 缓存时长/s
   */
  bufferedTime: T;
  /**
   * @description 音量(0-100)
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

// Vide控制
export interface VideoController {
  load: () => void;
  play: () => void;
  pause: () => void;
  setVolume: (volume: number) => void;
  setCurTime: (curTime: number) => void;
  setVideoSrc: (src: string) => void;
}

export type CyPlayerRef = {
  states: VideoState;
  controller: VideoController;
  videoElement: HTMLVideoElement;
};

export interface PlayerProps {
  option: PlayerOption;
}
