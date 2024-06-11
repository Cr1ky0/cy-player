import {ref, VNodeRef, watch, watchEffect} from "vue";

/**
 *  @description 支持的HTTP传输对象类别(Content-Type)
 */
export const supportTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/m3u8']
export const useVideo = (videoSrc: string, vRef: VNodeRef) => {
    const videoRef = ref<VNodeRef | null>(null) // videoRef
    /**
     *  @description 视频Http加载状态
     */
    let httpState = ref<number>(404);
    /**
     *  @description 下载的视频源文件
     */
    let sourceFile = ref<string | null>('')
    /**
     *  @description 下载的源文件类型
     */
    let sourceFileType = ref<string | null>('')

    // download
    const downloadFile = async (url: string) => {
        try {
            const response = await fetch(url);
            httpState.value = response.status;
            if (!response.ok) {
                throw new Error("加载失败")
            }
            // content type
            const contentType = response.headers.get('content-type');
            // 类型检测
            if (contentType && supportTypes.includes(contentType)) {
                sourceFileType.value = contentType;
                // file source
                const blob = await response.blob();
                sourceFile.value = URL.createObjectURL(blob);
            } else
                throw new Error('类型不匹配')
        } catch (error) {
            sourceFile.value = null
            sourceFileType.value = null
        }

    };

    // videoSrc监听
    watchEffect(() => {
        downloadFile(videoSrc)
    })

    // vRef监听
    watchEffect(() => {
        videoRef.value = vRef
    })

    // sourceFile监听
    watch(sourceFile,() => {
        if (!sourceFile.value) {
            console.log(`加载出错！HTTP STATUS: ${httpState.value}`);
            // TODO: 源文件不存在弹出提示错误
        }
    })

    return {
        videoRef,
        sourceFile,
        sourceFileType
    }
}