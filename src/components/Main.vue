<script setup lang="ts">
import Canvas from "./Canvas/Canvas.vue";
import { loadFile } from '../file-handler';
import { onMounted, reactive, ref } from "vue";
import ProgressBar from "./ProgressBar.vue";
import { Tools } from "@/constants";
import SelectionSettingsTooltip from "./SelectionSettingsTooltip.vue";
import Sidebar from "./Sidebar.vue";
import CropPreview from "./CropPreview.vue";

const selectedTool = ref(Tools.SELECT);

const count = ref(0);
const updateCropPreview = ref(0);
const workspace = ref(null);
const offscreenCanvas = document.createElement('canvas');
const loadedImage = ref(new Image());
const dragging = ref(false);
const dataLoaded = ref(false);
const canvasDataURL = ref('');

const marqueeSelected = ref(false);

const sidebarOpen = ref(false);

const canvasDims = reactive({
    left: 0,
    top: 0,
    width: 0,
    height: 0
});

const marquee = reactive({
    x: 0,
    y: 0,
    w: 0,
    h: 0
});

const cropPreviewCallback = function (canv: HTMLCanvasElement) {
    console.log(canvasDims.left);


    let ox = (marquee.x - canvasDims.left) * (offscreenCanvas.width / canvasDims.width);
    let oy = (marquee.y - canvasDims.top) * (offscreenCanvas.height / canvasDims.height);

    let ow = marquee.w * (offscreenCanvas.width / canvasDims.width);
    let oh = marquee.h * (offscreenCanvas.height / canvasDims.height);

    let dest_w = marquee.w * (canv.width / canvasDims.width);
    let dest_h = marquee.h * (canv.height / canvasDims.height);

    canv.getContext('2d')?.drawImage(offscreenCanvas, ox, oy, ow, oh, 0, 0, canv.width, canv.height);//dest_w, dest_h)
}

const canvasImageCallback = function (canv: HTMLCanvasElement) {
    // ctx.drawImage(offscreenCanvas, 0,0, offscreenCanvas.width, width, height)
    // console.log(offscreenCanvas.width);
    canv.getContext('2d').drawImage(offscreenCanvas, 0, 0, offscreenCanvas.width, offscreenCanvas.height, 0, 0, canv.width, canv.height);
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
    }
    //Portrait orientation
    else {
        newHeight = workspaceHeight;
        newWidth = newHeight * imageRatio;
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

                count.value++;
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
    console.log("HI");
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

            marquee.x = px;
            marquee.y = py;
            marquee.w = dx;
            marquee.h = dy;

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
        <div class="content-wrapper" @drop.prevent="dropHandler" @dragover="dragHandler">
            <div class="content-flex-group">
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
                        :selX="marquee.x"
                        :selY="marquee.y"
                        :selW="marquee.w"
                        :selH="marquee.h"
                    ></Canvas>
                    <div v-else class="canvas-placeholder">
                        <h2 :class="{ 'dragging': dragging }">Drag an image</h2>
                    </div>
                </div>
                <Transition name="sidebar-slide">
                    <Sidebar v-show="sidebarOpen">
                        <CropPreview :key="updateCropPreview" :draw="cropPreviewCallback" />
                        <label for="max">Marquee X</label>
                        <input type="text" id="mx" />
                    </Sidebar>
                </Transition>
            </div>
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
    width: 100%;
    height: 100%;
    // padding: 40px 0;
}

.content-flex-group {
    display: flex;
    flex-direction: row;
    
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