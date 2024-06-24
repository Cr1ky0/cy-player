<script setup lang="ts">
import { PlayerOption, VideoCallback, VideoState } from '@/types';
import { computed, inject, ref, watch } from 'vue';

const playerOption = <PlayerOption>inject('playerOption');
const videoStates = <VideoState>inject('videoStates');
const callback = <VideoCallback>inject('callback');
const chosenIndex = ref(-1);
const showFunc = ref(false);

const themeColorStyle = computed(() => {
  return {
    color: playerOption.themeColor ? playerOption.themeColor : '#00aeec',
  };
});

const qualities = computed(() => {
  return playerOption.quality!.map((item) => {
    return item.vQ;
  });
});

const srcs = computed(() => {
  return playerOption.quality!.map((item) => {
    return item.src;
  });
});

const chosenItem = computed(() => {
  return qualities.value[chosenIndex.value];
});

const handleChangeQuality = (index: number) => {
  const curSrc = srcs.value[index];
  videoStates.curSrc = curSrc;
  chosenIndex.value = index;
  localStorage.setItem('curPlayTime', String(videoStates.currentPlayTime)); // 保证切换进度
  // 视频质量切换保存
  if (playerOption.qualitySave) localStorage.setItem('curSrc', curSrc);
  // 视频切换回调
  callback.onQualityChange && callback.onQualityChange(qualities.value[index]);
};

watch(
  () => videoStates.curSrc,
  () => {
    // 优先选择chosen的
    chosenIndex.value = playerOption.quality!.findIndex((item) => {
      return item.chosen;
    });
    if (chosenIndex.value === -1) {
      // 根据url来判断选中颜色,quality中的src与curSrc相符的
      chosenIndex.value = playerOption.quality!.findIndex((item) => {
        return item.src === videoStates.curSrc;
      });
    }
  },
);
</script>

<template>
  <div class="cy-player-quality" @click="showFunc = !showFunc">
    <div class="cy-player-quality-icon">
      {{ chosenItem }}
    </div>
    <div v-if="showFunc" class="cy-player-quality-function">
      <div
        v-for="(item, index) in qualities"
        :key="index"
        :style="index === chosenIndex ? themeColorStyle : ''"
        @click="handleChangeQuality(index)"
      >
        {{ item }}
      </div>
    </div>
    <div v-if="showFunc" class="cy-player-quality-bottom"></div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/css/mixin';
@import '@/assets/css/var';

.cy-player-quality {
  @include childCenter;
  @include selectable(none);
  position: relative;
  padding: 0 0.7rem;
  cursor: pointer;
  z-index: $top-layer;

  .cy-player-quality-icon {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1rem;
    line-height: 1.25rem;
  }

  .cy-player-quality-function {
    @include xCenterAlign(-110%);
    background-color: rgba(0, 0, 0, 0.8);
    width: 5rem;
    z-index: $top-layer;
    display: flex;
    flex-direction: column;
    border-radius: 0.2rem;
    overflow: hidden;
    animation: show 0.3s ease;

    > div {
      width: 100%;
      padding: 0.5rem 0;
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.8);
      text-align: center;

      &:hover {
        background-color: rgba(255, 255, 255, 0.3);
      }
    }
  }

  .cy-player-quality-bottom {
    @include xCenterAlign(-100%);
    width: 100%;
    height: 1.25rem;
    background-color: transparent;
  }
}
</style>
