<template>
    <div class="workspace" ref="workspace">
        <div ref="wrapper" class="canvas-wrapper">
            <ImageCanvas
                :width="canvasDims.width"
                :height="canvasDims.height"
                :sourceImage="props.sourceImage"
                :sourceImageWidth="props.sourceImageWidth"
                :sourceImageHeight="props.sourceImageHeight"
            ></ImageCanvas>
            <OverlayCanvas
                :width="canvasDims.width"
                :height="canvasDims.height"
            ></OverlayCanvas>
        </div>
    </div>
</template>

<script setup lang="ts">

import { onMounted, onUpdated, reactive, ref } from 'vue';
import ImageCanvas from './ImageCanvas.vue';
import OverlayCanvas from './OverlayCanvas.vue';

const props = defineProps<{
    sourceImage: HTMLImageElement | null,
    sourceImageWidth: Number,
    sourceImageHeight: Number
}>();

const canv = ref(null);
const wrapper = ref(null);
const workspace = ref(null);

const canvasDims = reactive({
    width: 0,
    height: 0
});

const calculateDims = function (width, height) {
    let workspaceBb: DOMRect = workspace.value.getBoundingClientRect();
    let workspaceWidth = workspaceBb.width;
    let workspaceHeight = workspaceBb.height;

    let workspaceRatio = workspaceWidth / workspaceHeight;
    let imageRatio = width / height;

    let ratioDifference = imageRatio - workspaceRatio;

    let newWidth, newHeight;
    //Landscape
    if (ratioDifference > 0) {
        newWidth = workspaceWidth;
        newHeight = newWidth / imageRatio;
    }
    //Portrait
    else {
        newHeight = workspaceHeight;
        newWidth = newHeight * imageRatio;
    }

    canvasDims.width = newWidth;
    canvasDims.height = newHeight;
    resize(newWidth, newHeight);
};

const drawOnscreen = function () {
    window.requestAnimationFrame(() => {
        canv.value.getContext('2d').drawImage(
            props.sourceImage,
            0, 0,
            props.sourceImageWidth, props.sourceImageHeight,
            0, 0,
            canv.value.width, canv.value.height
        );
        
    });
}

window.onresize = function () {
    calculateDims(props.sourceImageWidth, props.sourceImageHeight)
    drawOnscreen();
};

const resize = function (width: number, height: number): void {
    width = Math.floor(width);
    height = Math.floor(height);
    wrapper.value.style.width = `${width+2}px`;     //Add 2 to account for border width
    wrapper.value.style.height = `${height+2}px`;
    // canv.value.width = width;
    // canv.value.height = height;
}

onUpdated(() => {
    calculateDims(props.sourceImageWidth, props.sourceImageHeight);
    drawOnscreen();
});

onMounted(() => {
    calculateDims(props.sourceImageWidth, props.sourceImageHeight);
    drawOnscreen();
});
</script>

<style lang="scss" scoped>
.canvas-wrapper {
    margin: 0 auto;
    border: solid 1px black;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    position: relative;
}

.workspace {
    max-width: 1600px;
    width: 100%;
    height: 100%;
    margin: 0 auto;
}


</style>