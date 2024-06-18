<script setup lang="ts">
import SvgIcon from '@/components/svgicon/SvgIcon.vue';

export interface ControlToolProps {
  activeIconName: string;
  inactiveIconName?: string;
  flag?: boolean;
  fill?: string;
  fontSize?: string;
  tip?: string; // hover的提示
  onClick?: () => void;
}

const props = defineProps<ControlToolProps>();
const handleClick = () => {
  props.onClick && props.onClick();
};
</script>

<template>
  <div class="cy-player-control-tool">
    <div v-if="tip" class="cy-player-control-tool-hover-tip">{{ tip }}</div>
    <SvgIcon
      v-if="typeof flag !== 'boolean' || flag"
      :icon-name="activeIconName"
      :fill="fill ? fill : 'rgba(255,255,255,.9)'"
      :font-size="fontSize ? fontSize : '20px'"
      :on-click="handleClick"
    />
    <SvgIcon
      v-else-if="inactiveIconName && !flag"
      :icon-name="inactiveIconName"
      :fill="fill ? fill : 'rgba(255,255,255,.9)'"
      :font-size="fontSize ? fontSize : '20px'"
      :on-click="handleClick"
    />
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/css/mixin';

.cy-player-control-tool {
  @include selectable(none);
  @include childCenter();
  height: 100%;
  position: relative;
  cursor: pointer;
  padding: 0 10px;

  .cy-player-control-tool-hover-tip {
    @include xCenterAlign(-130%);
    display: none;
    white-space: nowrap;
    padding: 1px 6px;
    height: 25px;
    line-height: 25px;
    font-size: 14px;
    text-align: center;
    border-radius: 3px;
    background-color: rgba(0, 0, 0, 0.8);
    color: #fff;
    animation: show 0.3s ease;
  }

  &:hover > .cy-player-control-tool-hover-tip {
    display: block;
  }
}
</style>
