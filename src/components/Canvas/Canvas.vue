<template>
    <div class="workspace" ref="workspace">
        <div ref="wrapper" class="canvas-wrapper">
            <canvas id="main-canv" ref="canv"></canvas>
        </div>
    </div>
</template>

<script setup lang="ts">import { nextTick, onMounted, onUpdated, reactive, ref, watch } from 'vue';


const props = defineProps<{
    // width: Number,
    // height: Number,
    dataURL: string
}>();

const dragging = ref(false);

const dataLoaded = ref(false);
const dataURL = ref(props.dataURL);
const loadedImageData = reactive({
    dataURL,
    width: 0,
    height: 0
});

const offscreenCanvas = document.createElement('canvas');
const canv = ref(null);
const wrapper = ref(null);
const workspace = ref(null);

const calculateDims = function (width, height) {
    let workspaceBb: DOMRect = workspace.value.getBoundingClientRect();
    let workspaceWidth = workspaceBb.width;
    let workspaceHeight = workspaceBb.height;

    let workspaceRatio = workspaceWidth / workspaceHeight;
    let imageRatio = width / height;

    let ratioDifference = imageRatio - workspaceRatio;
    // let workspaceOrientation: ('landscape' | 'portrait') = workspaceWidth > workspaceHeight ? 'landscape' : 'portrait';
    // let imageOrientation: ('landscape' | 'portrait') = width > height ? 'landscape' : 'portrait';

    let newWidth, newHeight;

    //Landscape orientation
    if (ratioDifference > 0) {
        newWidth = workspaceWidth;
        newHeight = newWidth / imageRatio;
    }
    //Portrait orientation
    else {
        newHeight = workspaceHeight;
        newWidth = newHeight * imageRatio;
    }

    resize(newWidth, newHeight);
    // canv.value.getContext('2d').drawImage(im, 0, 0);
    //Landscape orientation
    // let limitingDimension;
    // if ((workspaceOrientation == 'landscape' && imageOrientation == 'landscape') ||
    //     (workspaceOrientation == )
};

const drawOnscreen = function () {
    window.requestAnimationFrame(() => {
        let imageData = offscreenCanvas.getContext('2d')?.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);
        // canv.value.getContext('2d').imageSmoothingEnabled = false;
        canv.value.getContext('2d').drawImage(offscreenCanvas, 0, 0, offscreenCanvas.width, offscreenCanvas.height, 0, 0, canv.value.width, canv.value.height);
    });
}

window.onresize = function () {
    calculateDims(loadedImageData.width, loadedImageData.height)
    drawOnscreen();
};

const resize = function (width: number, height: number): void {
    width = Math.floor(width);
    height = Math.floor(height);
    wrapper.value.style.width = `${width+2}px`;     //Add 2 to account for border width
    wrapper.value.style.height = `${height+2}px`;
    canv.value.width = width;
    canv.value.height = height;
}

watch(dataURL, (newURL, oldURL) => {
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
});

onUpdated(() => {
    dataURL.value = props.dataURL;
});

onMounted(() => {
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
    // canv.value.height = props.height;
});
</script>

<style lang="scss" scoped>
.canvas-wrapper {
    margin: 0 auto;
    border: solid 1px black;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}
.workspace {
    max-width: 1600px;
    width: 100%;
    height: 100%;
    margin: 0 auto;
}


</style>