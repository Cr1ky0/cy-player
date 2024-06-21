<script setup lang="ts">
import { PlayerOption, VideoState } from '@/types';
import { computed, inject, ref, watchEffect } from 'vue';
import { useMouseCheck } from '@/utils/useMouseCheck.ts';

const playerOption = <PlayerOption>inject('playerOption');
const videoStates = <VideoState>inject('videoStates');
const chosenIndex = ref(0);

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

const { mouseEnter, handleMouseEnter, handleMouseLeave } = useMouseCheck();

const handleChangeQuality = (index: number) => {
  const curSrc = srcs.value[index];
  videoStates.curSrc = curSrc;
  chosenIndex.value = index;
  localStorage.setItem('curSrc', curSrc);
};

watchEffect(() => {
  if (playerOption.quality) {
    // 选中颜色是根据url来判断的,quality中的src与curSrc相符的
    chosenIndex.value = playerOption.quality.findIndex((item) => {
      return item.src === videoStates.curSrc;
    });
  }
});
</script>

<template>
  <div
    class="cy-player-quality"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="cy-player-quality-icon">{{ chosenItem }}</div>
    <div v-if="mouseEnter" class="cy-player-quality-function">
      <div
        v-for="(item, index) in qualities"
        :key="index"
        :style="index === chosenIndex ? themeColorStyle : ''"
        @click="handleChangeQuality(index)"
      >
        {{ item }}
      </div>
    </div>
    <div v-if="mouseEnter" class="cy-player-quality-bottom"></div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/css/mixin';
@import '@/assets/css/var';

.cy-player-quality {
  @include childCenter;
  @include selectable(none);
  position: relative;
  padding: 0 10px;
  cursor: pointer;
  z-index: $top-layer;

  .cy-player-quality-icon {
    color: rgba(255, 255, 255, 0.8);
    font-size: 16px;
    line-height: 20px;
  }

  .cy-player-quality-function {
    @include xCenterAlign(-110%);
    background-color: rgba(0, 0, 0, 0.8);
    width: 80px;
    z-index: $top-layer;
    display: flex;
    flex-direction: column;
    border-radius: 3px;
    overflow: hidden;
    animation: show 0.3s ease;

    > div {
      width: 100%;
      padding: 8px 0;
      font-size: 14px;
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
    height: 20px;
    background-color: transparent;
  }
}
</style>
