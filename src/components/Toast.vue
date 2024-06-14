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
  }, props.duration || 2000);
});
</script>

<template>
  <div id="player-toast" :class="`toast-pos-default toast-${position}`">
    {{ message }}
  </div>
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
  padding: 0 10px;
  height: 40px;
  line-height: 40px;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  text-align: center;
  animation: show 0.5s ease;
}

.toast-pos-default {
  @include position(absolute, $y-dist, auto, auto, $x-dist);
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
  @include position(absolute, 50%, auto, auto, 50%);
  transform: translate(-50%, -50%);
}

@keyframes show {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
