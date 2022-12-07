<script setup lang="ts">
import type MousePositionData from '@/types/MousePositionData';
import { rulerSize, sidebarWidth, appBarHeight } from '@/variables';
import { createTextVNode, onMounted, onUpdated, reactive, ref, watch } from 'vue';

const props = defineProps<{
    canvasGroupBb: DOMRect,
    imageDims: object,
    scaleFactor: number,
    mousePositionData: MousePositionData
}>();

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

onMounted(() => {
    initDims();
});

watch(mousePos, () => {

        clearRulerH();
        clearRulerV();
        // drawCropHighlightH();
        // drawCropHighlightV();
        drawMouseIndicator();
        drawRulerV();
        drawRulerH();
});

watch(() => props.canvasGroupBb, () => {
    if (props.canvasGroupBb !== null) {
        initDims();
        clearRulerH();
        drawRulerH();
        clearRulerV();
        drawRulerV();
        // drawMouseIndicator();
    }
});

const mod = function (n: number, m: number) {
    return ((n % m) + m) % m;
}

const drawMouseIndicator = function() {
    const ctxV = rulerVCanv.value.getContext('2d');
    const ctxH = rulerHCanv.value.getContext('2d');

    let color = "#3B82F6";
    let bgColor = "#BFDBFE";


    let x = mousePos.x - sidebarWidth - rulerSize;
    let y = mousePos.y - appBarHeight - rulerSize;

    ctxV.beginPath();
    ctxV.moveTo(0,y);
    ctxV.lineTo(rulerSize, y);
    
    ctxH.beginPath();
    ctxH.moveTo(x, 0);
    ctxH.lineTo(x, rulerSize);

    // ctxV.strokeStyle = bgColor;
    // ctxV.lineWidth = 4;
    // ctxH.strokeStyle = bgColor;
    // ctxH.lineWidth = 4;
    // ctxV.stroke();
    // ctxH.stroke();

    ctxV.strokeStyle = color;
    ctxV.lineWidth = 1;
    ctxH.strokeStyle = color;
    ctxH.lineWidth = 1;
    ctxV.stroke();
    ctxH.stroke();
};

const drawCropHighlightH = function() {
    const ctx = rulerHCanv.value.getContext('2d');
    const grad = ctx.createLinearGradient(0,0,0,rulerSize);
    grad.addColorStop(1,"#E0F2FE");
    // grad.addColorStop(0.6,"#E0F2FE");
    grad.addColorStop(0, "#BFDBFE");
    // ctx.fillStyle = "#E0F2FE";
    ctx.fillStyle = grad;
    ctx.fillRect(
        props.mousePositionData.px - props.canvasGroupBb.left + sidebarWidth - rulerSize/2, 0, props.mousePositionData.qx - props.mousePositionData.px, rulerSize);
};

const drawCropHighlightV = function() {
    const ctx = rulerVCanv.value.getContext('2d');
    const grad = ctx.createLinearGradient(0,0,rulerSize,0);
    grad.addColorStop(1,"#E0F2FE");
    // grad.addColorStop(0.6,"#E0F2FE");
    grad.addColorStop(0, "#BFDBFE");
    // ctx.fillStyle = "#E0F2FE";
    ctx.fillStyle = grad;
    ctx.fillRect(0, props.mousePositionData.py - props.canvasGroupBb.top + appBarHeight, rulerSize, props.mousePositionData.qy - props.mousePositionData.py);
};

const clearRulerH = function() {
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

    ctx.fillStyle = "#000";
    
    ctx.beginPath();

    let c = 4;
    for (let [idx, tick] of ticks.entries()) {
        let text = `${tick}`;
        let i = tick * props.scaleFactor + start
        let d = Math.abs(tick - ticks[ticks.length - 1])
        ctx.moveTo(i, 0);
        if (c >= 4 || idx == ticks.length - 1) {
            // if (d*props.scaleFactor < 10) continue;
            ctx.lineTo(i, height / 4);
            const textMeasure = ctx.measureText(text);
            if (d * props.scaleFactor < 20 && idx < ticks.length - 1) continue;
            ctx.fillText(text, i - textMeasure.width / 2, height);
            c = 0;
        } else {
            if (d*props.scaleFactor < 10) continue;
            ctx.lineTo(i, height / 6);
            c++;
        }
    }

    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000';
    ctx.stroke();
};

const clearRulerV = function() {
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
    ctx.translate(0.5, 0.5);

    ctx.rotate(3 * Math.PI / 2);

    ctx.textBaseline = "bottom";
    ctx.font = "Inter 9px";
    ctx.fillText("Test", 0, 0);

    const start = -50;
    const end = rulerSize - props.canvasGroupBb.height - props.canvasGroupBb.top + 50;// - sidebarWidth - rulerSize;

    ctx.fillStyle = '#000';
    ctx.beginPath();

    let c = 4;
    for (let [idx, tick] of ticks.entries()) {
        let text = tick;
        let i = -tick * props.scaleFactor + start
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
    ctx.strokeStyle = '#000';
    ctx.stroke();

    // ctx.beginPath();
    // ctx.moveTo(-500,0);
    // ctx.lineTo(-400,width);
    // ctx.lineTo(-10, 0);
    // ctx.strokeStyle = 'red';
    // ctx.stroke();

    ctx.restore();
};

let lastEvent = Date.now();
let debounceTime = 20;
const onMousemove = function(e: MouseEvent) {
    let timeNow = Date.now();
    if (timeNow-lastEvent < debounceTime) return;
    if (props.canvasGroupBb === null) return;
    mousePos.x = e.pageX;
    mousePos.y = e.pageY;
    lastEvent = timeNow;
};
</script>

<template>
    <div class="ruler-container" @mousemove="onMousemove">
        <div class="ruler-top" :style="{ 'height': rulerSize + 'px' }">
            <div class="ruler-corner border-b border-r border-gray-400"
                :style="{ 'min-height': rulerSize + 'px', 'min-width': rulerSize + 'px' }">
            </div>
            <div class="ruler-h border-b border-gray-400" ref="rulerH">
                <canvas id="ruler-h-canv" ref="rulerHCanv"></canvas>
            </div>
        </div>
        <div class="ruler-main">
            <div class="ruler-v border-r border-gray-400" ref="rulerV" :style="{ 'width': rulerSize + 'px' }">
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