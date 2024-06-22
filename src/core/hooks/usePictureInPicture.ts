import { computed, onBeforeUnmount, onMounted, Ref, ref } from 'vue';
import { PlayerOption } from '@/types';
import { useToast } from '@/core/hooks/useToast.ts';

export const usePictureInPicture = (elementRef: Ref, option: PlayerOption) => {
  const eRef = ref<HTMLVideoElement | null>(null);
  const isPictureInPicture = ref(false);
  const message = ref('');
  const toast = computed(() => {
    return useToast({
      message: message.value,
      duration: 2000,
      option,
    });
  });

  const togglePictureInPicture = () => {
    const element = <HTMLVideoElement>eRef.value;
    try {
      if (document.pictureInPictureEnabled) {
        if (!isPictureInPicture.value) element.requestPictureInPicture();
        else document.exitPictureInPicture();
      } else {
        message.value = '当前浏览器不支持画中画模式！';
        toast.value.showToast();
      }
    } catch (err: any) {
      message.value = '进入画中画失败:' + err.message;
      toast.value.showToast();
    }
  };

  const changeIsPictureInPicture = () => {
    isPictureInPicture.value = !isPictureInPicture.value;
  };

  onMounted(() => {
    const element = <HTMLVideoElement>elementRef.value!;
    eRef.value = element;
    element.addEventListener('enterpictureinpicture', changeIsPictureInPicture);
    element.addEventListener('leavepictureinpicture', changeIsPictureInPicture);
  });

  onBeforeUnmount(() => {
    const element = <HTMLVideoElement>eRef.value!;
    element.removeEventListener(
      'enterpictureinpicture',
      changeIsPictureInPicture,
    );
    element.removeEventListener(
      'leavepictureinpicture',
      changeIsPictureInPicture,
    );
  });

  return { isPictureInPicture, togglePictureInPicture };
};
