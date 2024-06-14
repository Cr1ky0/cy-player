<script setup lang="ts">
import { CSSProperties } from 'vue';

export interface SvgIconProps {
  iconName: string;
  fill: string;
  fontSize?: string;
  className?: string;
  styles?: CSSProperties;
}

defineProps<SvgIconProps>();
</script>

<template>
  <svg
    :class="className"
    :font-size="fontSize || '18px'"
    :style="styles"
    aria-hidden="true"
  >
    <use :href="`#icon-${iconName}`" :fill="fill"></use>
  </svg>
</template>

<style scoped>
svg {
  width: 1em;
  height: 1em;
}
</style>
