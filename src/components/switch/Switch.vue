<script setup lang="ts">
import { PlayerOption } from 'types';
import { computed, inject } from 'vue';

export interface SwitchProps {
  flag: boolean;
  onClick?: () => void;
}

const props = defineProps<SwitchProps>();
const playerOption = <PlayerOption>inject('playerOption');
const themeColorStyle = computed(() => {
  return { backgroundColor: playerOption.themeColor || '#00aeec' };
});
const handleClick = () => {
  props.onClick && props.onClick();
};
</script>

<template>
  <div
    class="cy-player-switch-component"
    @click="handleClick"
    :style="flag ? themeColorStyle : undefined"
  >
    <div
      :class="`cy-player-switch-slider ${flag ? 'cy-player-switch-slider-active' : ''} `"
    ></div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/css/mixin';

.cy-player-switch-component {
  width: 2rem;
  height: 1rem;
  border-radius: 0.5rem;
  background-color: gray;
  cursor: pointer;
  position: relative;
  transition: background-color 0.3s ease;

  .cy-player-switch-slider {
    @include position(absolute, 0, auto, auto, 0);
    width: 1rem;
    height: 1rem;
    border-radius: 100%;
    background-color: #fff;
    transition-property: left, transform;
    transition-duration: 0.3s;
    transition-timing-function: ease;
  }

  .cy-player-switch-slider-active {
    left: 100%;
    transform: translateX(-100%);
  }
}

@keyframes slide {
  0% {
    left: 0;
  }
  100% {
    left: 100%;
    transform: translateX(-100%);
  }
}
</style>
