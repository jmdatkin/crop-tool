<template>
    <div class="crop-preview-container" ref="cropPreviewContainer">
        <canvas id="crop-preview" ref="cropPreview"></canvas>
    </div>
</template>

<script setup lang="ts">
import { inject, onMounted, onUpdated, ref } from 'vue';
import type BoundingBox from '../../types/bounding-box';

const cropPreview = ref(null);
const ctx = ref(null);
const cropPreviewContainer = ref(null);
let previewBb: DOMRect;

const offscreenCanvas: HTMLCanvasElement = inject('offscreen-canvas');

const props = defineProps<{
    draw: Function,

    marquee: BoundingBox
}>();

// const draw = function() {
//     // let m_w = props.marquee.width;
//     // let m_h = props.marquee.height;
//     let [newWidth, newHeight] = calculatePreviewDims();
//     cropPreview.value.getContext('2d').drawImage(offscreenCanvas, )
// };

const checkers = function () {
    let size = 10;
    ctx.value.fillStyle = "white";

    let { width, height } = cropPreview.value;

    ctx.value.fillRect(0, 0, width, height);

    ctx.value.fillStyle = "lightgrey";

    // let i = 0, j = 0;

    for (let j = 0; j * size < width; j++) {
        for (let i = 0; i * size < height; i++) {
            ctx.value.fillStyle = (i+j)%2==0 ? 'lightgray' : 'white';
            ctx.value.fillRect(j * size, i * size, size, size);
        }

    }
}


const draw = function () {
    checkers();
    let dims = calculatePreviewDims() as BoundingBox;
    props.draw(cropPreview.value, dims);//newWidth, newHeight);
    // cropPreview.value.getContext('2d').drawImage(offscreenCanvas, 0, 0, newWidth, newHeight, offscreenCanvas, props.marquee.left, props.marquee.top, props.marquee.width, props.marquee.height );
};

const calculatePreviewDims = function () {
    let previewWidth = cropPreview.value.width;//previewBb.width;
    let previewHeight = cropPreview.value.height;//previewBb.height;

    let previewRatio = previewWidth / previewHeight;
    let marqueeRatio = props.marquee.width / props.marquee.height;

    // console.log(imageRatio);

    let ratioDifference = marqueeRatio - previewRatio;

    let newLeft, newTop, newWidth, newHeight;

    //Landscape orientation
    if (ratioDifference > 0) {
        newWidth = previewWidth;
        newHeight = newWidth / marqueeRatio;
        newLeft = 0;
        newTop = 0.5 * (previewHeight - newHeight);
    }
    //Portrait orientation
    else {
        newHeight = previewHeight;
        newWidth = newHeight * marqueeRatio;
        newTop = 0;
        newLeft = 0.5 * (previewWidth - newWidth);
    }

    return { left: newLeft, top: newTop, width: newWidth, height: newHeight };
}
onUpdated(() => {
    requestAnimationFrame(() => {
        draw();
        // props.draw(cropPreview.value);
    });
});

onMounted(() => {
    previewBb = cropPreview.value.getBoundingClientRect();
    ctx.value = cropPreview.value.getContext('2d');
    let style = getComputedStyle(cropPreviewContainer.value);
    cropPreview.value.width = parseInt(style.width, 10) - 1;
    cropPreview.value.height = parseInt(style.height, 10) - 1;
    requestAnimationFrame(() => {
        draw();
        // props.draw(cropPreview.value);
    });
});
</script>

<style scoped lang="scss">
.crop-preview-container {
    // width: 100%;
    // width: 241px;
    // width: 100%;
    // height: auto;
    width: 241px;
    height: 241px;
    // height: (9/16);
    background-color: #fff;
    border: solid 1px black;
    margin: 0 auto;
}
</style>