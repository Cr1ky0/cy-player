import { onBeforeUnmount, onMounted, Ref, ref } from 'vue';

export const useMouseCheck = (elemRef?: Ref) => {
  const eRef = ref<HTMLElement | null>(null);
  const mouseEnter = ref(false);
  const isMobile = ref(false);
  const timer = ref<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    mouseEnter.value = true;
  };

  const handleMouseLeave = () => {
    mouseEnter.value = false;
  };

  const handleTouchStart = () => {
    if (timer.value) clearTimeout(timer.value);
    mouseEnter.value = true;
  };

  const handleTouchEnd = () => {
    timer.value = setTimeout(() => {
      mouseEnter.value = false;
    }, 2000);
  };

  onMounted(() => {
    const userAgent = navigator.userAgent;
    isMobile.value =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent,
      );
    if (elemRef && elemRef.value) {
      eRef.value = elemRef.value;
      const elem = <HTMLElement>eRef.value;
      if (isMobile.value) {
        elem.addEventListener('touchstart', handleTouchStart);
        elem.addEventListener('touchend', handleTouchEnd);
      } else {
        elem.addEventListener('mouseenter', handleMouseEnter);
        elem.addEventListener('mouseleave', handleMouseLeave);
      }
    }
  });

  onBeforeUnmount(() => {
    if (eRef.value) {
      const elem = <HTMLElement>eRef.value;
      if (isMobile.value) {
        elem.removeEventListener('touchstart', handleTouchStart);
        elem.removeEventListener('touchend', handleTouchEnd);
      } else {
        elem.removeEventListener('mouseenter', handleMouseEnter);
        elem.removeEventListener('mouseleave', handleMouseLeave);
      }
    }
  });

  return {
    mouseEnter,
    isMobile,
    handleMouseEnter,
    handleMouseLeave,
    handleTouchStart,
    handleTouchEnd,
  };
};
