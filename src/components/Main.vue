<script setup lang="ts">
import Canvas from "./Canvas/Canvas.vue";
import { loadFile } from '../file-handler';
import { onMounted, provide, reactive, ref } from "vue";
import ProgressBar from "./ProgressBar.vue";
import { Tools } from "@/constants";
import SelectionSettingsTooltip from "./SelectionSettingsTooltip.vue";
import Sidebar from "./Sidebar.vue";
import CropPreview from "./CropPreview.vue";
import { cumulativeOffset } from "../util";
import type BoundingBox from '../../types/bounding-box';

const selectedTool = ref(Tools.SELECT);

const count = ref(0);
const updateCropPreview = ref(0);
const workspace = ref(null);
const offscreenCanvas = document.createElement('canvas');
const loadedImage = ref(new Image());
const dragging = ref(false);
const dataLoaded = ref(false);
const canvasDataURL = ref('');
const canvasRefs = ref(null);
const canvasScaleFactor = ref(0);
const contentWrapper = ref(null);

const marqueeSelected = ref(false);

const sidebarOpen = ref(false);

const canvasDims: BoundingBox = reactive({
    left: 0,
    top: 0,
    width: 0,
    height: 0
});

const marquee: BoundingBox = reactive({
    left: 0,
    top: 0,
    width: 0,
    height: 0
});

provide('offscreen-canvas', offscreenCanvas);

const canvasToOffscreenCoords = function (coords: BoundingBox) {
    let { left: c_left, top: c_top, width: c_width, height: c_height } = coords;
    // let canvasOffset = cumulativeOffset(canvas.value as HTMLCanvasElement);
    let canvasOffset = {
        left: canvasRefs.value.wrapper.offsetLeft,
        top: canvasRefs.value.wrapper.offsetTop + contentWrapper.value.offsetTop
    };

    // console.log(canvasRefs);

    console.log(canvasOffset);

    let wRatio = canvasDims.width / offscreenCanvas.width;
    let hRatio = canvasDims.height / offscreenCanvas.height;
    let scaleFactor = canvasScaleFactor.value;

    return {
        left: (c_left - canvasOffset.left) / scaleFactor,
        top: (c_top - canvasOffset.top) / scaleFactor,
        width: c_width / scaleFactor,
        height: c_height / scaleFactor
    };
};

// const cropPreviewCallback = function (canv: HTMLCanvasElement, p_width: number, p_height: number) {
const cropPreviewCallback = function (canv: HTMLCanvasElement, previewDims: BoundingBox) {
    let offscreenCoords = canvasToOffscreenCoords(marquee);

    let { left: o_left, top: o_top, width: o_width, height: o_height } = offscreenCoords;
    let { left: p_left, top: p_top, width: p_width, height: p_height } = previewDims;

    // let ox = (marquee.left - canvasDims.left) * (offscreenCanvas.width / canvasDims.width);
    // let oy = (marquee.top - canvasDims.top) * (offscreenCanvas.height / canvasDims.height);

    // let ow = marquee.width * (offscreenCanvas.width / canvasDims.width);
    // let oh = marquee.height * (offscreenCanvas.height / canvasDims.height);

    // let dest_w = marquee.width * (canv.width / canvasDims.width);
    // let dest_h = marquee.height * (canv.height / canvasDims.height);
    let ctx = canv.getContext('2d');

    ctx.fillStyle = "black";
    // ctx?.fillRect(0, 0, canv.width, canv.height);
    ctx.drawImage(offscreenCanvas, o_left, o_top, o_width, o_height, p_left, p_top, p_width, p_height);//dest_w, dest_h)
}

const canvasImageCallback = function (canv: HTMLCanvasElement) {
    // ctx.drawImage(offscreenCanvas, 0,0, offscreenCanvas.width, width, height)
    // console.log(offscreenCanvas.width);
    canv.getContext('2d').drawImage(offscreenCanvas, 0, 0, offscreenCanvas.width, offscreenCanvas.height, 0, 0, canv.width, canv.height);
};

const canvasOffset = function (obj) {
    let { x, y } = obj;

    let offsetLeft = workspace.value.offsetLeft;
    let offsetTop = workspace.value.offsetTop;
    return {
        x: x - offsetLeft,
        y: y - offsetTop
    };
};

const canvasMarqueeCallback = function (canv: HTMLCanvasElement) {
    let ctx = canv.getContext('2d');
    let bb = canv.getBoundingClientRect();
    let c_px = Math.max(px - bb.left, 0);
    let c_py = Math.max(py - bb.top, 0);
    ctx?.clearRect(0, 0, canv.width, canv.height);
    ctx.strokeStyle = "#000";
    ctx?.strokeRect(c_px, c_py, Math.min(dx, bb.width), Math.min(dy, bb.height));
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
        canvasScaleFactor.value = newWidth / loadedImage.value.naturalWidth;
    }
    //Portrait orientation
    else {
        newHeight = workspaceHeight;
        newWidth = newHeight * imageRatio;
        canvasScaleFactor.value = newHeight / loadedImage.value.naturalHeight;
    }

    return [newWidth, newHeight, workspaceBb.left, workspaceBb.top];
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

                // count.value++;
            };


            canvasDataURL.value = url;
        }).catch(err => console.error(err));
    }
};

const resizeCanvas = function () {
    let [newWidth, newHeight, left, top] = calculateCanvasDims(loadedImage.value.naturalWidth, loadedImage.value.naturalHeight);

    canvasDims.left = left;
    canvasDims.top = top;
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

let px: number;
let py: number;
let dx: number;
let dy: number;
let selDrag = false;
const mousedownHandler = function (e: MouseEvent) {
    e.preventDefault();
    switch (selectedTool.value) {
        case Tools.SELECT:
            px = e.pageX;
            py = e.pageY;
            selDrag = true;
    }
};

const mousemoveHandler = function (e: MouseEvent) {
    e.preventDefault();
    switch (selectedTool.value) {
        case Tools.SELECT:
            if (!selDrag) return;
            let qx = e.pageX;
            let qy = e.pageY;

            dx = qx - px;
            dy = qy - py;


            marquee.left = px;
            marquee.top = py;
            marquee.width = dx;
            marquee.height = dy;

            updateCropPreview.value += 1;
    }
};

const mouseupHandler = function (e: MouseEvent) {
    e.preventDefault();
    switch (selectedTool.value) {
        case Tools.SELECT:
            if (dx * dx + dy * dy > 81) {
                // marqueeSelected.value = true;
                selDrag = false;
                sidebarOpen.value = true;
            } else {
                sidebarOpen.value = false;
            }
    }

}

// onMounted(() => {
//     document.querySelector('.content-wrapper').addEventListener('mousedown', mousedownHandler);
// });

</script>

<template>
    <div class="main-view">
        <div class="settings-overlay">
            <!-- <SelectionSettingsTooltip></SelectionSettingsTooltip> -->
        </div>
        <div ref="contentWrapper" class="content-wrapper" @drop.prevent="dropHandler" @dragover="dragHandler">
            <Transition name="content-slide">
                <div class="canvas-content-group" :class="{ 'content-slide': sidebarOpen }">
                    <div
                        @mousedown="mousedownHandler"
                        @mouseup="mouseupHandler"
                        @mousemove="mousemoveHandler"
                        class="workspace"
                        :class="{ 'loaded': dataLoaded }"
                        ref="workspace"
                    >
                        <Canvas
                            v-if="dataLoaded"
                            :width="canvasDims.width"
                            :height="canvasDims.height"
                            :drawImage="canvasImageCallback"
                            :drawSelectionRect="canvasMarqueeCallback"
                            :key="count"
                            :marquee="marquee"
                            ref="canvasRefs"
                        ></Canvas>
                        <div v-else class="canvas-placeholder">
                            <h2 :class="{ 'dragging': dragging }">Drag an image</h2>
                        </div>
                    </div>
                </div>
            </Transition>
            <Transition name="sidebar-slide">
                <Sidebar v-show="sidebarOpen">
                    <CropPreview
                        :key="updateCropPreview"
                        :marquee="marquee"
                        :draw="cropPreviewCallback"
                    />
                    <label for="max">Marquee X</label>
                    <input type="text" id="mx" />
                </Sidebar>
            </Transition>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import "@/assets/variables.scss";
.settings-overlay {
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    z-index: 3;
    pointer-events: none;
}

.settings-overlay * {
    pointer-events: auto;
}
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
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
}

.canvas-content-group {
    padding: 40px 0;
    flex-grow: 1;
    position: relative;
}
.workspace {
    max-width: 1600px;
    width: 100%;
    height: 100%;
    margin: 0 auto;
}

.workspace.loaded {
    cursor: crosshair;
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
.content-slide-enter-active,
.content-slide-leave-active {
    transition: right 0.15s ease-out;
}

.content-slide-enter-from,
.content-slide-leave-to {
    right: -1 * $sidebar-width;
}

.sidebar-slide-enter-to,
.sidebar-slide-leave-from {
    right: 0;
}
.sidebar-slide-enter-active,
.sidebar-slide-leave-active {
    transition: right 0.15s ease-out;
}

.sidebar-slide-enter-from,
.sidebar-slide-leave-to {
    right: -1 * $sidebar-width;
}

.sidebar-slide-enter-to,
.sidebar-slide-leave-from {
    right: 0;
}
</style>