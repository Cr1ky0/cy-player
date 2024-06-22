import { onBeforeUnmount, onMounted, ref } from 'vue';

export const useViewport = () => {
  const xWidth = ref(0);
  const yWidth = ref(0);

  const handleResize = () => {
    xWidth.value = window.innerWidth;
    yWidth.value = window.innerHeight;
  };

  onMounted(() => {
    window.addEventListener('resize', handleResize);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
  });
  return { xWidth, yWidth };
};
