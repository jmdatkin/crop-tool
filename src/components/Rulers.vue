<script setup lang="ts">
import { rulerSize, sidebarWidth, appBarHeight } from '@/variables';
import { createTextVNode, onMounted, onUpdated, ref, watch } from 'vue';

const props = defineProps<{
    imageBb: DOMRect,
    scaleFactor: number
}>();

const rulerH = ref(null);
const rulerHCanv = ref(null);

const rulerV = ref(null);
const rulerVCanv = ref(null);

const initDims = function() {
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

watch(() => props.imageBb, () => {
    if (props.imageBb !== null) {
        initDims();
        drawRulerH();
        drawRulerV();
    }
});

const mod = function(n: number, m: number) {
  return ((n % m) + m) % m;
}

const drawRulerH = function () {
    const ctx = rulerHCanv.value.getContext('2d');
    const { width, height } = rulerHCanv.value;


    ctx.fillStyle = '#fff';
    ctx.clearRect(0, 0, width, height);

    const start = props.imageBb.left - sidebarWidth - rulerSize;
    const end = start + props.imageBb.width;

    ctx.fillStyle = '#000';
    ctx.beginPath();

    let c = 4;
    for (let i = start; i <= end; i += 20*props.scaleFactor) {
        let text = `${Math.floor((i-start)/props.scaleFactor)}`;
        ctx.moveTo(i, 0);
        if (c >= 4) {
            ctx.lineTo(i, height / 4);
            const textMeasure = ctx.measureText(text);
            ctx.fillText(text, i - textMeasure.width / 2, height);
            c = 0;
        } else {
            ctx.lineTo(i, height / 6);
            c++;
        }
    }
    const endText = `${Math.floor((end-start)/props.scaleFactor)}`;
    const endTextMeasure = ctx.measureText(endText);
    ctx.fillText(endText, end - endTextMeasure.width / 2, height);



    ctx.strokeWidth = 0.5;
    ctx.strokeStyle = '#000';
    ctx.stroke();

};

const drawRulerV = function () {
    const ctx = rulerVCanv.value.getContext('2d');
    let { width, height } = rulerVCanv.value;

    [width,height] = [height,width]

    ctx.save();
    ctx.translate(0.5, 0.5);

    ctx.rotate(3*Math.PI / 2);

    ctx.textBaseline = "bottom";
    ctx.font = "Inter 9px";
    ctx.fillText("Test", 0,0);

    ctx.fillStyle = '#fff';
    ctx.clearRect(0, 0, -width, height);

    // const start = rulerSize - props.imageBb.height - props.imageBb.top + 50;// - sidebarWidth - rulerSize;
    // const end = -50;
    const start = -50;
    const end = rulerSize - props.imageBb.height - props.imageBb.top + 50;// - sidebarWidth - rulerSize;

    ctx.fillStyle = '#000';
    ctx.beginPath();

    let c = 4;
    for (let i = start; i >= end; i -= 20*props.scaleFactor) {
        let text = `${Math.floor(Math.abs((i-start)/props.scaleFactor))}`;
        ctx.moveTo(i, 0);
        console.log(mod(i-start,100))
        if (c >= 4) {
            ctx.lineTo(i, height / 4);
            const textMeasure = ctx.measureText(text);
            ctx.fillText(text, i - textMeasure.width / 2, height);
            c = 0;
        } else {
            ctx.lineTo(i, height / 6);
            c++;
        }
    }

    const endText = `${Math.abs(Math.floor((end-start)/props.scaleFactor))}`;
    const endTextMeasure = ctx.measureText(endText);
    ctx.fillText(endText, end - endTextMeasure.width / 2, height);

    ctx.strokeWidth = 0.5;
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

</script>

<template>
    <div class="ruler-container">
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