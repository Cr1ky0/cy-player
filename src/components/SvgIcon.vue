<script setup lang="ts">
import { computed, CSSProperties } from 'vue';

export interface SvgIconProps {
  iconName: string;
  fill?: string;
  fontSize?: string;
  className?: string;
  styles?: CSSProperties;
}

const props = defineProps<SvgIconProps>();
const style = computed(() => {
  return {
    fontSize: props.fontSize ? props.fontSize : '18px',
    ...props.styles,
  };
});
</script>

<template>
  <svg :class="className" :style="style" aria-hidden="true">
    <use :href="`#icon-${iconName}`" fill="red" aria-hidden="true"></use>
  </svg>
</template>

<style scoped></style>
