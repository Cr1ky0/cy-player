import { ref, Ref } from 'vue';

export const useWebScreenFull = (elementRef: Ref) => {
  const isWebScreenFull = ref(false);

  const toggleWebScreenFull = () => {
    const element = <HTMLElement>elementRef.value!;
    if (!isWebScreenFull.value)
      element.classList.add('cy-player-container-web-fullscreen-active');
    else element.classList.remove('cy-player-container-web-fullscreen-active');
    isWebScreenFull.value = !isWebScreenFull.value;
  };

  return { isWebScreenFull, toggleWebScreenFull };
};
