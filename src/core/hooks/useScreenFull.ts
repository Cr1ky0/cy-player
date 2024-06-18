import { onMounted, Ref, ref } from 'vue';

export const useScreenFull = (elementRef: Ref) => {
  /**
   * @description 全屏标志
   */
  const isScreenFull = ref(false);

  const toggleScreenFull = () => {
    const element = elementRef.value!;
    // TODO:F11
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
  };

  onMounted(() => {
    const element = elementRef.value!;
    element.addEventListener('fullscreenchange', () => {
      isScreenFull.value = !isScreenFull.value;
    });
  });

  return { isScreenFull, toggleScreenFull };
};
