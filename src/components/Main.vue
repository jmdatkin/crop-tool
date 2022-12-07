<script setup lang="ts">
import Canvas from "./Canvas/ImageCanvas.vue";
import { loadFile } from '../file-handler';
import { nextTick, reactive, ref, type Ref } from "vue";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import ProgressBar from "./ProgressBar.vue";
import CanvasGroup from "./Canvas/CanvasGroup.vue";
import CollapsibleToolbar from "./CollapsibleToolbar.vue";
import { computed } from "@vue/reactivity";

const dragging = ref(false);
const dataLoaded = ref(false);
const fileLoaded = ref(false);
const canvasMounted = ref(false);
const canvasScaleFactor = ref(1.0);

const mainView = ref(null);
const canvasGroup = ref(null);

// const scaleFactor = ref(canvasG)

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
const mouseDown = ref(false);
const mousePositionData = reactive({
    px: 0,
    py: 0,
    qx: 0,
    qy: 0
});

const offsetMousePosition = computed(() => {
    if (dataLoaded.value && canvasMounted.value) {
        let canvasBb = canvasGroup.value.wrapper.getBoundingClientRect();
        let mainViewBb = mainView.value.getBoundingClientRect();

        let {px,py,qx,qy} = mousePositionData;

        // Swap x coords if drawn backwards horizontally
        if (qx < px)
            [px,qx] = [qx,px]
            
        // Swap y coords if drawn backwards vertically
        if (qy < py)
            [py,qy] = [qy,py]

        return {
            px: Math.min(Math.max(canvasBb.left, px), canvasBb.left + canvasBb.width) - canvasBb.left,// - mainViewBb.left,
            py: Math.min(Math.max(canvasBb.top, py), canvasBb.top + canvasBb.height) - canvasBb.top,// - mainViewBb.top,
            qx: Math.min(Math.max(canvasBb.left, qx), canvasBb.left + canvasBb.width) - canvasBb.left,// - mainViewBb.left,
            qy: Math.min(Math.max(canvasBb.top, qy), canvasBb.top + canvasBb.height) - canvasBb.top,// - mainViewBb.top,
        };
    }
    else return mousePositionData;
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
        dataLoaded.value = true;
    });
};

const dropHandler = function (e: DragEvent) {
    e.preventDefault();
    dragging.value = false;

    if (e.dataTransfer.items) {
        dataLoaded.value = false;
        canvasMounted.value = false;
        let item = e.dataTransfer.items[0];

        loadFile(item).then(url => {
            loadImageObject(url);
        }).catch(err => console.error(err));
    }
};

const onCanvasMounted = function() {
    canvasMounted.value = true;
};

const onCanvasResize = function(data) {
    canvasScaleFactor.value = data.scaleFactor;
};


const dragHandler = function (e: Event) {
    e.preventDefault();
    dragging.value = true;
}

const dragendHandler = function(e: Event) {
    e.preventDefault();
    dragging.value = false;
}

const mousedownHandler = function (e: MouseEvent) {
    mousePositionData.px = e.pageX;
    mousePositionData.py = e.pageY;
    mousePositionData.qx = e.pageX;
    mousePositionData.qy = e.pageY;
    clickDrag.value = false;
    mouseDown.value = true;
};

const mousemoveHandler = function (e: MouseEvent) {
    let qx = e.pageX;
    let qy = e.pageY;

    let dx = qx - mousePositionData.px;
    let dy = qy - mousePositionData.py;

    if (dx*dx + dy*dy > 81 && mouseDown.value)
        clickDrag.value = true;

    if (clickDrag.value) {
        mousePositionData.qx = qx;
        mousePositionData.qy = qy;
    }
};

const mouseupHandler = function (e: MouseEvent) {
    clickDrag.value = false;
    mouseDown.value = false;
};

</script>

<template>
    <div class="main-view" ref="mainView">
        <CollapsibleToolbar v-if="dataLoaded"
            :sourceImage="imageObject"
            :sourceImageWidth="imageDims.width"
            :sourceImageHeight="imageDims.height"
            :mousePositionData="offsetMousePosition"
            :scaleFactor="canvasScaleFactor"

        ></CollapsibleToolbar>
        <!-- <ProgressBar /> -->
        <!-- <div class="drop-target"></div> -->
        <div class="content-wrapper"
            @drop.prevent="dropHandler"
            @dragover="dragHandler"
            @dragleave="dragendHandler"
            @mousedown="mousedownHandler"
            @mousemove="mousemoveHandler"
            @mouseup="mouseupHandler"
            >
            <CanvasGroup ref="canvasGroup" v-if="dataLoaded" @canvasMounted="onCanvasMounted" @resize="onCanvasResize"
                :sourceImage="imageObject"
                :sourceImageWidth="imageDims.width"
                :sourceImageHeight="imageDims.height"
                :mousePositionData="offsetMousePosition"
                :dragging="clickDrag"
                :fileLoaded="fileLoaded"
                :dataLoaded="dataLoaded"
            ></CanvasGroup>
            <div v-else class="canvas-placeholder">
                <h2 class="text-gray-500 tracking-tight" :class="{ 'dragging': dragging }">Drag an image</h2>
                <span class="upload-icon" :class="{ 'upload-icon-dragging': dragging}">
                    <FontAwesomeIcon class="text-gray-500" icon="fa-solid fa-upload" size="6x"></FontAwesomeIcon>
                </span>
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
    position: relative;
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

span.upload-icon {
    text-align: center;
    opacity: 0;
}

span.upload-icon.upload-icon-dragging {
    animation: upload-icon-enter 0.5s normal forwards ease-in-out, 0.5s upload-icon-hover 0.5s alternate infinite ease-in-out;
}

.canvas-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    user-select: none;
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

@keyframes upload-icon-hover {
    from {
        opacity: 1
    }

    to {
        opacity: 0.5
    }
}

@keyframes upload-icon-enter {
    from {
        transform: translateY(10px);
        opacity: 0
    }

    to {
        transform: translateY(0);
        opacity: 1
    }
}
</style>