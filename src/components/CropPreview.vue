<script setup lang="ts">
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

const calculateSize = function () {
    let { px, py, qx, qy } = props.mousePositionData;

    px /= props.scaleFactor;
    py /= props.scaleFactor;
    qx /= props.scaleFactor;
    qy /= props.scaleFactor;

    let imageWidth, imageHeight, ratio = 1;
    let cropWidth = qx - px,
        cropHeight = qy - py;
    let canvasWidth = canv.value.width,
        canvasHeight = canv.value.height;
    let aspectRatio = cropWidth / cropHeight;
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
        sx: px,
        sy: py,
        sw: qx - px,
        sh: qy - py,
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
    // let sx = px,
    //     sy = py,
    //     sw = qx - px,
    //     sh = qy - py,
    //     dx = midX - imageMidX,
    //     dy = midY - imageMidY,
    //     dw = imageWidth,
    //     dh = imageHeight;
    let {sx,sy,sw,sh,dx,dy,dw,dh} = calculateSize();

    // console.dir({sx,sy,sw,sh,dx,dy,dw,dh});

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
}

const draw = function () {
    clear();
    drawBackground();
    drawImage();
};

watch(props.mousePositionData, () => {
    draw();
});

onUpdated(() => {
    draw();
});

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
    height: 200px;
    // border: solid 1px black;
}
</style>