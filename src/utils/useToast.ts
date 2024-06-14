import { createApp } from 'vue';
import Toast, { ToastProps } from '@/components/Toast.vue';

export const useToast = (toastOption: ToastProps) => {
  const showToast = () => {
    if (toastOption.option.showToast) {
      const container = <HTMLDivElement>(
        document.getElementById('cy-player-container')
      );
      if (!document.getElementById('toast-container')) {
        // 挂载会清除所有该挂载对象下的dom，这里建一个container
        const toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        container.appendChild(toastContainer);
        const toast = createApp(Toast, {
          message: toastOption.message,
          duration: toastOption.duration,
          position: toastOption.position,
          option:toastOption.option
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
