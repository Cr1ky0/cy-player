<script setup lang="ts">
import SvgIcon from '@/components/svgicon/SvgIcon.vue';

export interface ControlToolProps {
  iconName: string;
  fill?: string;
  fontSize?: string;
  tip?: string; // hover的提示
  onClick?: (e: MouseEvent) => void;
}

const props = defineProps<ControlToolProps>();

const handleClick = (e: MouseEvent) => {
  props.onClick && props.onClick(e);
};
</script>

<template>
  <div class="cy-player-control-tool">
    <div v-if="tip" class="cy-player-control-tool-hover-tip">{{ tip }}</div>
    <SvgIcon
      :icon-name="iconName"
      :fill="fill ? fill : 'rgba(255,255,255,.8)'"
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
    @include position(absolute, 0, auto, auto, -25%);
    transform: translateY(-130%);
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
