<script setup lang="ts">
import { loadFile } from '../file-handler';
import { reactive, ref, type Ref } from "vue";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import CanvasGroup from "./Canvas/CanvasGroup.vue";
import ToolbarItem from "./ToolbarItem.vue";
import CropPreview from "./CropPreview.vue";
import { sidebarWidth } from '@/variables';
import InputText from "./InputText.vue";
import Button from "./Button.vue";
import Rulers from "./Rulers.vue";
import { useSelectionStore } from "@/stores/selection";
import type Quad from '@/types/Quad';
import FileChooser from './FileChooser.vue';
import { cropImage } from '@/api-handler';
import ImageEntry from './ImageEntry.vue';

const draggingFile = ref(false);

const drawingSelection = ref(false);
const draggingSelection = ref(false);
const mouseInsideSelection = ref(false);

const imageDataLoaded = ref(false);
const imageFileLoaded = ref(false);

const canvasMounted = ref(false);
const canvasScaleFactor = ref(1.0);

const selectionStore: Quad = useSelectionStore();

const mainView = ref(null);

const canvasGroup: Ref<HTMLDivElement | null> = ref(null);
const canvasGroupBb = ref(null);

const imageObject: Ref<HTMLImageElement | null> = ref(null);
const imageDims = reactive({
    width: 0,
    height: 0
});

const clickDrag = ref(false);
const mouseDown = ref(false);

const images = ref([]);

/**
 * Subtracts canvas element horizontal offset from mouse position
 */
const transformMouseX = function (x: number) {
    if (imageDataLoaded.value && canvasMounted.value) {
        let canvasBb = canvasGroup.value.wrapper.getBoundingClientRect();

        return Math.floor(Math.min(Math.max(canvasBb.left, x), canvasBb.left + canvasBb.width) - canvasBb.left);
    }
    else return x;
};

/**
 * Subtracts canvas element vertical offset from mouse position
 */
const transformMouseY = function (y: number) {
    if (imageDataLoaded.value && canvasMounted.value) {
        let canvasBb = canvasGroup.value.wrapper.getBoundingClientRect();
        return Math.floor(Math.min(Math.max(canvasBb.top, y), canvasBb.top + canvasBb.height) - canvasBb.top);
    }
    else return y;
};

/**
 * Checks if a point is contained in a rectangle
 * 
 * @param p x-coordinate of point being checked
 * @param q y-coordinate of point being checked
 * @param x x-coordinate (left) of quad
 * @param y y-coordinate (top) of quad
 * @param w quad width
 * @param h quad height
 */
const posInQuad = function (p: number, q: number, x: number, y: number, w: number, h: number) {
    return (p > x && p <= x + w &&
        q > y && q <= y + h);
};

/**
 * Loads a dataURL into an Image object
 * Resets selection and sets imageDims and imageObject refs
 * 
 * @param dataUrl base64 encoded image
 */
const loadImageObject = function (dataUrl: string): void {
    let im = new Image();
    im.src = dataUrl;
    im.decode().then(() => {
        imageDims.width = im.naturalWidth;
        imageDims.height = im.naturalHeight;
        imageObject.value = im;

        selectionStore.x = 0;
        selectionStore.y = 0;
        selectionStore.w = 0;
        selectionStore.h = 0;

        imageDataLoaded.value = true;
    });
};


const fileUploadHandler = function (e: Event) {
    let files = e.target.files;

    if (files[0]) {
        imageDataLoaded.value = false;
        canvasMounted.value = false;
        let item = files[0];

        let fr = new FileReader();
        console.log(item);



        loadFile(item).then(url => {
            loadImageObject(url);
        }).catch(err => console.error(err));
    }
};

const dropHandler = function (e: DragEvent) {
    e.preventDefault();
    draggingFile.value = false;

    if (e.dataTransfer.items) {
        imageDataLoaded.value = false;
        canvasMounted.value = false;
        let item = e.dataTransfer.items[0].getAsFile();

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
    draggingFile.value = true;
};

const dragendHandler = function (e: Event) {
    e.preventDefault();
    draggingFile.value = false;
};

const auxMouse = reactive({
    initialMousedownX: 0,
    initialMousedownY: 0,
    initialSelectionX: 0,
    initialSelectionY: 0,
    mousemoveX: 0,
    mousemoveY: 0
});
const mousedownHandler = function (e: MouseEvent) {
    auxMouse.initialMousedownX = transformMouseX(e.pageX);
    auxMouse.initialMousedownY = transformMouseY(e.pageY);

    let x = selectionStore.x;
    let y = selectionStore.y;
    let w = selectionStore.w;
    let h = selectionStore.h;

    // Track selection position at start of mousedown event
    auxMouse.initialSelectionX = x;
    auxMouse.initialSelectionY = y;

    // Check mouse cursor inside previously drawn selection
    if (posInQuad(auxMouse.initialMousedownX, auxMouse.initialMousedownY, x, y, w, h))
        mouseInsideSelection.value = true;

    if (mouseInsideSelection.value) {
        draggingSelection.value = true;
    } else {
        drawingSelection.value = true;

        selectionStore.x = auxMouse.initialMousedownX;
        selectionStore.y = auxMouse.initialMousedownY;
        selectionStore.w = 0;
        selectionStore.h = 0;
    }

    clickDrag.value = false;
    mouseDown.value = true;
};

const snapRange = 1;
const mousemoveHandler = function (e: MouseEvent) {
    let x = selectionStore.x;
    let y = selectionStore.y;
    let w = selectionStore.w;
    let h = selectionStore.h;

    if (canvasGroup.value !== null) {
        if (drawingSelection.value)
            canvasGroup.value.wrapper.style.cursor = 'none';
        else if (draggingSelection.value)
            canvasGroup.value.wrapper.style.cursor = 'none';
        else if (posInQuad(auxMouse.mousemoveX, auxMouse.mousemoveY, x, y, w, h))
            canvasGroup.value.wrapper.style.cursor = 'grab';
        else
            canvasGroup.value.wrapper.style.cursor = 'crosshair';
    }

    auxMouse.mousemoveX = transformMouseX(e.pageX);
    auxMouse.mousemoveY = transformMouseY(e.pageY);

    let dx = auxMouse.mousemoveX - auxMouse.initialMousedownX;
    let dy = auxMouse.mousemoveY - auxMouse.initialMousedownY;

    // If mouse moved past threshold, consider motion as click-and-drag
    if (dx * dx + dy * dy > 81 && mouseDown.value)
        clickDrag.value = true;

    if (clickDrag.value) {

        // Moving existing rectangle
        if (mouseInsideSelection.value) {
            let newX = auxMouse.initialSelectionX + dx;
            let newY = auxMouse.initialSelectionY + dy;

            //Snap to edge
            if (newX < snapRange)
                newX = 0;
            if (newY < snapRange)
                newY = 0;
            if (canvasGroupBb.value.width - (newX + w) < snapRange)
                newX = canvasGroupBb.value.width - w;
            if (canvasGroupBb.value.height - (newY + h) < snapRange)
                newY = canvasGroupBb.value.height - h;

            selectionStore.x = newX;
            selectionStore.y = newY;

            // Drawing new rectangle
        } else {

            // Adjust if selection drawn backwards
            if (dx < 0) {
                dx = -dx;
                x = auxMouse.initialMousedownX - dx
            }
            if (dy < 0) {
                dy = -dy;
                y = auxMouse.initialMousedownY - dy
            };

            selectionStore.x = x;
            selectionStore.y = y;
            selectionStore.w = dx;
            selectionStore.h = dy;
        }
    }
};

const mouseupHandler = function (e: MouseEvent) {
    clickDrag.value = false;
    mouseDown.value = false;
    mouseInsideSelection.value = false;
    drawingSelection.value = false;
    draggingSelection.value = false;
};

const crop = function() {
    cropImage(imageObject.value?.src, {
        x: Math.floor(selectionStore.x/canvasScaleFactor.value),
        y: Math.floor(selectionStore.y/canvasScaleFactor.value),
        w: Math.floor(selectionStore.w/canvasScaleFactor.value),
        h: Math.floor(selectionStore.h/canvasScaleFactor.value)
    }).then(im => images.value.push(im));
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
                            <InputText label="Left" v-model.number="selectionStore.x"></InputText>
                            <InputText label="Top" v-model.number="selectionStore.y"></InputText>
                            <InputText label="Width" v-model.number="selectionStore.w"></InputText>
                            <InputText label="Height" v-model.number="selectionStore.h"></InputText>
                        </div>
                    </ToolbarItem>

                    <Button label="Crop" @click="crop"></Button>
                    
                    <ImageEntry v-for="image in images" :dataURL="image.src" />
                </div>
            </div>
            <div class="content-wrapper" @drop.prevent="dropHandler" @dragover="dragHandler" @dragleave="dragendHandler"
                @mousedown="mousedownHandler" @mousemove="mousemoveHandler" @mouseup="mouseupHandler">
                <Rulers :canvasGroupBb="canvasGroupBb" :imageDims="imageDims" :scaleFactor="canvasScaleFactor">
                    <div class="canvas-section-wrapper dark:bg-zinc-900">
                        <CanvasGroup ref="canvasGroup" v-if="imageDataLoaded" @canvasMounted="onCanvasMounted"
                            @resize="onCanvasResize" :sourceImage="imageObject" :sourceImageWidth="imageDims.width"
                            :sourceImageHeight="imageDims.height" :dragging="clickDrag" :fileLoaded="imageFileLoaded"
                            :dataLoaded="imageDataLoaded"></CanvasGroup>
                        <FileChooser v-else :onFileSelect="fileUploadHandler">
                            <template v-slot="{ doClick }">
                                <div class="canvas-placeholder hover:cursor-pointer hover:text-gray-400" @click="doClick">
                                    <div class="crop-placeholder"></div>
                                    <h2 class="text-gray-500 tracking-tight" :class="{ 'dragging': draggingFile }">Drag
                                        an
                                        image
                                    </h2>
                                    <span class="upload-icon" v-if="draggingFile" :class="{ 'upload-icon-dragging': draggingFile }">
                                        <FontAwesomeIcon class="text-gray-500" icon="fa-solid fa-upload" size="6x">
                                        </FontAwesomeIcon>
                                    </span>
                                    <h2 class="text-gray-500 tracking-tight" v-else @click="doClick"
                                        :class="{ 'dragging': draggingFile }">
                                        or click to select file
                                    </h2>
                                </div>
                            </template>
                        </FileChooser>
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
    // pointer-events: none;
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
    pointer-events: none;
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