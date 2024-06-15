import { onBeforeUnmount, ref, Ref, watch } from 'vue';

export const useMouseHandler = (
  containerRef: Ref<HTMLDivElement | undefined>,
) => {
  const cRef = ref<HTMLDivElement | null>(null);
  /**
   * @description 鼠标在x轴的坐标
   */
  const mouseX = ref(0);
  /**
   * @description 鼠标在y轴的坐标
   */
  const mouseY = ref(0);
  /**
   * @description 鼠标x坐标占整体宽度的百分比(0-100)
   */
  const xProp = ref(0);
  /**
   * @description 鼠标y坐标占整体宽度的百分比(0-100)
   */
  const yProp = ref(0);

  const handleMouseMove = (e: MouseEvent) => {
    const rect = cRef.value!.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    x = x >= 0 ? x : 0;
    y = y >= 0 ? y : 0;
    mouseX.value = x;
    mouseY.value = y;
    xProp.value = (x / width) * 100;
    yProp.value = (y / height) * 100;
  };

  const addEvents = () => {
    if (cRef.value) {
      const dom = cRef.value;
      dom.addEventListener('mousemove', handleMouseMove);
    }
  };

  const removeEvents = () => {
    if (cRef.value) {
      const dom = cRef.value;
      dom.removeEventListener('mousemove', handleMouseMove);
    }
  };

  watch(containerRef, () => {
    if (containerRef.value) {
      cRef.value = containerRef.value;
      addEvents();
    }
  });

  onBeforeUnmount(() => {
    removeEvents();
  });

  return {
    mouseX,
    mouseY,
    xProp,
    yProp,
  };
};
