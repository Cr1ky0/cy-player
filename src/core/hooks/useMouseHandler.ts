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
  const isMobile = ref(false);
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
   * @description 鼠标y坐标占整体高度的百分比(0-100)
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

  const handleMouseDown = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    isDrag.value = true;
    if (mouseEventCallbacks && mouseEventCallbacks.onMouseDown)
      mouseEventCallbacks.onMouseDown();
  };

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    // 元素处于内部或者拖拽时进行计算，节省资源
    if (mouseEnter.value || isDrag.value) {
      const rect = cRef.value!.getBoundingClientRect();
      width.value = rect.width;
      height.value = rect.height;

      // 判断事件类型并提取坐标
      let clientX, clientY;
      if (e instanceof MouseEvent) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else if (e instanceof TouchEvent && e.touches[0]) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        return; // 如果事件不是MouseEvent或TouchEvent中的一个，直接返回
      }

      let x = clientX - rect.left;
      let y = clientY - rect.top;

      // 确保x, y坐标不超出元素的边界
      x = x <= 0 ? 0 : x >= width.value ? width.value : x;
      y = y <= 0 ? 0 : y >= height.value ? height.value : y;

      mouseX.value = x;
      mouseY.value = y;
      xProp.value = (x / width.value) * 100;
      yProp.value = (y / height.value) * 100;

      // 如果存在鼠标事件回调，则调用onMouseMove
      if (mouseEventCallbacks && mouseEventCallbacks.onMouseMove) {
        mouseEventCallbacks.onMouseMove();
      }
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
    const userAgent = navigator.userAgent;
    isMobile.value =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent,
      );
    if (containerRef.value) {
      cRef.value = containerRef.value;
      const dom = cRef.value!;
      if (isMobile.value) {
        // touch事件里的touchend可以同时表示mousedown和mouseleave
        dom.addEventListener('touchstart', handleMouseDown);
        window.addEventListener('touchmove', handleMouseMove);
        window.addEventListener('touchend', handleMouseUp);
      } else {
        dom.addEventListener('mouseenter', handleMouseEnter);
        dom.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('mouseup', handleMouseUp);
        dom.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
      }
    }
  });

  onBeforeUnmount(() => {
    const dom = cRef.value!;
    if (isMobile.value) {
      dom.removeEventListener('touchstart', handleMouseDown);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    } else {
      dom.removeEventListener('mouseenter', handleMouseEnter);
      dom.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseup', handleMouseUp);
      dom.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
    }
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
