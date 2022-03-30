<template></template>

<script setup lang="ts">
import { inject, nextTick, onMounted, onUpdated, ref, watch } from 'vue';
import EventBus from '../../events';
const ctx = inject('canvas-context');// as CanvasRenderingContext2D;

const internalImage = new Image();

const props = defineProps(['dataURL', 'canv', 'width', 'height']);
defineEmits(['resize-wrapper-request']);

let width = 0, height = 0;

const dataURL = ref(props.dataURL);
const offscreenCanvas = document.createElement('canvas');

window.onresize = function () {
    EventBus.emit('resize-canvas-request', width, height);
};

const draw = function () {
    window.requestAnimationFrame(() => {
        let imageData = offscreenCanvas.getContext('2d')?.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);
        // canv.value.getContext('2d').imageSmoothingEnabled = false;
        // ctx.drawImage(offscreenCanvas, 0, 0, offscreenCanvas.width, offscreenCanvas.height, 0, 0, canv.value.width, canv.value.height);
        ctx.value.drawImage(offscreenCanvas, 0, 0, offscreenCanvas.width, offscreenCanvas.height, 0, 0, props.width, props.height);
    });
};

const loadImage = function (): Promise<void> {
    console.log('loading');
    internalImage.src = props.dataURL;
    return internalImage.decode().then(() => {
        width = internalImage.naturalWidth;
        height = internalImage.naturalHeight;

        offscreenCanvas.width = width;
        offscreenCanvas.height = height;
        offscreenCanvas.getContext('2d')?.drawImage(internalImage, 0, 0);
        
        EventBus.emit('resize-canvas-request', width, height);
        // draw();
        // nextTick().then(() => draw());
    }).catch(err => {
        console.error(err);
        console.log(props.dataURL);
    });
};

watch(dataURL, (newURL, oldURL) => {
    if (newURL === oldURL) return;
    console.log('changed');
    loadImage();
    // draw();

});

onUpdated(() => {
    dataURL.value = props.dataURL;
    // nextTick().then(() => draw());
    draw();
});


onMounted(() => {
    dataURL.value = props.dataURL;
    loadImage();
});

</script>

<style scoped lang="scss">
</style>