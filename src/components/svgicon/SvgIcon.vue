<script setup lang="ts">
import { computed, CSSProperties } from 'vue';

export interface SvgIconProps {
  iconName: string;
  fill: string;
  fontSize?: string;
  styles?: CSSProperties;
  onClick?: (e: MouseEvent) => void;
}

const props = defineProps<SvgIconProps>();
const click = computed(() => {
  return (e: MouseEvent) => {
    props.onClick && props.onClick(e);
  };
});
</script>

<template>
  <svg
    :style="{
      ...styles,
      fontSize: fontSize || '1.125rem',
      width: fontSize,
      height: fontSize,
    }"
    @click="click"
    aria-hidden="true"
  >
    <use :href="`#icon-${iconName}`" :fill="fill"></use>
  </svg>
</template>

<style scoped lang="scss">
@import '@/assets/css/mixin';

svg {
  @include selectable(none);
  cursor: pointer;
  overflow: hidden;
}
</style>
