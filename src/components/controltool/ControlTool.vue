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
  <div class="cy-player-control-tool" @click="handleClick">
    <div v-if="tip" class="cy-player-control-tool-hover-tip">{{ tip }}</div>
    <SvgIcon
      v-if="typeof flag !== 'boolean' || flag"
      :icon-name="activeIconName"
      :fill="fill ? fill : 'rgba(255,255,255,.9)'"
      :font-size="fontSize ? fontSize : '1.25rem'"
    />
    <SvgIcon
      v-else-if="inactiveIconName && !flag"
      :icon-name="inactiveIconName"
      :fill="fill ? fill : 'rgba(255,255,255,.9)'"
      :font-size="fontSize ? fontSize : '1.25rem'"
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
  padding: 0 .7rem;

  .cy-player-control-tool-hover-tip {
    @include xCenterAlign(-130%);
    display: none;
    white-space: nowrap;
    padding: .05rem .3rem;
    height: 1.5rem;
    line-height: 1.5rem;
    font-size: .85rem;
    text-align: center;
    border-radius: .2rem;
    background-color: rgba(0, 0, 0, 0.8);
    color: #fff;
    animation: show 0.3s ease;
  }

  &:hover > .cy-player-control-tool-hover-tip {
    display: block;
  }
}
</style>
