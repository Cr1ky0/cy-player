import { computed, onBeforeUnmount, onMounted, Ref, ref } from 'vue';
import { useToast } from '@/core/hooks/useToast.ts';
import { PlayerOption } from '@/types';

export const useScreenFull = (elementRef: Ref, option: PlayerOption) => {
  /**
   * @description 全屏标志
   */
  const isScreenFull = ref(false);
  const eRef = ref<HTMLVideoElement | null>(null);
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
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled
    );
  }

  const toggleScreenFull = () => {
    const element = <HTMLVideoElement>eRef.value;
    try {
      if (isFullScreenSupported()) {
        if (!isScreenFull.value) {
          if (element.requestFullscreen) {
            element.requestFullscreen();
          } else if (element.mozRequestFullScreen) {
            // Firefox
            element.mozRequestFullScreen();
          } else if (element.webkitRequestFullscreen) {
            // Chrome, Safari and Opera
            element.webkitRequestFullscreen();
          } else if (element.msRequestFullscreen) {
            // IE/Edge
            element.msRequestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitExitFullscreen) {
            /* Safari */
            document.webkitExitFullscreen();
          } else if (document.mozCancelFullScreen) {
            /* Firefox */
            document.mozCancelFullScreen();
          } else if (document.msExitFullscreen) {
            /* IE11 */
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
    const element = <HTMLVideoElement>elementRef.value;
    eRef.value = element;
    element.addEventListener('fullscreenchange', changeScreenFull);
  });

  onBeforeUnmount(() => {
    const element = <HTMLVideoElement>eRef.value;
    element.removeEventListener('fullscreenchange', changeScreenFull);
  });

  return { isScreenFull, toggleScreenFull };
};
