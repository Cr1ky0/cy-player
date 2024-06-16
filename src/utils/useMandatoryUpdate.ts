import { ref } from 'vue';

export const useMandatoryUpdate = () => {
  const key = ref(0);
  const forceUpdate = () => {
    key.value += 1;
  };
  return {
    key,
    forceUpdate,
  };
};
