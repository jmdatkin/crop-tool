<template>
    <div ref="wrapper" class="canvas-wrapper">
        <canvas id="main-canv" ref="canv"></canvas>
    </div>
</template>

<script setup lang="ts">import EventBus from '@/events';
import { nextTick, onMounted, onUpdated, reactive, ref, watch } from 'vue';


const props = defineProps<{
    width: number,
    height: number,
    draw: Function
}>();

const dragging = ref(false);

const dataLoaded = ref(false);
// const dataURL = ref(props.dataURL);
// const loadedImageData = reactive({
//     dataURL,
//     width: 0,
//     height: 0
// });

const canv = ref(null);
const wrapper = ref(null);


const drawOnscreen = function () {
    window.requestAnimationFrame(() => {
        props.draw(canv.value);
        // canv.value.getContext('2d').drawImage(offscreenCanvas, 0, 0, offscreenCanvas.width, offscreenCanvas.height, 0, 0, canv.value.width, canv.value.height);
    });
};

const resize = function (): void {
    let newWidth = Math.floor(props.width);
    let newHeight = Math.floor(props.height);
    wrapper.value.style.width = `${newWidth + 2}px`;     //Add 2 to account for border width
    wrapper.value.style.height = `${newHeight + 2}px`;
    canv.value.width = newWidth;
    canv.value.height = newHeight;
};

/*watch(dataURL, (newURL, oldURL) => {
    if (newURL === oldURL) return;  //Image hasn't changed
    let im = new Image();
    im.src = newURL;
    im.decode().then(() => {
        let c_w = im.naturalWidth;
        let c_h = im.naturalHeight;

        loadedImageData.width = c_w;
        loadedImageData.height = c_h;

        offscreenCanvas.width = c_w;
        offscreenCanvas.height = c_h;

        offscreenCanvas.getContext('2d')?.drawImage(im, 0, 0);

        // resize(c_w, c_h);
        nextTick(() => {
            calculateDims(c_w, c_h);
            drawOnscreen();

        });
        // wrapper.value.style.width = `${c_w}px`;
        // wrapper.value.style.height = `${c_h}px`;
        // canv.value.width = c_w;
        // canv.value.height = c_h;

        // canv.value.getContext('2d').drawImage(im, 0, 0);
    });
});*/

onUpdated(() => {
    resize();
    drawOnscreen();
    // dataURL.value = props.dataURL;
});

onMounted(() => {
    resize()
    drawOnscreen();
    /*
    let im = new Image();
    im.src = dataURL.value;
    im.decode().then(() => {
        let c_w = im.naturalWidth;
        let c_h = im.naturalHeight;

        loadedImageData.width = c_w;
        loadedImageData.height = c_h;

        offscreenCanvas.width = c_w;
        offscreenCanvas.height = c_h;

        offscreenCanvas.getContext('2d')?.drawImage(im, 0, 0);

        // resize(c_w, c_h);
        nextTick(() => {
            calculateDims(c_w, c_h);
            drawOnscreen();
        });
        // wrapper.value.style.width = `${c_w}px`;
        // wrapper.value.style.height = `${c_h}px`;
        // canv.value.width = c_w;
        // canv.value.height = c_h;

        // canv.value.getContext('2d').drawImage(im, 0, 0);
    });
    // console.log(canv.value);
    // wrapper.value.style.width = `${props.width}px`;
    // wrapper.value.style.height = `${props.height}px`;


    // canv.value.width = props.width;
    // canv.value.height = props.height;*/
});
</script>

<style lang="scss" scoped>
.canvas-wrapper {
    margin: 0 auto;
    border: solid 1px black;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}
</style>