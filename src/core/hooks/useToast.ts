import { App, createApp, ref } from 'vue';
import Toast from '@/components/toast/Toast.vue';
import { PlayerOption} from 'types';

export interface ToastOption {
  option: PlayerOption;
  message: string;
  duration?: number;
}

export const useToast = (toastOption: ToastOption) => {
  const toastRef = ref<App | null>(null);
  const timer = ref<NodeJS.Timeout | null>(null);
  /**
   * @description 创建toast APP对象
   */
  const createToast = () => {
    toastRef.value = createApp(Toast, {
      option: toastOption.option,
      message: toastOption.message,
      position: toastOption.option.toastPlacement,
    });
  };

  const showToast = () => {
    if (toastOption.option.showToast) {
      if (!document.getElementById('toast-container')) {
        // 先前有Toast则先清除
        if (timer.value) {
          clearTimeout(timer.value);
          closeToast();
        }
        const container = <HTMLDivElement>(
          document.getElementById('cy-player-container')
        );
        // 挂载会清除所有该挂载对象下的dom，这里建一个container
        const toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        container.appendChild(toastContainer);
        createToast(); // 创建新的组件，因为一个toast只能mount一次
        toastRef.value!.mount(toastContainer); // 加载组件
        // 挂载后一段时间卸载
        timer.value = setTimeout(() => {
          closeToast();
        }, toastOption.duration || 2000);
      }
    }
  };

  const closeToast = () => {
    if (toastRef.value) {
      toastRef.value.unmount();
    } // 卸载组件
    const toastContainer = document.getElementById('toast-container');
    const container = document.getElementById('cy-player-container');
    if (toastContainer && container) {
      container.removeChild(toastContainer);
    }
  };

  return {
    showToast,
    closeToast,
  };
};
