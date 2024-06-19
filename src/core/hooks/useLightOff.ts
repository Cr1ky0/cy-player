import { onMounted, ref } from 'vue';

export const useLightOff = () => {
  const lightOn = ref(false);

  const handleLightOn = () => {
    const element = document.createElement('div');
    element.classList.add('cy-player-light-off-mask');
    element.style.position = 'fixed';
    element.style.top = '0';
    element.style.left = '0';
    element.style.width = '100vw';
    element.style.height = '100vh';
    element.style.zIndex = '1000';
    element.style.backgroundColor = 'rgba(0,0,0,.6)';
    if (!document.querySelector('.cy-player-light-off-mask')) {
      document.body.appendChild(element);
      lightOn.value = true;
    }
  };

  const handleLightOff = () => {
    const element = document.querySelector('.cy-player-light-off-mask');
    if (element) {
      document.body.removeChild(element);
      lightOn.value = false;
    }
  };
  const handleLightOffModel = () => {
    if (lightOn.value) {
      handleLightOff();
    } else {
      handleLightOn();
    }
    localStorage.setItem('lightOn', String(lightOn.value));
  };

  onMounted(() => {
    const localLightOn = localStorage.getItem('lightOn');
    lightOn.value = localLightOn ? Boolean(localLightOn) : false;
    if (lightOn.value) {
      handleLightOn();
    }
  });

  return { lightOn, handleLightOffModel };
};
