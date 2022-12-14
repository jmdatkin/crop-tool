<script setup lang="ts">
import type MousePositionData from '@/types/MousePositionData';
import colors from 'tailwindcss/colors';
import { rulerSize, sidebarWidth, appBarHeight } from '@/variables';
import { createTextVNode, inject, onMounted, onUpdated, reactive, ref, watch } from 'vue';
import { useSelectionStore } from '@/stores/selection';
import useDraw from '@/hooks/useDraw';

const props = defineProps<{
    canvasGroupBb: DOMRect,
    imageDims: object,
    scaleFactor: number,
    mousePositionData: MousePositionData
}>();

const selectionStore = useSelectionStore();

const textColor = 'black';
const darkTextColor = colors.zinc[50];

const tickColor = 'black';
const darkTickColor = colors.zinc[50];

const { darkMode } = inject('dark-mode');


const mouseIndicatorColor = "#3B82F6";


const rulerH = ref(null);
const rulerHCanv = ref(null);

const rulerV = ref(null);
const rulerVCanv = ref(null);

const mousePos = reactive({
    x: 0,
    y: 0
});

const initDims = function () {
    let { width: widthH, height: heightH } = getComputedStyle(rulerH.value);
    let { width: widthV, height: heightV } = getComputedStyle(rulerV.value);

    rulerHCanv.value.width = parseInt(widthH, 10);
    rulerHCanv.value.height = parseInt(heightH, 10) - 1;
    rulerVCanv.value.width = parseInt(widthV, 10) - 1;
    rulerVCanv.value.height = parseInt(heightV, 10);
};


// watch([mousePos, darkMode], () => {

//         clearRulerH();
//         clearRulerV();
//         // drawCropHighlightH();
//         // drawCropHighlightV();
//         drawMouseIndicator();
//         drawRulerV();
//         drawRulerH();
// });

watch(() => props.canvasGroupBb, () => {
    if (props.canvasGroupBb !== null) {
        initDims();
        start();
    }
});

const mod = function (n: number, m: number) {
    return ((n % m) + m) % m;
}

const drawMouseIndicator = function () {
    const ctxV = rulerVCanv.value.getContext('2d');
    const ctxH = rulerHCanv.value.getContext('2d');

    let color = mouseIndicatorColor;

    let x = mousePos.x - sidebarWidth - rulerSize;
    let y = mousePos.y - appBarHeight - rulerSize;

    ctxV.beginPath();
    ctxV.moveTo(0, y);
    ctxV.lineTo(rulerSize, y);

    ctxH.beginPath();
    ctxH.moveTo(x, 0);
    ctxH.lineTo(x, rulerSize);

    ctxV.strokeStyle = color;
    ctxV.lineWidth = 2;
    ctxH.strokeStyle = color;
    ctxH.lineWidth = 2;
    ctxH.stroke();
    ctxV.stroke();
};

const drawCropHighlightH = function () {
    const ctx = rulerHCanv.value.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 0, rulerSize);
    grad.addColorStop(1, "#E0F2FE");
    // grad.addColorStop(0.6,"#E0F2FE");
    grad.addColorStop(0, "#BFDBFE");
    // ctx.fillStyle = "#E0F2FE";
    ctx.fillStyle = grad;
    ctx.fillRect(
        props.mousePositionData.px - props.canvasGroupBb.left + sidebarWidth - rulerSize / 2, 0, props.mousePositionData.qx - props.mousePositionData.px, rulerSize);
};

const drawCropHighlightV = function () {
    const ctx = rulerVCanv.value.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, rulerSize, 0);
    grad.addColorStop(1, "#E0F2FE");
    // grad.addColorStop(0.6,"#E0F2FE");
    grad.addColorStop(0, "#BFDBFE");
    // ctx.fillStyle = "#E0F2FE";
    ctx.fillStyle = grad;
    ctx.fillRect(0, props.mousePositionData.py - props.canvasGroupBb.top + appBarHeight, rulerSize, props.mousePositionData.qy - props.mousePositionData.py);
};

const clearRulerH = function () {
    const ctx = rulerHCanv.value.getContext('2d');
    const { width, height } = rulerHCanv.value;
    ctx.clearRect(0, 0, width, height);
};

const drawRulerH = function () {
    const ctx = rulerHCanv.value.getContext('2d');
    const { width, height } = rulerHCanv.value;

    // ctx.translate(0.5,0.5);

    const ticks = [];
    for (let i = 0; i < props.imageDims.width; i += 20)
        ticks.push(i);
    ticks.push(props.imageDims.width);

    const start = props.canvasGroupBb.left - sidebarWidth - rulerSize;
    const end = start + props.canvasGroupBb.width;


    ctx.beginPath();

    let c = 4;
    for (let [idx, tick] of ticks.entries()) {
        let text = `${tick}`;
        let i = Math.floor(tick * props.scaleFactor + start)-0.5;
        let d = Math.abs(tick - ticks[ticks.length - 1])
        ctx.moveTo(i, 0);
        if (c >= 4 || idx == ticks.length - 1) {
            // if (d*props.scaleFactor < 10) continue;
            ctx.lineTo(i, height / 4);
            const textMeasure = ctx.measureText(text);
            if (d * props.scaleFactor < 20 && idx < ticks.length - 1) continue;
            ctx.fillStyle = darkMode.value ? darkTextColor : textColor;
            ctx.fillText(text, i - textMeasure.width / 2, height);
            c = 0;
        } else {
            if (d * props.scaleFactor < 10) continue;
            ctx.lineTo(i, height / 6);
            c++;
        }
    }

    ctx.lineWidth = 1;
    ctx.strokeStyle = darkMode.value ? darkTickColor : tickColor;
    ctx.stroke();
};

const clearRulerV = function () {
    const ctx = rulerVCanv.value.getContext('2d');
    const { width, height } = rulerVCanv.value;
    ctx.clearRect(0, 0, width, height);
};


const drawRulerV = function () {
    const ctx = rulerVCanv.value.getContext('2d');
    let { width, height } = rulerVCanv.value;

    [width, height] = [height, width]

    const ticks = [];
    for (let i = 0; i < props.imageDims.height; i += 20)
        ticks.push(i);
    ticks.push(props.imageDims.height);

    ctx.save();

    ctx.rotate(3 * Math.PI / 2);

    ctx.textBaseline = "bottom";
    ctx.font = "Inter 9px";

    const start = -25;
    // const start = -25;
    const end = rulerSize - props.canvasGroupBb.height - props.canvasGroupBb.top + 50;// - sidebarWidth - rulerSize;

    ctx.fillStyle = darkMode.value ? darkTextColor : textColor;
    ctx.beginPath();

    let c = 4;
    for (let [idx, tick] of ticks.entries()) {
        let text = tick;
        let i = Math.floor(-tick * props.scaleFactor + start) - 0.5;
        let d = Math.abs(tick - ticks[ticks.length - 1])
        ctx.moveTo(i, 0);
        if (c >= 4 || idx == ticks.length - 1) {
            // if (d * props.scaleFactor < 10 && idx < ticks.length - 1) continue;
            ctx.lineTo(i, height / 4);
            const textMeasure = ctx.measureText(text);
            if (d * props.scaleFactor < 50 && idx < ticks.length - 1) continue;
            ctx.fillText(text, i - textMeasure.width / 2, height);
            c = 0;
        } else {
            if (d * props.scaleFactor < 10 && idx < ticks.length - 1) continue;
            ctx.lineTo(i, height / 6);
            c++;
        }
    }

    // const endText = `${Math.abs(Math.floor((end - start) / props.scaleFactor))}`;
    // const endTextMeasure = ctx.measureText(endText);
    // ctx.fillText(endText, end - endTextMeasure.width / 2, height);

    ctx.lineWidth = 1;
    ctx.strokeStyle = darkMode.value ? darkTickColor : tickColor;
    ctx.stroke();

    // ctx.beginPath();
    // ctx.moveTo(-500,0);
    // ctx.lineTo(-400,width);
    // ctx.lineTo(-10, 0);
    // ctx.strokeStyle = 'red';
    // ctx.stroke();

    ctx.restore();
};

const draw = function () {
    clearRulerH();
    clearRulerV();
    // drawCropHighlightH();
    drawMouseIndicator();
    drawRulerV();
    drawRulerH();
};

const { start, stop } = useDraw(draw);

onMounted(() => {
    initDims();
    const ctxV = rulerVCanv.value.getContext('2d');
    const ctxH = rulerHCanv.value.getContext('2d');
    ctxV.translate(0.5, 0.5);
    ctxH.translate(0.5, 0.5);

    // start();
});

const onMousemove = function (e: MouseEvent) {
    if (props.canvasGroupBb === null) return;
    mousePos.x = e.pageX;
    mousePos.y = e.pageY;
};
</script>

<template>
    <div class="ruler-container" @mousemove="onMousemove">
        <div class="ruler-top" :style="{ 'height': rulerSize + 'px' }">
            <div class="ruler-corner border-b border-r border-gray-400 dark:border-zinc-700"
                :style="{ 'min-height': rulerSize + 'px', 'min-width': rulerSize + 'px' }">
            </div>
            <div class="ruler-h border-b border-gray-400 dark:border-zinc-700" ref="rulerH">
                <canvas id="ruler-h-canv" ref="rulerHCanv"></canvas>
            </div>
        </div>
        <div class="ruler-main">
            <div class="ruler-v border-r border-gray-400 dark:border-zinc-700" ref="rulerV"
                :style="{ 'width': rulerSize + 'px' }">
                <canvas id="ruler-v-canv" ref="rulerVCanv"></canvas>
            </div>
            <div class="ruler-main-content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
div.ruler-container {
    width: 100%;
    height: 100%;
    display: flex;
    position: absolute;
    flex-direction: column;
}

div.ruler-top {
    display: flex;
}

div.ruler-h {
    flex-grow: 1;
}

div.ruler-main {
    display: flex;
    flex-grow: 1;
}

div.ruler-main-content {
    flex-grow: 1;
}
</style>