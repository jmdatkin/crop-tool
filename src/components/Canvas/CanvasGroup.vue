<template>
    <div class="workspace" ref="workspace">
        <div ref="wrapper" class="canvas-wrapper border-slate-700 shadow-lg" :class="{'wrapper-data-loaded': dataLoaded}" >
            <div class="wrapper-children w-full h-full absolute">
                <slot></slot>
            </div>
            <ImageCanvas v-if="dataLoaded"
                :width="canvasDims.width"
                :height="canvasDims.height"
                :sourceImage="props.sourceImage"
                :sourceImageWidth="props.sourceImageWidth"
                :sourceImageHeight="props.sourceImageHeight"
            ></ImageCanvas>
            <OverlayCanvas v-if="dataLoaded"
                :width="canvasDims.width"
                :height="canvasDims.height"
                :dragging="props.dragging"
                :showGridlines="showGridlines"
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
    sourceImageHeight: Number,
    dragging: boolean,
    dataLoaded: boolean,
    showGridlines: boolean
}>();

const emit = defineEmits(['canvasMounted', 'resize']);

const wrapper = ref(null);
const workspace = ref(null);

const scaleFactor = ref(1.0);

defineExpose({
    wrapper,
    scaleFactor
});

const canvasDims = reactive({
    width: 0,
    height: 0
});

const calculateDims = function (width, height) {
    let workspaceBb: DOMRect = workspace.value.getBoundingClientRect();
    console.log(workspaceBb);
    let workspaceWidth = workspaceBb.width;
    let workspaceHeight = workspaceBb.height;

    let workspaceRatio = workspaceWidth / workspaceHeight;
    let imageRatio = width / height;
    let newScaleFactor = 1.0;

    let ratioDifference = imageRatio - workspaceRatio;

    let newWidth, newHeight;
    //Landscape
    if (ratioDifference > 0) {
        newWidth = workspaceWidth;
        newHeight = newWidth / imageRatio;
        newScaleFactor = workspaceWidth / width;
    }
    //Portrait
    else {
        newHeight = workspaceHeight;
        newWidth = newHeight * imageRatio;
        newScaleFactor = workspaceHeight / height;
    }


    // newWidth = workspaceWidth
    // newHeight = newWidth / imageRatio

    //imageRatio = width / height

    // newHeight = newWidth / (width / height)

    // newHeight = newWidth * (height / width)

    scaleFactor.value = newScaleFactor;

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
    // wrapper.value.style.width = `${width+2}px`;     //Add 2 to account for border width
    // wrapper.value.style.height = `${height+2}px`;
    wrapper.value.style.width = `${width}px`;     //Add 2 to account for border width
    wrapper.value.style.height = `${height}px`;

    emit('resize', {width,height, scaleFactor: scaleFactor.value});
    // canv.value.width = width;
    // canv.value.height = height;
}

onUpdated(() => {
    // calculateDims(props.sourceImageWidth, props.sourceImageHeight);
});

onMounted(() => {
    calculateDims(props.sourceImageWidth, props.sourceImageHeight);
    emit('canvasMounted');
});
</script>

<style lang="scss" scoped>
.canvas-wrapper {
    margin: 0 auto;
    // border: solid 1px black;
    // box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 0 1px #374151;
    position: relative;
    opacity: 0;
    transition: opacity 0.2s;
    cursor: crosshair;
}
.wrapper-data-loaded {
    opacity: 1;
}
.workspace {
    // max-width: 1600px;
    width: 100%;
    height: 100%;
    // margin: 0 auto;
}



</style>