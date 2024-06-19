<script setup lang="ts">
import SvgIcon from '@/components/svgicon/SvgIcon.vue';
import Switch from '@/components/switch/Switch.vue';
import { ref } from 'vue';

const flag = ref(false);

const handleClick = () => {
  flag.value = !flag.value;
};
</script>

<template>
  <div class="cy-player-controls-setting">
    <SvgIcon
      icon-name="set"
      fill="rgba(255,255,255,.8)"
      font-size="20px"
    ></SvgIcon>
    <div class="cy-player-controls-setting-function">
      <Switch :flag="flag" :on-click="handleClick"></Switch>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/css/mixin';

.cy-player-controls-setting {
  @include selectable(none);
  @include childCenter;
  height: 100%;
  position: relative;
  cursor: pointer;
  padding: 0 10px;

  .cy-player-controls-setting-function {
    @include xCenterAlign(-115%);
    width: 100px;
    height: 60px;
    border-radius: 3px;
    background-color: rgba(0, 0, 0, 0.8);
    cursor: default;
  }
}
</style>
