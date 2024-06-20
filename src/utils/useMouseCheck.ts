import { ref } from 'vue';

export const useMouseCheck = () => {
  const mouseEnter = ref(false);

  const handleMouseEnter = () => {
    mouseEnter.value = true;
  };

  const handleMouseLeave = () => {
    mouseEnter.value = false;
  };

  return { mouseEnter, handleMouseEnter, handleMouseLeave };
};
