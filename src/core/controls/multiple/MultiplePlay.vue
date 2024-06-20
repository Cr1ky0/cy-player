<script setup lang="ts">
import { inject, ref, Ref } from 'vue';
import { useMouseCheck } from '@/utils/useMouseCheck.ts';

const multiples = ['2.0x', '1.75x', '1.5x', '1.25x', '1.0x', '0.75x', '0.5x'];
const videoRef = <Ref>inject('videoRef');
const chosenIndex = ref(4);

const { mouseEnter, handleMouseEnter, handleMouseLeave } = useMouseCheck();

const handleClick = (index: number) => {
  const chosenMultiple = parseFloat(multiples[index]);
  const element = <HTMLVideoElement>videoRef.value;
  element.playbackRate = chosenMultiple;
  chosenIndex.value = index;
};
</script>

<template>
  <div
    class="cy-player-multiple-play"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="cy-player-multiple-icon">倍速</div>
    <div v-if="mouseEnter" class="cy-player-multiple-function">
      <div
        v-for="(item, index) in multiples"
        :key="index"
        @click="handleClick(index)"
        :class="index === chosenIndex ? 'cy-player-multiple-chosen-style' : ''"
      >
        {{ item }}
      </div>
    </div>
    <div v-if="mouseEnter" class="cy-player-multiple-bottom"></div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/css/mixin';
@import '@/assets/css/var';

.cy-player-multiple-play {
  @include childCenter;
  @include selectable(none);
  position: relative;
  padding: 0 10px;
  cursor: pointer;
  z-index: $top-layer;

  .cy-player-multiple-icon {
    color: rgba(255, 255, 255, 0.8);
    font-size: 16px;
    line-height: 20px;
  }

  .cy-player-multiple-function {
    @include xCenterAlign(-105%);
    background-color: rgba(0, 0, 0, 0.8);
    width: 80px;
    z-index: $top-layer;
    display: flex;
    flex-direction: column;
    border-radius: 3px;
    overflow: hidden;
    animation: show .3s ease;

    .cy-player-multiple-chosen-style {
      color: red !important;
    }

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

  .cy-player-multiple-bottom {
    @include xCenterAlign(-100%);
    width: 100%;
    height: 20px;
    background-color: transparent;
  }
}
</style>
