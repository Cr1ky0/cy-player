// VideoType
export type VideoType = 'h264' | 'hls';


// Player Props
export interface PlayerProps {
    option: PlayerOption
}

// Player选项
export interface PlayerOption<T = string, U = boolean> {
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
}