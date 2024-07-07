<p align="center">
  <img src="https://cr1ky0-storage.oss-cn-chengdu.aliyuncs.com/player.png" alt="player" style="width:600px;height:350px;"/>
</p>


<h1 align="center">Cy Player</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/cy-player">
    <img src="https://img.shields.io/badge/npm-1.3.6-blue" alt="npm:1.3.6">
  </a>
  <a href="https://github.com/Cr1ky0/cy-player">
    <img src="https://img.shields.io/badge/github-1.3.6-blue" alt="github">
  </a>
  <a href="https://github.com/microsoft/TypeScript">
    <img src="https://img.shields.io/badge/typescript-5.2.2-blue" alt="typescript:5.2.2">
  </a>
  <a href="https://github.com/vuejs/vue">
    <img src="https://img.shields.io/badge/vue-3.4.21-brightgreen" alt="vue:3.4.21">
  </a>
</p>
<p align="center">
   轻量化、性能优秀、美观的Vue3视频播放器组件
</p>

## 说明

- 组件未经过严格测试，出现bug请及时反馈~
- 组件使用Typescript和Vue3进行开发，代码逻辑比较清晰注释完善，如有需要可以自己拿来定制开发~
- 参考了部分[JoL-Player](https://github.com/lgf196/JoL-player)实现和功能，沿用了一些其中的素材，如果喜欢也请支持一下他~
- 该组件如果对你有帮助请点一个⭐，如果有需要的其他功能请反馈~

## 特性

- 支持`Vue3.0+`版本，支持响应式参数传递
- 使用Typescript开发，提供完整类型定义
- 支持PC、移动端使用，支持视频自适应缩放，支持自定义插槽和自定义回调函数
- 支持`HLS`(`application/x-mpegurl`,`application/vnd.apple.mpegurl`)以及`H264`(`video/mp4`,`video/ogg`,`video/webm`)格式的视频播放

## 安装

#### npm

```bash
npm install cy-player-vue --save
```

#### yarn

```bash
yarn add cy-player-vue 
```

## 示例

```vue
<script setup lang="ts">
import 'cy-player';
import {PlayerOption,VideoCallback} from 'cy-player'
import {reactive} from 'vue';
// 响应式option
const option = reactive<PlayerOption>({
  videoSrc:
    'https://cdn.pixabay.com/video/2024/03/31/206294_small.mp4?download',
});
const callbacks = reactive<VideoCallback>({
    onPlay:(e)=>{console.log(e)}
})
</script>
<template>
  <cy-player :option="option" :callback="callbacks"/>
</template>
```

## 文档

#### 组件option参数

| 参数                    | 说明                                                         | 类型               | 默认值            |
| ----------------------- | ------------------------------------------------------------ | ------------------ | ----------------- |
| videoSrc                | 视频地址（必传）                                             | `string`           | 必传              |
| sourceType              | 源视频格式，选择`auto`需要源视频的跨域支持                   | `SourceType`       | h264              |
| autoPlay                | 自动播放                                                     | `boolean`          | false             |
| themeColor              | 播放器主题颜色                                               | `string`           | #00aeec           |
| styles                  | 容器元素样式                                                 | `CSSProperties`    | -                 |
| controllerStyles        | 控制器根样式                                                 | `CSSProperties`    | -                 |
| height                  | 容器元素高度                                                 | `string \| number` | 根据video元素计算 |
| width                   | 容器元素宽度                                                 | `string \| number` | 根据video元素计算 |
| videoAutoFix            | video尺寸自适应，根据`video本身加载的视频`尺寸比例以及`容器元素`尺寸比例自动计算video元素在容器元素中的位置和大小；例如在一个较宽的容器中播放一个较窄的视频，即`容器元素宽高比 > video元素宽高比`时video元素占满整个容器的高度，宽度按照video加载的视频比例计算。 | `boolean`          | true              |
| poster                  | 视频封面                                                     | `string`           | -                 |
| showToast               | 是否显示Toast提示（不支持响应式）                            | `boolean`          | true              |
| keepControllerShow      | 是否始终显示控制器                                           | `boolean`          | false             |
| isSettingShow           | 是否显示setting按钮                                          | `boolean`          | true              |
| isPicInPicShow          | 是否显示画中画按钮                                           | `boolean`          | true              |
| isWebScreenFullShow     | 是否显示网页全屏按钮                                         | `boolean`          | true              |
| isScreenFullShow        | 是否显示全屏按钮                                             | `boolean`          | true              |
| isMultiplePlayShow      | 是否显示倍速播放按钮                                         | `boolean`          | true              |
| showProgressFloat       | 是否显示悬浮进度条（controller隐藏后的进度条）               | `boolean`          | true              |
| toastPlacement          | Toast显示位置                                                | `Position`         | left-top          |
| customizedItemPlacement | 自定义组件(`customized`插槽)在屏幕上的位置                   | `Position`         | center            |
| maskIconPlacement       | 遮罩图标位置（也是暂停、重播等自定义插槽的位置）             | `Position`         | center            |
| quality                 | 播放器清晰度列表，如果不指定则不显示清晰度切换按钮，`chosen`为true时初始化默认加载该视频 | `QualityOption[]`  | -                 |

#### 回调函数

| 名称                  | 说明                                                     | 类型                                                         |
| --------------------- | -------------------------------------------------------- | ------------------------------------------------------------ |
| onPlay                | 视频开始播放时回调                                       | `CallbackType`                                               |
| onPause               | 视频停止播放时回调                                       | `CallbackType`                                               |
| onPlayEnd             | 视频播放结束时回调                                       | `CallbackType`                                               |
| onWaiting             | 视频处于waiting事件时回调                                | `CallbackType`                                               |
| onTimeChange          | 视频播放事件更新时回调                                   | `CallbackType`                                               |
| onVolumeChange        | 视频音量更改时回调                                       | `CallbackType`                                               |
| onError               | 视频触发`error`事件时回调                                | () => void                                                   |
| onQualityChange       | 视频质量切换时回调                                       | (quality: `VideoQuality`) => void                            |
| onPlayerMounted       | 组件加载时onMounted中执行回调                            | (   videoRef: `HTMLVideoElement`,  containerElem: `HTMLDivElement`) => void |
| onPlayerBeforeUnmount | 组件卸载时onBeforeUnmount中执行回调                      | (   videoRef: `HTMLVideoElement`,  containerElem: `HTMLDivElement`) => void |
| onProgressMouseDown   | 进度条触发`mousedown`或`touchstart`回调                  | `CallbackType`                                               |
| onProgressMouseMove   | 进度条处于拖拽状态时全局触发`mousemove`或`touchmove`回调 | `CallbackType`                                               |
| onProgressMouseUp     | 进度条处于拖拽状态时全局触发`mouseup`或`touchend`回调    | `CallbackType`                                               |

#### 自定义插槽

| 插槽名     | 说明                                                         |
| ---------- | ------------------------------------------------------------ |
| customized | 自定义界面组件，可通过`customizedItemPlacement`配置项配置其在根容器中的位置 |
| slider     | 自定义进度条拖动滑块                                         |
| playend    | 自定义播放结束时遮罩组件（会替换默认的播放结束遮罩）         |
| waiting    | 自定义`waiting`事件遮罩组件（会替换默认的等待时遮罩）        |
| paused     | 自定义暂停时遮罩组件（会替换默认的暂停时遮罩）               |
| error      | 自定义`error`事件触发时组件（会替换默认的视频加载错误时遮罩） |

#### 组件ref

##### 示例

```vue
<script setup lang='ts'>
import {ref} from 'vue';
import {CyPlayerRef,CyPlayer} from 'cy-player';
const playerRef = ref<CyPlayerRef>();
const handleSetCurTime = () => {
    playerRef.value!.controller.setCurTime(5);
    console.log(playerRef.value!.states)
    console.log(playerRef.value!.videoElement)
}
</script>
<templaye>
  <CyPlayer ref="playerRef" :option="{src:''}"></CyPlayer>
  <button @click="handleSetCurTime">Click</button>
</templaye>
```

##### Controller

| 名称        | 说明                                     | 类型                      |
| ----------- | ---------------------------------------- | ------------------------- |
| load        | HTMLVideoElement.load                    | () => void                |
| play        | HTMLVideoElement.play                    | () => void                |
| pause       | HTMLVideoElement.pause                   | () => void                |
| setVolume   | 设置音量，`volume`参数值范围为`0-100`    | (volume: number) => void  |
| setCurTime  | 设置当前播放时间                         | (curTime: number) => void |
| setVideoSrc | 设置video元素的src（会触发重新更新加载） | (src: string) => void     |

##### ref接口

```typescript
// ref接口
export type CyPlayerRef = {
  states: VideoState;
  controller: VideoController;
  videoElement: HTMLVideoElement;
};
```

#### 部分接口

```typescript
// 视频种类
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

// 位置选项
export type Position =
  | 'left-top'
  | 'right-top'
  | 'left-bottom'
  | 'right-bottom'
  | 'center';

// quality选项
export interface QualityOption {
  vQ: VideoQuality;
  src: string;
  chosen?: boolean;
}

// 回调
export type CallbackType<T = VideoState> = (e: T) => void;

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
   * @description 视频播放过程中的waiting事件触发
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
```

#### Tips

**练习作，请见谅**

