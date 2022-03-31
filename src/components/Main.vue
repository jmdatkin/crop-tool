<script setup lang="ts">
import Canvas from "./Canvas/Canvas.vue";
import { loadFile } from '../file-handler';
import { reactive, ref } from "vue";
import ProgressBar from "./ProgressBar.vue";

const count = ref(0);
const workspace = ref(null);
const offscreenCanvas = document.createElement('canvas');
const loadedImage = ref(new Image());
const dragging = ref(false);
const dataLoaded = ref(false);
const canvasDataURL = ref('');

const canvasDims = reactive({
    width: 0,
    height: 0
});

const canvasDrawCallback = function(canv: HTMLCanvasElement) {
    // ctx.drawImage(offscreenCanvas, 0,0, offscreenCanvas.width, width, height)
    // console.log(offscreenCanvas.width);
    canv.getContext('2d').drawImage(offscreenCanvas, 0, 0, offscreenCanvas.width, offscreenCanvas.height, 0, 0, canv.width, canv.height);
}


const calculateCanvasDims = function (width: number, height: number) {
    let workspaceBb: DOMRect = workspace.value.getBoundingClientRect();
    let workspaceWidth = workspaceBb.width;
    let workspaceHeight = workspaceBb.height;

    let workspaceRatio = workspaceWidth / workspaceHeight;
    let imageRatio = loadedImage.value.naturalWidth / loadedImage.value.naturalHeight;

    // console.log(imageRatio);

    let ratioDifference = imageRatio - workspaceRatio;

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

    return [newWidth, newHeight];
};


//Event handlers
const dropHandler = function (e: DragEvent) {
    e.preventDefault();
    dragging.value = false;

    if (e.dataTransfer.items) {
        let item = e.dataTransfer.items[0];

        loadFile(item).then(url => {

            loadedImage.value.src = url;

            loadedImage.value.onload = () => {
                offscreenCanvas.width = loadedImage.value.naturalWidth;
                offscreenCanvas.height = loadedImage.value.naturalHeight;

                offscreenCanvas.getContext('2d')?.drawImage(loadedImage.value, 0, 0);

                resizeCanvas();
                dataLoaded.value = true;

                count.value++;
            };


            canvasDataURL.value = url;
        }).catch(err => console.error(err));
    }
};

const resizeCanvas = function () {
    let [newWidth, newHeight] = calculateCanvasDims(loadedImage.value.naturalWidth, loadedImage.value.naturalHeight);

    canvasDims.width = newWidth;
    canvasDims.height = newHeight;
};

window.onresize = function () {
    resizeCanvas();
};

const dragHandler = function (e: Event) {
    e.preventDefault();
    dragging.value = true;
}

let px, py;
const mousedownHandler = function (e: MouseEvent) {
    px = e.pageX;
    py = e.pageY;
};

const mousemoveHandler = function (e: MouseEvent) {

};

</script>

<template>
    <div class="main-view">
        <ProgressBar />
        <div class="content-wrapper" @drop.prevent="dropHandler" @dragover="dragHandler">
            <div class="workspace" ref="workspace">
                <Canvas
                    v-if="dataLoaded"
                    :width="canvasDims.width"
                    :height="canvasDims.height"
                    :draw="canvasDrawCallback"
                    :key="count"
                ></Canvas>
                <div v-else class="canvas-placeholder">
                    <h2 :class="{ 'dragging': dragging }">Drag an image</h2>
                </div>
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
.workspace {
    max-width: 1600px;
    width: 100%;
    height: 100%;
    margin: 0 auto;
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