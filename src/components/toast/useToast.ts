import { createApp } from 'vue';
import Toast, { ToastPosition } from '@/components/toast/Toast.vue';
import { PlayerOption } from '@/types';

export const useToast = (option: PlayerOption) => {
  const showToast = (
    message: string,
    position?: ToastPosition,
    duration?: number,
  ) => {
    if (option.showToast) {
      if (!document.getElementById('toast-container')) {
        const container = <HTMLDivElement>(
          document.getElementById('cy-player-container')
        );
        // 挂载会清除所有该挂载对象下的dom，这里建一个container
        const toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        container.appendChild(toastContainer);
        const toast = createApp(Toast, {
          option,
          message,
          position,
          duration,
        });
        toast.mount(toastContainer);
      }
    }
  };

  const closeToast = () => {
    const toast = document.getElementById('toast-container');
    const container = document.getElementById('cy-player-container');
    if (toast && container) {
      container.removeChild(toast);
    }
  };

  return {
    showToast,
    closeToast,
  };
};
