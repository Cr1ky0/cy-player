import { computed, onBeforeUnmount, onMounted, Ref, ref } from 'vue';
import { useToast } from '@/core/hooks/useToast.ts';
import { PlayerOption } from 'types';

export const useScreenFull = (elementRef: Ref, option: PlayerOption) => {
  /**
   * @description 全屏标志
   */
  const isScreenFull = ref(false);
  const eRef = ref<HTMLElement | null>(null);
  const message = ref('');
  const toast = computed(() => {
    return useToast({
      message: message.value,
      duration: 2000,
      option,
    });
  });

  function isFullScreenSupported() {
    return (
      document.fullscreenEnabled ||
      // @ts-expect-error
      document.webkitFullscreenEnabled ||
      // @ts-expect-error
      document.mozFullScreenEnabled ||
      // @ts-expect-error
      document.msFullscreenEnabled
    );
  }

  const toggleScreenFull = () => {
    const element = <HTMLElement>eRef.value;
    try {
      if (isFullScreenSupported()) {
        if (!isScreenFull.value) {
          if (element.requestFullscreen) {
            element.requestFullscreen();
            // @ts-expect-error
          } else if (element.mozRequestFullScreen) {
            // Firefox
            // @ts-expect-error
            element.mozRequestFullScreen();
            // @ts-expect-error
          } else if (element.webkitRequestFullscreen) {
            // Chrome, Safari and Opera
            // @ts-expect-error
            element.webkitRequestFullscreen();
            // @ts-expect-error
          } else if (element.msRequestFullscreen) {
            // IE/Edge
            // @ts-expect-error
            element.msRequestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
            // @ts-expect-error
          } else if (document.webkitExitFullscreen) {
            /* Safari */
            // @ts-expect-error
            document.webkitExitFullscreen();
            // @ts-expect-error
          } else if (document.mozCancelFullScreen) {
            /* Firefox */
            // @ts-expect-error
            document.mozCancelFullScreen();
            // @ts-expect-error
          } else if (document.msExitFullscreen) {
            /* IE11 */
            // @ts-expect-error
            document.msExitFullscreen();
          }
        }
      } else {
        message.value = '当前浏览器不支持全屏！';
        toast.value.showToast();
      }
    } catch (err: any) {
      message.value = '进入全屏失败:' + err.message;
      toast.value.showToast();
    }
  };

  const changeScreenFull = () => {
    isScreenFull.value = !isScreenFull.value;
  };

  onMounted(() => {
    const element = <HTMLElement>elementRef.value;
    eRef.value = element;
    element.addEventListener('fullscreenchange', changeScreenFull);
  });

  onBeforeUnmount(() => {
    const element = <HTMLElement>eRef.value;
    element.removeEventListener('fullscreenchange', changeScreenFull);
  });

  return { isScreenFull, toggleScreenFull };
};
