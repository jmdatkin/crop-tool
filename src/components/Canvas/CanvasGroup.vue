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
                :mousePositionData="offsetMousePosition"
                :dragging="props.dragging"
            ></OverlayCanvas>
        </div>
    </div>
</template>

<script setup lang="ts">

import { computed } from '@vue/reactivity';
import { onMounted, onUpdated, reactive, ref } from 'vue';
import ImageCanvas from './ImageCanvas.vue';
import OverlayCanvas from './OverlayCanvas.vue';

const props = defineProps<{
    sourceImage: HTMLImageElement | null,
    sourceImageWidth: Number,
    sourceImageHeight: Number,
    mousePositionData: object,
    dragging: boolean
}>();

const wrapper = ref(null);
const workspace = ref(null);

defineExpose({
    wrapper
});

const canvasDims = reactive({
    width: 0,
    height: 0
});

const offsetMousePosition = computed(() => {
    let {px, py, qx, qy} = props.mousePositionData;
    let bb = wrapper.value.getBoundingClientRect();
    return {
        px: Math.min(Math.max(px,bb.x), bb.x+bb.width) - bb.left,
        py: Math.min(Math.max(py,bb.y), bb.y+bb.height) - bb.top,
        qx: Math.min(qx, bb.x+bb.width) - bb.left,
        qy: Math.min(qy, bb.y+bb.height) - bb.top
    };
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

window.onresize = function () {
    calculateDims(props.sourceImageWidth, props.sourceImageHeight)
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
});

onMounted(() => {
    calculateDims(props.sourceImageWidth, props.sourceImageHeight);
});
</script>

<style lang="scss" scoped>
.canvas-wrapper {
    margin: 0 auto;
    border: solid 1px black;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    position: relative;
    cursor: crosshair;
}

.workspace {
    max-width: 1600px;
    width: 100%;
    height: 100%;
    margin: 0 auto;
}


</style>