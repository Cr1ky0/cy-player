import { onBeforeUnmount, onMounted, ref } from 'vue';

export const useViewport = () => {
  const xWidth = ref(0);
  const yWidth = ref(0);
  /**
   * @description 视窗宽高比(%)
   */
  const windowSizeProp = ref((window.innerWidth / window.innerHeight) * 100);

  const handleResize = () => {
    xWidth.value = window.innerWidth;
    yWidth.value = window.innerHeight;
    windowSizeProp.value = (window.innerWidth / window.innerHeight) * 100;
  };

  onMounted(() => {
    window.addEventListener('resize', handleResize);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
  });
  return { xWidth, yWidth, windowSizeProp };
};
