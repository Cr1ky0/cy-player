import { onBeforeUnmount, onMounted, Ref, ref } from 'vue';
import { useToast } from '@/core/hooks/useToast.ts';
import { PlayerOption } from 'types';

export const useScreenFull = (elementRef: Ref, option: PlayerOption) => {
  /**
   * @description 全屏标志
   */
  const isScreenFull = ref(false);
  const eRef = ref<HTMLElement | null>(null);
  const message = ref('');
  const { showToast } = useToast(option);

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

  const toggleScreenFull = async () => {
    const element = <HTMLElement>eRef.value;
    try {
      if (isFullScreenSupported()) {
        if (!isScreenFull.value) {
          if (element.requestFullscreen) {
            await element.requestFullscreen();
            // @ts-expect-error
          } else if (element.mozRequestFullScreen) {
            // Firefox
            // @ts-expect-error
            await element.mozRequestFullScreen();
            // @ts-expect-error
          } else if (element.webkitRequestFullscreen) {
            // Chrome, Safari and Opera
            // @ts-expect-error
            await element.webkitRequestFullscreen();
            // @ts-expect-error
          } else if (element.msRequestFullscreen) {
            // IE/Edge
            // @ts-expect-error
            await element.msRequestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            await document.exitFullscreen();
            // @ts-expect-error
          } else if (document.webkitExitFullscreen) {
            /* Safari */
            // @ts-expect-error
            await document.webkitExitFullscreen();
            // @ts-expect-error
          } else if (document.mozCancelFullScreen) {
            /* Firefox */
            // @ts-expect-error
            await document.mozCancelFullScreen();
            // @ts-expect-error
          } else if (document.msExitFullscreen) {
            /* IE11 */
            // @ts-expect-error
            await document.msExitFullscreen();
          }
        }
      } else {
        message.value = '当前浏览器不支持全屏！';
        showToast(message.value);
      }
    } catch (err: any) {
      message.value = '全屏操作失败:' + err.message;
      showToast(message.value);
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
