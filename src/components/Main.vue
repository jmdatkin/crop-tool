<script setup lang="ts">
import Canvas from "./Canvas/Canvas.vue";
import { loadFile } from '../file-handler';
import { reactive, ref } from "vue";
import ProgressBar from "./ProgressBar.vue";
import CanvasDataLayer from "./Canvas/CanvasDataLayer.vue";
import EventBus from '../events';

const dragging = ref(false);
const dataLoaded = ref(false);
const canvas_dataURL = ref('');
const workspace = ref(null);

const canvasDims = reactive({
    width: 0,
    height: 0
});


EventBus.on('resize-canvas-request', (width: number, height: number) => {
    let [newWidth, newHeight] = calculateCanvasDims(width, height);
    canvasDims.width = newWidth;
    canvasDims.height = newHeight;
});

const dropHandler = function (e: DragEvent) {
    e.preventDefault();
    dragging.value = false;

    if (e.dataTransfer.items) {
        let item = e.dataTransfer.items[0];

        loadFile(item).then(url => {
            dataLoaded.value = true;
            canvas_dataURL.value = url;
        }).catch(err => console.error(err));
    }
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

const calculateCanvasDims = function (width: number, height: number) {
    // console.log(props.workspace.value);
    let workspaceBb: DOMRect = workspace.value.getBoundingClientRect();
    let workspaceWidth = workspaceBb.width;
    let workspaceHeight = workspaceBb.height;

    let workspaceRatio = workspaceWidth / workspaceHeight;
    let imageRatio = width / height;

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
</script>

<template>
    <div class="main-view">
        <ProgressBar />
        <!-- <div class="drop-target"></div> -->
        <div class="content-wrapper" @drop.prevent="dropHandler" @dragover="dragHandler">
            <!-- <Canvas v-if="dataLoaded" :dataURL="canvas_dataURL"></Canvas> -->
            <div class="workspace" ref="workspace">
                <CanvasDataLayer
                    v-if="dataLoaded"
                    :dataURL="canvas_dataURL"
                    :canvas_width="canvasDims.width"
                    :canvas_height="canvasDims.height"
                ></CanvasDataLayer>
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