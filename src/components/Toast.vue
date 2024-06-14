<script setup lang="ts">
import { onMounted } from 'vue';
import { useToast } from '@/utils/useToast.ts';

export type ToastPosition =
  | 'left-top'
  | 'right-top'
  | 'left-bottom'
  | 'right-bottom'
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
  }, props.duration || 200000);
});
</script>

<template>
  <div id="player-toast" :class="`toast-${position}`">{{ message }}</div>
</template>

<style scoped lang="scss">
@mixin position($type, $top, $bottom, $right, $left) {
  position: $type;
  left: $left;
  top: $top;
  right: $right;
  bottom: $bottom;
}

$x-dist: 1.5%;
$y-dist: 3%;

#player-toast {
  width: 120px;
  height: 40px;
  line-height: 40px;
  background-color: rgba(0, 0, 0, 0.4);
  text-align: center;
}

.toast-left-top {
  @include position(absolute, $y-dist, auto, auto, $x-dist);
}

.toast-left-bottom {
  @include position(absolute, auto, $y-dist, auto, $x-dist);
}

.toast-right-top {
  @include position(absolute, $y-dist, auto, $x-dist, auto);
}

.toast-right-bottom {
  @include position(absolute, auto, $y-dist, $x-dist, auto);
}

.toast-center {
  @include position(absolute, 45%, auto, auto, 45%);
}
</style>
