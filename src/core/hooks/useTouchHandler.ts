import { onBeforeUnmount, onMounted, Ref, ref } from 'vue';

export type Operator = 'Volume' | 'Progress' | null;

export interface TouchHandlerCallback {
  touchStartEffect?: (operator: Operator) => void;
  touchEndEffect?: (operator: Operator) => void;
  handleChangeVolume: (yChangeProp: number) => void;
  handleChangeProgress: (xChangeProp: number) => void;
}

/**
 * @description 用于处理移动端touch时操作音量和进度
 */
export const useTouchHandler = (
  elemRef: Ref<HTMLElement | undefined>,
  callback: TouchHandlerCallback,
) => {
  const innerRef = ref<HTMLElement>();
  let operator: Operator = null;
  let lastX = 0;
  let lastY = 0;

  const getTouchPosition = (e: TouchEvent) => {
    const rect = innerRef.value!.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // 判断事件类型并提取坐标
    const clientX = e.touches[0].clientX;
    const clientY = e.touches[0].clientY;

    let x = clientX - rect.left;
    let y = clientY - rect.top;

    // 确保x, y坐标不超出元素的边界
    x = x <= 0 ? 0 : x >= width ? width : x;
    y = y <= 0 ? 0 : y >= height ? height : y;

    // x,y和上次移动的差距百分比
    const xChangeProp = ((x - lastX) / width) * 100;
    const yChangeProp = ((y - lastY) / height) * 100;
    return [x, y, xChangeProp, yChangeProp];
  };

  const handleTouchStart = (e: TouchEvent) => {
    // 按下时接收一下初始touch位置
    const [x, y] = getTouchPosition(e);
    lastX = x;
    lastY = y;
  };

  const handleTouchMove = (e: TouchEvent) => {
    const [x, y, xChangeProp, yChangeProp] = getTouchPosition(e);
    // 判断操作类型
    if (!operator) {
      operator =
        Math.abs(x - lastX) > Math.abs(y - lastY) ? 'Progress' : 'Volume';
      // touch start回调放到这执行，因为operator在这才能获取
      callback.touchStartEffect && callback.touchStartEffect(operator);
    }

    // 根据操作类型操作
    if (operator === 'Progress') {
      callback.handleChangeProgress(xChangeProp);
    } else {
      callback.handleChangeVolume(yChangeProp);
    }

    // 重置last
    lastX = x;
    lastY = y;
  };

  // touch结束重置
  const handleTouchEnd = () => {
    // touch end 回调
    callback.touchEndEffect && callback.touchEndEffect(operator);
    lastX = 0;
    lastY = 0;
    operator = null;
  };

  onMounted(() => {
    if (elemRef.value) {
      innerRef.value = elemRef.value;
      const elem = elemRef.value;
      const userAgent = navigator.userAgent;
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          userAgent,
        );
      if (isMobile) {
        elem.addEventListener('touchstart', handleTouchStart);
        elem.addEventListener('touchmove', handleTouchMove);
        elem.addEventListener('touchend', handleTouchEnd);
      }
    }
  });

  onBeforeUnmount(() => {
    if (elemRef.value) {
      const elem = elemRef.value;
      elem.removeEventListener('touchstart', handleTouchStart);
      elem.removeEventListener('touchmove', handleTouchMove);
      elem.removeEventListener('touchend', handleTouchEnd);
    }
  });
};
