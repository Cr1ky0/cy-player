<script setup lang="ts">
import { computed, inject, ref, Ref } from 'vue';
import { PlayerOption } from 'types';
import { useToast } from '@/core/hooks/useToast.ts';

const multiples = ['2.0x', '1.75x', '1.5x', '1.25x', '1.0x', '0.75x', '0.5x'];
const videoRef = <Ref>inject('videoRef');
const playerOption = <PlayerOption>inject('playerOption');
const chosenIndex = ref(4);
const showFunc = ref(false);

const themeColorStyle = computed(() => {
  return {
    color: playerOption.themeColor ? playerOption.themeColor : '#00aeec',
  };
});

const { showToast } = useToast(playerOption);
const handleClick = (index: number) => {
  const chosenMultiple = parseFloat(multiples[index]);
  const element = <HTMLVideoElement>videoRef.value;
  element.playbackRate = chosenMultiple;
  chosenIndex.value = index;
  showToast(`当前倍速：${chosenMultiple}`);
};
</script>

<template>
  <div class="cy-player-multiple-play" @click="showFunc = !showFunc">
    <div class="cy-player-multiple-icon">倍速</div>
    <div v-if="showFunc" class="cy-player-multiple-function">
      <div
        v-for="(item, index) in multiples"
        :key="index"
        :style="index === chosenIndex ? themeColorStyle : ''"
        @click="handleClick(index)"
      >
        {{ item }}
      </div>
    </div>
    <div v-if="showFunc" class="cy-player-multiple-bottom"></div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/css/mixin';
@import '@/assets/css/var';

.cy-player-multiple-play {
  @include childCenter;
  @include selectable(none);
  position: relative;
  padding: 0 0.7rem;
  cursor: pointer;
  z-index: $top-layer;

  .cy-player-multiple-icon {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1rem;
    line-height: 1.25rem;
  }

  .cy-player-multiple-function {
    @include xCenterAlign(-105%);
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

  .cy-player-multiple-bottom {
    @include xCenterAlign(-100%);
    width: 100%;
    height: 1.25rem;
    background-color: transparent;
  }
}
</style>
