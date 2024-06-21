import { onBeforeUnmount, onMounted, ref, Ref } from 'vue';

export interface MouseEventCallback {
  onMouseDown?: () => void;
  onMouseUp?: () => void;
  onMouseMove?: () => void;
}

/**
 * 元素内部鼠标定位
 * @param containerRef 需要定位鼠标坐标的元素
 * @param mouseEventCallbacks 相应event的回调
 */
export const useMouseHandler = (
  containerRef: Ref<HTMLDivElement | undefined>,
  mouseEventCallbacks?: MouseEventCallback,
) => {
  const cRef = ref<HTMLDivElement | null>(null);
  const isDrag = ref<boolean>(false);
  const mouseEnter = ref<boolean>(false);
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
  /**
   * @description 元素宽度
   */
  const width = ref(0);
  /**
   * @description 元素高度
   */
  const height = ref(0);

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    isDrag.value = true;
    if (mouseEventCallbacks && mouseEventCallbacks.onMouseDown)
      mouseEventCallbacks.onMouseDown();
  };

  const handleMouseMove = (e: MouseEvent) => {
    // 元素处于内部或者拖拽时进行计算，节省资源
    if (mouseEnter.value || isDrag.value) {
      const rect = cRef.value!.getBoundingClientRect();
      width.value = rect.width;
      height.value = rect.height;
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;
      x = x <= 0 ? 0 : x >= width.value ? width.value : x; // 超出左边界和右边界
      y = y <= 0 ? 0 : y >= height.value ? height.value : y; // 超出上边界和下边界
      mouseX.value = x;
      mouseY.value = y;
      xProp.value = (x / width.value) * 100;
      yProp.value = (y / height.value) * 100;
      if (mouseEventCallbacks && mouseEventCallbacks.onMouseMove)
        mouseEventCallbacks.onMouseMove();
    }
  };

  const handleMouseUp = () => {
    if (mouseEventCallbacks && mouseEventCallbacks.onMouseUp)
      mouseEventCallbacks.onMouseUp();
    isDrag.value = false;
  };

  const handleMouseEnter = () => {
    mouseEnter.value = true;
  };

  const handleMouseLeave = () => {
    mouseEnter.value = false;
  };

  onMounted(() => {
    if (containerRef.value) {
      cRef.value = containerRef.value;
      const dom = cRef.value!;
      dom.addEventListener('mouseenter', handleMouseEnter);
      dom.addEventListener('mouseleave', handleMouseLeave);
      dom.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
  });

  onBeforeUnmount(() => {
    const dom = cRef.value!;
    dom.removeEventListener('mouseenter', handleMouseEnter);
    dom.removeEventListener('mouseleave', handleMouseLeave);
    dom.removeEventListener('mousedown', handleMouseDown);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  });

  return {
    isDrag,
    mouseEnter,
    mouseX,
    mouseY,
    xProp,
    yProp,
    width,
    height,
  };
};
