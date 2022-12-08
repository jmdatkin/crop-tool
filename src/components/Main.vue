<script setup lang="ts">
import Canvas from "./Canvas/ImageCanvas.vue";
import { loadFile } from '../file-handler';
import { nextTick, reactive, ref, type Ref } from "vue";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import ProgressBar from "./ProgressBar.vue";
import CanvasGroup from "./Canvas/CanvasGroup.vue";
import CollapsibleToolbar from "./CollapsibleToolbar.vue";
import { computed } from "@vue/reactivity";
import ToolbarItem from "./ToolbarItem.vue";
import CropPreview from "./CropPreview.vue";
import { sidebarWidth } from '@/variables';
import InputText from "./InputText.vue";
import Button from "./Button.vue";
import Rulers from "./Rulers.vue";
import { transform } from "@vue/compiler-core";
import { useSelectionStore } from "@/stores/selection";

const dragging = ref(false);

const drawing = ref(false);
const draggingSelection = ref(false);

const mouseInsideSelection = ref(false);

const dataLoaded = ref(false);
const fileLoaded = ref(false);
const canvasMounted = ref(false);
const canvasScaleFactor = ref(1.0);

const selectionStore = useSelectionStore();

const mainView = ref(null);
const canvasGroup = ref(null);

const canvasGroupBb = ref(null);

const imageObject: Ref<HTMLImageElement | null> = ref(null);
const imageDims = reactive({
    width: 0,
    height: 0
});

const clickDrag = ref(false);
const mouseDown = ref(false);

const transformMouseX = function (x: number) {
    if (dataLoaded.value && canvasMounted.value) {
        let canvasBb = canvasGroup.value.wrapper.getBoundingClientRect();

        return Math.floor(Math.min(Math.max(canvasBb.left, x), canvasBb.left + canvasBb.width) - canvasBb.left);
    }
    else return x;
};

const transformMouseY = function (y: number) {
    if (dataLoaded.value && canvasMounted.value) {
        let canvasBb = canvasGroup.value.wrapper.getBoundingClientRect();
        return Math.floor(Math.min(Math.max(canvasBb.top, y), canvasBb.top + canvasBb.height) - canvasBb.top);
    }
    else return y;
};

const posInQuad = function (p: number, q: number, x: number, y: number, w: number, h: number) {
    return (p > x && p <= x + w &&
        q > y && q <= y + h);
};

const loadImageObject = function (dataUrl: string) {
    let im = new Image();
    im.src = dataUrl;
    im.decode().then(() => {
        imageDims.width = im.naturalWidth;
        imageDims.height = im.naturalHeight;
        imageObject.value = im;

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

const onCanvasMounted = function () {
    canvasMounted.value = true;
    canvasGroupBb.value = canvasGroup.value.wrapper.getBoundingClientRect();
};

const onCanvasResize = function (data) {
    canvasScaleFactor.value = data.scaleFactor;
    canvasGroupBb.value = canvasGroup.value.wrapper.getBoundingClientRect();
};


const dragHandler = function (e: Event) {
    e.preventDefault();
    dragging.value = true;
}

const dragendHandler = function (e: Event) {
    e.preventDefault();
    dragging.value = false;
}

// const ipos = ref({});
const ipos = reactive({
    px: 0,
    py: 0,
    qx: 0,
    qy: 0,
    ix: 0,
    iy: 0
});

const mousedownHandler = function (e: MouseEvent) {
    // let px = transformMouseX(e.pageX);
    // let py = transformMouseY(e.pageY);
    ipos.px = transformMouseX(e.pageX);
    ipos.py = transformMouseY(e.pageY);

    let x = selectionStore.x;
    let y = selectionStore.y;
    let w = selectionStore.w;
    let h = selectionStore.h;

    ipos.ix = x;
    ipos.iy = y;

    if (posInQuad(ipos.px, ipos.py, x, y, w, h))
        mouseInsideSelection.value = true;

    if (mouseInsideSelection.value) {
        draggingSelection.value = true;
        // ipos.value = Object.assign({}, selectionStore.pos);
        // ox.value = px;
        // oy.value = py;

    } else {
        drawing.value = true;
        selectionStore.update({
            // x: transformMouseX(e.pageX),
            // y: transformMouseY(e.pageY),
            x: ipos.px,
            y: ipos.py,
            w: 0,
            h: 0
        });
    }

    clickDrag.value = false;
    mouseDown.value = true;
};

const mousemoveHandler = function (e: MouseEvent) {
    let x = selectionStore.x;
    let y = selectionStore.y;
    let w = selectionStore.w;
    let h = selectionStore.h;

    if (canvasGroup.value !== null) {
        if (drawing.value)
            canvasGroup.value.wrapper.style.cursor = 'crosshair';
        else if (draggingSelection.value)
            canvasGroup.value.wrapper.style.cursor = 'grabbing';
        else if (posInQuad(ipos.qx, ipos.qy, x, y, w, h))
            canvasGroup.value.wrapper.style.cursor = 'grab';
        else
            canvasGroup.value.wrapper.style.cursor = 'crosshair';
    }
    // let x2 = transformMouseX(e.pageX);
    // let y2 = transformMouseY(e.pageY);
    ipos.qx = transformMouseX(e.pageX);
    ipos.qy = transformMouseY(e.pageY);

    let dx = ipos.qx - ipos.px;
    let dy = ipos.qy - ipos.py;

    if (dx * dx + dy * dy > 81 && mouseDown.value)
        clickDrag.value = true;

    if (clickDrag.value) {

        if (mouseInsideSelection.value) {
            // let w = x2 - selectionStore.x;
            // let h = y2 - selectionStore.y;
            selectionStore.update({
                x: ipos.ix + dx,
                y: ipos.iy + dy
                // w: w,
                // h: h
            });

        } else {
            // let w = x2 - selectionStore.x;
            // let h = y2 - selectionStore.y;
            selectionStore.update({
                // w: w,
                // h: h
                w: dx,
                h: dy
            });
        }
    }
};

const mouseupHandler = function (e: MouseEvent) {
    clickDrag.value = false;
    mouseDown.value = false;
    mouseInsideSelection.value = false;
    drawing.value = false;
    draggingSelection.value = false;
};

</script>

<template>
    <div class="main-view bg-gray-50 dark:bg-zinc-800 dark:text-zinc-50" ref="mainView">
        <div class="main-wrapper h-full w-full">
            <div class="sidebar border-r flex flex-col items-center py-6 space-y-6 bg-white dark:bg-zinc-800 dark:border-zinc-700"
                :style="{ 'minWidth': sidebarWidth + 'px' }">
                <div class="sidebar-container flex flex-col items-start space-y-6">
                    <ToolbarItem title="Preview">
                        <CropPreview :sourceImage="imageObject" :sourceImageWidth="imageDims.width"
                            :sourceImageHeight="imageDims.height" :scaleFactor="canvasScaleFactor"></CropPreview>
                    </ToolbarItem>
                    <ToolbarItem>
                        <div class="coords-wrapper">
                            <InputText label="Left" v-model="selectionStore.x"></InputText>
                            <InputText label="Top" v-model="selectionStore.y"></InputText>
                            <InputText label="Width" v-model="selectionStore.w"></InputText>
                            <InputText label="Height" v-model="selectionStore.h"></InputText>
                        </div>
                    </ToolbarItem>

                    <Button label="Crop"></Button>
                </div>
            </div>
            <div class="content-wrapper" @drop.prevent="dropHandler" @dragover="dragHandler" @dragleave="dragendHandler"
                @mousedown="mousedownHandler" @mousemove="mousemoveHandler" @mouseup="mouseupHandler">
                <Rulers :canvasGroupBb="canvasGroupBb" :imageDims="imageDims" :scaleFactor="canvasScaleFactor">
                    <div class="canvas-section-wrapper">
                        <CanvasGroup ref="canvasGroup" v-if="dataLoaded" @canvasMounted="onCanvasMounted"
                            @resize="onCanvasResize" :sourceImage="imageObject" :sourceImageWidth="imageDims.width"
                            :sourceImageHeight="imageDims.height" :dragging="clickDrag" :fileLoaded="fileLoaded"
                            :dataLoaded="dataLoaded"></CanvasGroup>
                        <div v-else class="canvas-placeholder">
                            <div class="crop-placeholder"></div>
                            <h2 class="text-gray-500 tracking-tight" :class="{ 'dragging': dragging }">Drag an image
                            </h2>
                            <span class="upload-icon" :class="{ 'upload-icon-dragging': dragging }">
                                <FontAwesomeIcon class="text-gray-500" icon="fa-solid fa-upload" size="6x">
                                </FontAwesomeIcon>
                            </span>
                        </div>
                    </div>
                </Rulers>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/variables.scss';

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

.main-wrapper {
    display: flex;
}

.sidebar {
    // min-width: $sidebar-width; 
    height: 100%;
    background-color: #fff;
    z-index: 999;
}

.content-wrapper {
    width: 100%;
    height: 100%;
    // padding: 40px 0;
    position: relative;
}

.canvas-section-wrapper {
    width: 100%;
    height: 100%;
    // padding: 2rem;
    padding: 50px;
}

.coords-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

h2 {
    font-size: 48pt;
    margin-bottom: 4rem;
    pointer-events: none;
}

.dragging {
    animation: dragging 1s infinite alternate ease-in-out;
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

div.crop-placeholder {
    background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='19' ry='19' stroke='%23D4D4D4FF' stroke-width='6' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
    border-radius: 19px;
    width: 800px;
    height: 500px;
    position: absolute;
}

@keyframes dragging {
    from {
        opacity: 1;
        transform: 0;
    }

    to {
        opacity: 0.5;
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

<style lang="scss">
.coords-wrapper input {
    max-width: 100px;
}
</style>