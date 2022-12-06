<script setup lang="ts">
import Canvas from "./Canvas/Canvas.vue";
import { loadFile } from '../file-handler';
import { reactive, ref, type Ref } from "vue";
import ProgressBar from "./ProgressBar.vue";
import { computed } from "@vue/reactivity";

const dragging = ref(false);
const dataLoaded = ref(false);

const offscreenCanvas: Ref<HTMLCanvasElement> = ref(document.createElement('canvas'));
const offscreenImageData = computed(() => {
    let {width, height} = offscreenCanvas.value;

    return offscreenCanvas.value.getContext('2d')?.getImageData(0,0,width,height) || null;
});

const imageObject: Ref<HTMLImageElement | null> = ref(null);
const imageDims = reactive({
    width: 0,
    height: 0
});

const clickDrag = ref(false);
const mousePositionData = reactive({
    px: 0,
    py: 0,
    qx: 0,
    qy: 0
});

const loadImageObject = function (dataUrl: string) {
    let im = new Image();
    im.src = dataUrl;
    im.decode().then(() => {
        imageDims.width = im.naturalWidth;
        imageDims.height = im.naturalHeight;
        imageObject.value = im;

        offscreenCanvas.value.width = imageDims.width;
        offscreenCanvas.value.height = imageDims.height;
        offscreenCanvas.value.getContext('2d')?.drawImage(imageObject.value as CanvasImageSource, 0, 0);
    });
};

const dropHandler = function (e: DragEvent) {
    e.preventDefault();
    dragging.value = false;

    if (e.dataTransfer.items) {
        let item = e.dataTransfer.items[0];

        loadFile(item).then(url => {
            dataLoaded.value = true;
            loadImageObject(url);
            // canvas_dataURL.value = url;
        }).catch(err => console.error(err));
    }
};



const dragHandler = function (e: Event) {
    e.preventDefault();
    dragging.value = true;
}

let px, py;
const mousedownHandler = function (e: MouseEvent) {
    mousePositionData.px = e.pageX;
    mousePositionData.py = e.pageY;
    clickDrag.value = false;
};

const mousemoveHandler = function (e: MouseEvent) {
    mousePositionData.qx = e.pageX;
    mousePositionData.qy = e.pageY;

    let dx = mousePositionData.qx - mousePositionData.px;
    let dy = mousePositionData.qy - mousePositionData.py;

    if (dx*dx + dy*dy > 81)
        clickDrag.value = true;

    if (clickDrag.value) {

    }
};

const mouseupHandler = function (e: MouseEvent) {

}

</script>

<template>
    <div class="main-view">
        <ProgressBar />
        <!-- <div class="drop-target"></div> -->
        <div class="content-wrapper"
            @drop.prevent="dropHandler"
            @dragover="dragHandler"
            @mousedown="mousedownHandler"
            @mousemove="mousemoveHandler"
            @mouseup="mouseupHandler"
            >
            <Canvas v-if="dataLoaded" 
                :sourceImage="imageObject"
                :sourceImageWidth="imageDims.width"
                :sourceImageHeight="imageDims.height"
            ></Canvas>
            <div v-else class="canvas-placeholder">
                <h2 :class="{ 'dragging': dragging }">Drag an image</h2>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.drop-target {
    position: absolute;
    width: 100%;
    height: 100%;
}

.main-view {
    width: 100%;
    height: 100%;
}

.content-wrapper {
    width: 100%;
    height: 100%;
    padding: 40px 0;
}

h2 {
    font-size: 48pt;
    margin-bottom: 12rem;
    pointer-events: none;
}

.dragging {
    animation: dragging 1s infinite alternate-reverse ease-in-out;
    // animation-name: dragging;
}

.canvas-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    color: #666;
    place-items: center;
    justify-content: center;
}

@keyframes dragging {
    from {
        color: #666;
        transform: 0;
    }

    to {
        color: #aaa;
        transform: scale(1.0045);
    }
}
</style>