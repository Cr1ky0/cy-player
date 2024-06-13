import { ref } from 'vue';

/**
 * @description 强制刷新使用key的某个组件
 */
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