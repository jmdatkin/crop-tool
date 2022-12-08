<script setup lang="ts">
import { useSelectionStore } from '@/stores/selection';
import { onMounted, onUpdated, ref, watch } from 'vue';
import type MousePositionData from '../types/MousePositionData';

const props = defineProps<{
    sourceImage: HTMLImageElement | null,
    sourceImageWidth: Number,
    sourceImageHeight: Number,
    mousePositionData: MousePositionData,
    scaleFactor: number
}>();

const canv = ref(null);
const ctx = ref(null);
const wrapper = ref(null);

const selectionStore = useSelectionStore();

const calculateSize = function () {
    // let { px, py, qx, qy } = props.mousePositionData;
    // let {x, y, w, h} = selectionStore;
    let x = selectionStore.x;
    let y = selectionStore.y;
    let w = selectionStore.w;
    let h = selectionStore.h;

    x /= props.scaleFactor;
    y /= props.scaleFactor;
    w /= props.scaleFactor;
    h /= props.scaleFactor;

    let imageWidth, imageHeight, ratio = 1;
    let canvasWidth = canv.value.width,
        canvasHeight = canv.value.height;
    let aspectRatio = w / h;
    let canvasRatio = canvasWidth / canvasHeight;
    let midX = canv.value.width / 2,
        midY = canv.value.height / 2;
    // if (aspectRatio > 1)
    //     ratio = cropWidth / canvasWidth;
    // else
    //     ratio = cropHeight / canvasHeight;
    if (aspectRatio > canvasRatio) {
        imageWidth = canvasWidth;
        imageHeight = canvasWidth/aspectRatio;
    } else {
        imageHeight = canvasHeight;
        imageWidth = canvasHeight*aspectRatio;
    }
    // imageWidth = width / ratio;
    // imageHeight = height / ratio;
    // imageWidth = ratio / cropWidth;
    // imageHeight = ratio / cropHeight;

    let imageMidX = imageWidth / 2,
        imageMidY = imageHeight / 2;

    return { 
        sx: x,
        sy: y,
        sw: w,
        sh: h,
        dx: aspectRatio > canvasRatio ? 0 : midX - imageMidX,
        dy: aspectRatio <= canvasRatio ? 0 : midY - imageMidY,
        dw: imageWidth,
        dh: imageHeight
    };
};

const clear = function () {
    ctx.value.fillStyle = 'white';
    ctx.value.fillRect(0, 0, canv.value.width, canv.value.height);
};

const drawImage = function () {

    let {sx,sy,sw,sh,dx,dy,dw,dh} = calculateSize();

    ctx.value.drawImage(props.sourceImage,
        sx,sy,sw,sh,dx,dy,dw,dh);
}

const drawBackground = function() {
    let color1 = '#F8FAFC';
    let color2 = '#E4E4E7';
    let size = 7;

    for (let i=0; i<=canv.value.width; i += size) {
        for (let j=0; j<=canv.value.height; j += size) {
            let color = (i*size + j)%2 ? color1 : color2;
            ctx.value.fillStyle = color;
            ctx.value.fillRect(i,j,size,size);
        }
    }

    ctx.value.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.value.fillRect(0,0,canv.value.width,canv.value.height);
}

const iid = ref(null);
const start = function () {
    iid.value = window.requestAnimationFrame(loop);
};

let lastTime = Date.now();
let fps = 1 / 60;
const loop = function () {
    let thisTime = Date.now();
    if (thisTime - lastTime < fps) return;

    draw();

    window.requestAnimationFrame(loop);
};

const stop = function() {
    if (iid.value)
        window.cancelAnimationFrame(iid);
};


const draw = function () {
    clear();
    drawBackground();

    if (props.sourceImage)
        drawImage();
};

onMounted(() => {
    ctx.value = canv.value.getContext('2d');
    let style = getComputedStyle(wrapper.value);
    let width = parseInt(style.width, 10);
    let height = parseInt(style.height, 10);
    canv.value.width = width;
    canv.value.height = height;
    wrapper.value.style.width = `${width + 2}px`;
    wrapper.value.style.height = `${height + 2}px`;
    // draw();
    clear();
    drawBackground();
    start();
});

</script>

<template>
    <div class="crop-preview-wrapper border border-slate-600" ref="wrapper">
        <canvas id="crop-preview-canvas" ref="canv"></canvas>
    </div>
</template>

<style lang="scss">
div.crop-preview-wrapper {
    width: 300px;
    height: 300px;
    // border: solid 1px black;
}
</style>