<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useToast } from '@/utils/useToast.ts';

export type ToastPosition =
  | 'leftTop'
  | 'rightTop'
  | 'leftBottom'
  | 'rightBottom'
  | 'center';

export interface ToastProps {
  message: string;
  duration?: number;
  position?: ToastPosition;
}

const props = defineProps<ToastProps>();
const { closeToast } = useToast(props);
onMounted(() => {
  setTimeout(() => {
    closeToast();
  }, props.duration || 2000);
});
</script>

<template>
  <div id="player-toast">{{ message }}</div>
</template>

<style scoped>
#player-toast {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
