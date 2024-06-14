<script setup lang="ts">
import { computed, CSSProperties } from 'vue';

export interface SvgIconProps {
  iconName: string;
  fill: string;
  fontSize?: string;
  className?: string;
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
    :class="className"
    :font-size="fontSize || '18px'"
    :style="styles"
    @click="click"
    aria-hidden="true"
  >
    <use :href="`#icon-${iconName}`" :fill="fill"></use>
  </svg>
</template>

<style scoped>
svg {
  width: 1em;
  height: 1em;
  overflow: hidden;
}
</style>
