<template>
    <div class="crop-preview-container" ref="cropPreviewContainer">
        <canvas id="crop-preview" ref="cropPreview"></canvas>
    </div>
</template>

<script setup lang="ts">import { inject, onMounted, ref } from 'vue';

const cropPreview = ref(null);
const cropPreviewContainer = ref(null);

const offscreenCanvas: HTMLCanvasElement = inject('offscreen-canvas');

const props = defineProps<{
    draw: Function,

    marquee: object
}>();

// const draw = function() {
//     // let m_w = props.marquee.width;
//     // let m_h = props.marquee.height;
//     let [newWidth, newHeight] = calculatePreviewDims();
//     cropPreview.value.getContext('2d').drawImage(offscreenCanvas, )
// };

const calculatePreviewDims = function () {
    let previewBb: DOMRect = cropPreviewContainer.value.getBoundingClientRect();
    let previewWidth = previewBb.width;
    let previewHeight = previewBb.height;

    let previewRatio = previewWidth / previewHeight;
    let marqueeRatio = props.marquee.width / props.marquee.height;

    // console.log(imageRatio);

    let ratioDifference = marqueeRatio - previewRatio;

    let newWidth, newHeight;

    //Landscape orientation
    if (ratioDifference > 0) {
        newWidth = previewWidth;
        newHeight = newWidth / marqueeRatio;
    }
    //Portrait orientation
    else {
        newHeight = previewHeight;
        newWidth = newHeight * marqueeRatio;
    }

    return [newWidth, newHeight, previewBb.left, previewBb.top];
}
onMounted(() => {
    requestAnimationFrame(() => {
        props.draw(cropPreview.value);
    });
});

onMounted(() => {
    let style = getComputedStyle(cropPreviewContainer.value);
    cropPreview.value.width = parseInt(style.width, 10);
    cropPreview.value.height = parseInt(style.height, 10);
    requestAnimationFrame(() => {
        props.draw(cropPreview.value);
    });
});
</script>

<style scoped lang="scss">
.crop-preview-container {
    // width: 100%;
    width: 360px;
    height: 192px;
    // height: (9/16);
    background-color: #fff;
    border: solid 1px black;
    margin: 10px auto;
}
</style>