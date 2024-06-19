<script setup lang="ts">
export interface SwitchProps {
  flag: boolean;
  onClick: () => void;
}

defineProps<SwitchProps>();
</script>

<template>
  <div
    :class="`cy-player-switch-component ${flag ? 'cy-player-switch-component-active' : ''}`"
    @click="onClick"
  >
    <div
      :class="`cy-player-switch-slider ${flag ? 'cy-player-switch-slider-active' : ''} `"
    ></div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/css/mixin';

.cy-player-switch-component {
  width: 32px;
  height: 16px;
  border-radius: 8px;
  background-color: gray;
  cursor: pointer;
  position: relative;
  transition: background-color 0.3s ease;

  .cy-player-switch-slider {
    @include position(absolute, 0, auto, auto, 0);
    width: 16px;
    height: 16px;
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

.cy-player-switch-component-active {
  background-color: red;
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
