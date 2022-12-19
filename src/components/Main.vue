<script setup lang="ts">
import { loadFile } from '../file-handler';
import { provide, reactive, ref, type Ref } from "vue";
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
import SidebarSection from './SidebarSection.vue';
import ImageLibraryList from './ImageLibraryList.vue';
import Dropdown from './Dropdown.vue';
import SelectButton from './SelectButton.vue';
import { SelectMode } from '@/types/SelectModeOptions';
import SelectionTooltip from './SelectionTooltip.vue';

const draggingFile = ref(false);

const drawingSelection = ref(false);
const draggingSelection = ref(false);
const mouseInsideSelection = ref(false);

const imageDataLoaded = ref(false);
const imageFileLoaded = ref(false);

const canvasMounted = ref(false);
const canvasScaleFactor = ref(1.0);
provide('scale-factor', canvasScaleFactor);

const selectionStore: Quad = useSelectionStore();

const selectMode: Ref<SelectMode> = ref(SelectMode.FREE);
const selectModeOptions = ref([
    {
        name: "Unconstrained",
        // icon: "fa-solid fa-lock-open",
        code: SelectMode.FREE
    },
    {
        name: "Fixed Ratio",
        // icon: "fa-solid fa-lock",
        code: SelectMode.FIXED_RATIO
    },
    {
        name: "Fixed Size",
        code: SelectMode.FIXED_SIZE
    },
]);

const resizing: Ref<string | null> = ref(null);
const setResizing = (val: string) => resizing.value = val;

const fixedRatioWidth = ref(1);
const fixedRatioHeight = ref(1);

const fixedSizeWidth = ref(300);
const fixedSizeHeight = ref(200);

const showGridlines = ref(true);

const canvasGroup: Ref<HTMLDivElement | null> = ref(null);
const canvasGroupBb = ref(null);

const imageObject: Ref<HTMLImageElement | null> = ref(null);
const imageDims = reactive({
    width: 0,
    height: 0
});

const mouseDoingDragGesture = ref(false);
const mouseDown = ref(false);

const cropFlashEffect = ref(false);

const images: Ref<Promise<string>[]> = ref([]);

/**
 * Transformation from screen space to image space
 * @param x Number being transformed
 */
const screenToImg = function (x: number): number {
    return Math.floor(x / canvasScaleFactor.value);
};

/**
 * Transformation from image space to screen space
 * @param x Number being transformed
 */
const imgToScreen = function (x: number): number {
    return Math.floor(x * canvasScaleFactor.value);
};

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

        if (selectMode.value === SelectMode.FIXED_SIZE) {
            let newX = auxMouse.mousemoveX;
            let newY = auxMouse.mousemoveY;

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
            selectionStore.w = imgToScreen(fixedSizeWidth.value);
            selectionStore.h = imgToScreen(fixedSizeHeight.value);
        }
    }

    mouseDoingDragGesture.value = false;
    mouseDown.value = true;
};

const snapRange = 15;
const cornerResizeRadius = 10;
const mousemoveHandler = function (e: MouseEvent) {
    let x = selectionStore.x;
    let y = selectionStore.y;
    let w = selectionStore.w;
    let h = selectionStore.h;

    auxMouse.mousemoveX = transformMouseX(e.pageX);
    auxMouse.mousemoveY = transformMouseY(e.pageY);

    let corners = {
        'tl': { x: x, y: y },
        'tr': { x: x + w, y: y },
        'br': { x: x + w, y: y + h },
        'bl': { x: x, y: y + h }
    };
    let hoveringCorner = '';
    for (const [key, corner] of (<any>Object).entries(corners)) {
        let isMouseOverCorner = posInQuad(auxMouse.mousemoveX, auxMouse.mousemoveY,
            corner.x - cornerResizeRadius,
            corner.y - cornerResizeRadius,
            cornerResizeRadius * 2, cornerResizeRadius * 2);
        if (isMouseOverCorner) {
            hoveringCorner = key;
            break;
        }
    }

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


    let dx = auxMouse.mousemoveX - auxMouse.initialMousedownX;
    let dy = auxMouse.mousemoveY - auxMouse.initialMousedownY;

    // If mouse moved past threshold, consider motion as click-and-drag
    if (dx * dx + dy * dy > 81 && mouseDown.value)
        mouseDoingDragGesture.value = true;

    if (mouseDown.value) {
        if (mouseDoingDragGesture.value) {

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


            } else {    // Drawing new rectangle
                if (selectMode.value === SelectMode.FREE) {

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
                } else if (selectMode.value === SelectMode.FIXED_RATIO) {
                    // Aspect ratio of selection ratio
                    let wRatio = fixedRatioWidth.value / fixedRatioHeight.value;

                    let flipX = dx < 0,
                        flipY = dy < 0;

                    if (flipX) dx = -dx;
                    if (flipY) dy = -dy;

                    // Constrain smaller selection dimension to aspect ratio multiple of greater dimension
                    if (dy * wRatio <= dx)
                        dx = Math.floor(dy * wRatio);
                    else if (dx / wRatio <= dy)
                        dy = Math.floor(dx / wRatio);

                    // Adjust if selection drawn backwards
                    if (flipX) {
                        x = auxMouse.initialMousedownX - dx
                    }
                    if (flipY) {
                        y = auxMouse.initialMousedownY - dy;
                    }

                    selectionStore.x = x;
                    selectionStore.y = y;
                    selectionStore.w = dx;
                    selectionStore.h = dy;
                } else if (selectMode.value === SelectMode.FIXED_SIZE) {
                    let newX = auxMouse.mousemoveX;
                    let newY = auxMouse.mousemoveY;

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
                    selectionStore.w = imgToScreen(fixedSizeWidth.value);
                    selectionStore.h = imgToScreen(fixedSizeHeight.value);
                }

            }
        }
    }   // End "is-mouse-down"

    else {
    }
};

const mouseupHandler = function (e: MouseEvent) {
    if (!mouseDoingDragGesture.value && selectMode.value !== SelectMode.FIXED_SIZE) {
        selectionStore.x = 0;
        selectionStore.y = 0;
        selectionStore.w = 0;
        selectionStore.h = 0;
    }

    mouseDoingDragGesture.value = false;
    mouseDown.value = false;
    mouseInsideSelection.value = false;
    drawingSelection.value = false;
    draggingSelection.value = false;
};

const doCropFlashEffect = function () {
    cropFlashEffect.value = true;
    setTimeout(() => {
        cropFlashEffect.value = false;
    }, 1000);
};

const crop = function () {
    doCropFlashEffect();
    const croppedImagePromise = new Promise<string>(resolve => {
        cropImage(imageObject.value?.src, {
            // x: Math.floor(selectionStore.x / canvasScaleFactor.value),
            // y: Math.floor(selectionStore.y / canvasScaleFactor.value),
            // w: Math.floor(selectionStore.w / canvasScaleFactor.value),
            // h: Math.floor(selectionStore.h / canvasScaleFactor.value)
            x: screenToImg(selectionStore.x),
            y: screenToImg(selectionStore.y),
            w: screenToImg(selectionStore.w),
            h: screenToImg(selectionStore.h)
        }).then(im => resolve(im));
    });
    images.value.push(croppedImagePromise);
};

const createCoordChangeHandler = function (attr: string): Function {
    console.log(attr);
    return (value: number) => selectionStore[attr] = imgToScreen(value);
};

</script>

<template>
    <div class="main-view bg-gray-50 dark:bg-zinc-800 dark:text-zinc-50">
        <div class="main-wrapper h-full w-full">
            <div class="sidebar hidden lg:block sidebar-left border-r flex flex-col items-start space-y-6 bg-white dark:bg-zinc-800 dark:border-zinc-700"
                :style="{ 'minWidth': sidebarWidth + 'px' }">
                <div class="sidebar-container flex flex-col items-start">
                    <SidebarSection class="border-b">
                        <ToolbarItem title="Preview">
                            <CropPreview :sourceImage="imageObject" :sourceImageWidth="imageDims.width"
                                :sourceImageHeight="imageDims.height" :scaleFactor="canvasScaleFactor"></CropPreview>
                        </ToolbarItem>
                    </SidebarSection>
                    <SidebarSection>
                        <ToolbarItem>
                            <div class="coords-wrapper w-full grid grid-cols-2 gap-2">
                                <InputText label="Left" v-model.number="selectionStore.x"
                                    :transform="(val) => screenToImg(val)"></InputText>
                                <InputText label="Top" v-model.number="selectionStore.y"
                                    :transform="(val) => screenToImg(val)"></InputText>
                                <InputText label="Width" v-model.number="selectionStore.w"
                                    :transform="(val) => screenToImg(val)"></InputText>
                                <InputText label="Height" v-model.number="selectionStore.h"
                                    :transform="(val) => screenToImg(val)"></InputText>
                            </div>
                        </ToolbarItem>
                        <ToolbarItem title="Selection Mode">
                            <SelectButton v-model="selectMode" :items="selectModeOptions"></SelectButton>
                        </ToolbarItem>
                        <ToolbarItem v-if="selectMode === SelectMode.FIXED_RATIO" title="Ratio">
                            <div class="fixed-ratio-wrapper flex w-full items-center space-x-2">
                                <InputText v-model.number="fixedRatioWidth"></InputText>
                                <span>
                                    :
                                </span>
                                <InputText v-model.number="fixedRatioHeight"></InputText>
                            </div>
                        </ToolbarItem>
                        <ToolbarItem v-if="selectMode === SelectMode.FIXED_SIZE" title="Size">
                            <div class="fixed-size-wrapper flex w-full items-center space-x-2">
                                <InputText v-model.number="fixedSizeWidth"></InputText>
                                <span>
                                    ×
                                </span>
                                <InputText v-model.number="fixedSizeHeight"></InputText>
                            </div>
                        </ToolbarItem>
                    </SidebarSection>
                </div>
            </div>
            <div class="content-wrapper" @drop.prevent="dropHandler" @dragover="dragHandler" @dragleave="dragendHandler"
                @mousedown="mousedownHandler" @mousemove="mousemoveHandler" @mouseup="mouseupHandler">
                <Rulers :canvasGroupBb="canvasGroupBb" :imageDims="imageDims" :scaleFactor="canvasScaleFactor">
                    <div class="canvas-section-wrapper dark:bg-zinc-900 lg:p-6">
                        <CanvasGroup ref="canvasGroup" v-if="imageDataLoaded" @canvasMounted="onCanvasMounted"
                            @resize="onCanvasResize" :sourceImage="imageObject" :sourceImageWidth="imageDims.width"
                            :sourceImageHeight="imageDims.height" :dragging="mouseDoingDragGesture"
                            :fileLoaded="imageFileLoaded" :dataLoaded="imageDataLoaded" :showGridlines="showGridlines"
                            :setResizing="setResizing">
                            <SelectionTooltip></SelectionTooltip>
                            <div :class="{ 'flashing': cropFlashEffect }"
                                class="crop-flash-overlay w-full h-full pointer-events-none absolute">
                            </div>
                        </CanvasGroup>
                        <FileChooser v-else :onFileSelect="fileUploadHandler">
                            <template v-slot="{ doClick }">
                                <div class="canvas-placeholder hover:cursor-pointer hover:text-zinc-300"
                                    @click="doClick">
                                    <div class="crop-placeholder"></div>
                                    <h2 class="text-zinc-400 tracking-tight" :class="{ 'dragging': draggingFile }">Drag
                                        an
                                        image
                                    </h2>
                                    <span class="upload-icon" v-if="draggingFile"
                                        :class="{ 'upload-icon-dragging': draggingFile }">
                                        <FontAwesomeIcon class="text-gray-500" icon="fa-solid fa-upload" size="6x">
                                        </FontAwesomeIcon>
                                    </span>
                                    <h2 class="text-zinc-400 tracking-tight" v-else @click="doClick"
                                        :class="{ 'dragging': draggingFile }">
                                        or click to select file
                                    </h2>
                                </div>
                            </template>
                        </FileChooser>
                    </div>
                </Rulers>
            </div>
            <div class="sidebar hidden lg:block sidebar-right border-l flex flex-col items-center space-y-6 bg-white dark:bg-zinc-800 dark:border-zinc-700"
                :style="{ 'minWidth': sidebarWidth + 'px' }">
                <div class="sidebar-container flex flex-col items-start w-full">
                    <!-- <ToolbarItem title="Preview">
                        <CropPreview :sourceImage="imageObject" :sourceImageWidth="imageDims.width"
                            :sourceImageHeight="imageDims.height" :scaleFactor="canvasScaleFactor"></CropPreview>
                    </ToolbarItem> -->
                    <SidebarSection class="border-b">
                        <Button class="w-full" label="Crop" @click="crop"></Button>
                    </SidebarSection>
                    <SidebarSection title="Library">
                        <ImageLibraryList :images="images"></ImageLibraryList>
                        <!-- <ImageEntry v-for="image in images" :image="image" /> -->
                    </SidebarSection>
                </div>
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

.sidebar .sidebar-section {
    @apply p-6;
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
    // padding: 50px;
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

div.crop-flash-overlay {
    background-color: rgba(255, 255, 255, 0.35);
    opacity: 0;
    z-index: 999;
    // transition: opacity 0.5s ease-out;
}

div.crop-flash-overlay.flashing {
    animation: flash 0.5s normal cubic-bezier(0.73, 0.26, 0.33, 0.76) // opacity: 1;
}

div.crop-placeholder {
    background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='19' ry='19' stroke='%23d1d5db' stroke-width='6' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
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

@keyframes flash {
    from {
        opacity: 1;
    }

    to {
        opacity: 0;
    }
}
</style>

<style lang="scss">
.coords-wrapper input {
    max-width: 100px;
}

.coords-wrapper input,
.fixed-ratio-wrapper input,
.fixed-size-wrapper input {
    max-width: 100px;
}


</style>