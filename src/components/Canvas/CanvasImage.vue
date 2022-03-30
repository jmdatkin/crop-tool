<template></template>

<script setup lang="ts">
import { inject, nextTick, onMounted, onUpdated, ref, watch } from 'vue';
import EventBus from '../../events';
const ctx = inject('canvas-context');// as CanvasRenderingContext2D;

const internalImage = new Image();

const props = defineProps<{
    dataURL: string,
    canv: HTMLElement,
    width: number,
    height: number,
    image: HTMLElement
}>();
// defineEmits(['resize-wrapper-request']);

// let width = 0, height = 0;

const dataURL = ref(props.dataURL);
const offscreenCanvas = document.createElement('canvas');

// window.onresize = function () {
//     EventBus.emit('resize-canvas-request', width, height);
// };

const draw = function () {
    window.requestAnimationFrame(() => {
        ctx.value.drawImage(offscreenCanvas, 0, 0, offscreenCanvas.width, offscreenCanvas.height, 0, 0, props.width, props.height);
    });
};

/*const loadImage = function () {
    internalImage.src = props.dataURL;
    internalImage.decode().then(() => {
        // width = internalImage.naturalWidth;
        // height = internalImage.naturalHeight;
        offscreenCanvas.width = internalImage.naturalWidth;
        offscreenCanvas.height = internalImage.naturalHeight;
        offscreenCanvas.getContext('2d')?.drawImage(internalImage, 0, 0);

        // draw();
        // EventBus.emit('resize-canvas-request', width, height);
        // draw();
        // nextTick().then(() => draw());
    }).catch(err => {
        console.error(err);
        console.log(props.dataURL);
    });
};*/

const loadImage = function() {
    let im = props.image;
    offscreenCanvas.width = im.naturalWidth;
    offscreenCanvas.height = im.naturalHeight;
    offscreenCanvas.getContext('2d')?.drawImage(im,0,0);
};

watch(dataURL, (newURL, oldURL) => {
    // if (newURL === oldURL) return;
    // console.log('changed');
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