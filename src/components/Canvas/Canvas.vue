<template>
    <div ref="wrapper" class="canvas-wrapper">
        <canvas id="main-canv" ref="mainCanv"></canvas>
        <canvas id="markup-canv" ref="markupCanv"></canvas>
    </div>
</template>

<script setup lang="ts">import EventBus from '@/events';
import { nextTick, onMounted, onUpdated, reactive, ref, watch } from 'vue';


const props = defineProps<{
    width: number,
    height: number,
    drawImage: Function
    drawSelectionRect: Function

    selX: number,
    selY: number,
    selW: number,
    selH: number
}>();

const dragging = ref(false);

const marqueeOffset = ref(0);

const dataLoaded = ref(false);
const markupCanv = ref(null);


const mainCanv = ref(null);
const wrapper = ref(null);

let bb;

const drawImage = function () {
    props.drawImage(mainCanv.value);
};

const drawSelectionRect = function () {
    let ctx = markupCanv.value.getContext('2d');

    ctx.setLineDash([5, 7]);
    ctx.lineDashOffset = marqueeOffset.value;
    ctx.imageSmoothingEnabled = false;

    ctx.strokeStyle = "#333";
    ctx.lineWidth = 3;
    ctx.strokeRect(props.selX - bb.left, props.selY - bb.top, props.selW, props.selH);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
    ctx.strokeRect(props.selX - bb.left - 1, props.selY - bb.top - 1, props.selW, props.selH);
    // ctx.strokeRect(props.selX - bb.left + 1, props.selY - bb.top + 1, props.selW, props.selH);

    // window.requestAnimationFrame(() => {
    //     props.drawSelectionRect(markupCanv.value);
    // });
}

const resize = function (): void {
    let newWidth = Math.floor(props.width);
    let newHeight = Math.floor(props.height);
    wrapper.value.style.width = `${newWidth + 2}px`;     //Add 2 to account for border width
    wrapper.value.style.height = `${newHeight + 2}px`;
    markupCanv.value.width = newWidth;
    markupCanv.value.height = newHeight;
    mainCanv.value.height = newHeight;
    mainCanv.value.width = newWidth;

    bb = wrapper.value.getBoundingClientRect();
};

onUpdated(() => {
    window.requestAnimationFrame(() => {
        resize();
        drawImage();
        drawSelectionRect();
    });
});

setInterval(() => marqueeOffset.value-=4, 750);

onMounted(() => {
    markupCanv.value.getContext('2d').lineDashOffset = marqueeOffset.value;

    window.requestAnimationFrame(() => {
        resize();
        drawImage();
        drawSelectionRect();
    });
});
</script>

<style lang="scss" scoped>
.canvas-wrapper {
    margin: 0 auto;
    border: solid 1px black;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

canvas {
    position: absolute;
}
</style>