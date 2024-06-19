<script setup lang="ts">
import SvgIcon from '@/components/svgicon/SvgIcon.vue';
import Switch from '@/components/switch/Switch.vue';
import { ref } from 'vue';

const flag = ref(false);
const mouseEnter = ref(false);
const handleClick = () => {
  flag.value = !flag.value;
};

const handleMouseEnter = () => {
  mouseEnter.value = true;
};

const handleMouseLeave = () => {
  mouseEnter.value = false;
};
</script>

<template>
  <div
    class="cy-player-controls-setting"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <SvgIcon
      icon-name="set"
      fill="rgba(255,255,255,.8)"
      font-size="20px"
    ></SvgIcon>
    <div v-if="mouseEnter" class="cy-player-controls-setting-function">
      <div class="cy-player-controls-setting-light-off" @click="handleClick">
        <div>关灯</div>
        <Switch :flag="flag"></Switch>
      </div>
      <div class="cy-player-controls-setting-loop">
        <div>循环播放</div>
        <Switch :flag="flag"></Switch>
      </div>
    </div>
    <div v-if="mouseEnter" class="cy-player-controls-setting-bottom"></div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/css/mixin';
@import '@/assets/css/var';

.cy-player-controls-setting {
  @include selectable(none);
  @include childCenter;
  height: 100%;
  position: relative;
  cursor: pointer;
  padding: 0 10px;

  .cy-player-controls-setting-bottom {
    @include xCenterAlign(-100%);
    background-color: transparent;
    width: 120px;
    height: 20px;
    z-index: $top-layer;
    cursor: default;
  }

  .cy-player-controls-setting-function {
    @include xCenterAlign(-115%);
    color: #fff;
    width: 100px;
    padding: 10px;
    border-radius: 3px;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    flex-direction: column;
    z-index: $top-layer;
    cursor: default;
    animation: show .3s ease;

    > div {
      margin: 5px 0;
    }

    .cy-player-controls-setting-light-off {
      display: flex;
      justify-content: space-between;
      cursor: pointer;

      > div:first-child {
        font-size: 14px;
        width: 75px;
        text-align: center;
        letter-spacing: 6px;
      }
    }

    .cy-player-controls-setting-loop {
      @extend .cy-player-controls-setting-light-off;

      > div:first-child {
        letter-spacing: 2px;
      }
    }
  }
}
</style>
