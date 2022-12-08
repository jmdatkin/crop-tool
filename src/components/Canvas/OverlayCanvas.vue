<template>
    <canvas id="overlay-canvas" ref="canv"></canvas>
</template>

<script setup lang="ts">

import { useSelectionStore } from '@/stores/selection';
import { onMounted, onUpdated, ref, watch, watchEffect, type Ref } from 'vue';

const props = defineProps<{
    width: Number,
    height: Number,
    mousePositionData: object
}>();

const canv = ref(null);
const ctx: Ref<CanvasRenderingContext2D | null> = ref(null);
const iid = ref(null);

const selectionStore = useSelectionStore();

const start = function () {
    iid.value = window.requestAnimationFrame(loop);
};

let lastTime = Date.now();
let fps = 1 / 60;
const loop = function () {
    let thisTime = Date.now();
    if (thisTime - lastTime < fps) return;

    draw();

    window.requestAnimationFrame(loop);
};

const stop = function() {
    if (iid.value)
        window.cancelAnimationFrame(iid);
};

const draw = function () {
    let x = selectionStore.x;
    let y = selectionStore.y;
    let w = selectionStore.w;
    let h = selectionStore.h;

    console.log(x,y);
    console.log(w,h);

    ctx.value.clearRect(0, 0, canv.value.width, canv.value.height);

    ctx.value.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.value.fillRect(0, 0, canv.value.width, canv.value.height);
    ctx.value.globalCompositeOperation = 'destination-out';

    ctx.value.fillStyle = '#fff';
    ctx.value.fillRect(x, y, w, h);

    ctx.value.globalCompositeOperation = 'source-over';

    ctx.value.setLineDash([7, 5]);
    ctx.value.lineWidth = 0.5;
    ctx.value.strokeRect(x, y, w, h);
};

const drawOnscreen = function () {
    let ctx = canv.value.getContext('2d');
    ctx.translate(0.5, 0.5);
    let { px, py, qx, qy } = props.mousePositionData;
    window.requestAnimationFrame(() => {
        ctx.clearRect(0, 0, canv.value.width, canv.value.height);

        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, canv.value.width, canv.value.height);
        ctx.globalCompositeOperation = 'destination-out';

        ctx.fillStyle = '#fff';
        ctx.fillRect(px, py, qx - px, qy - py);

        ctx.globalCompositeOperation = 'source-over';

        ctx.setLineDash([7, 5]);
        ctx.lineWidth = 0.5;
        ctx.strokeRect(px, py, qx - px, qy - py);

        // ctx.setLineDash([]);

        // ctx.lineCap = 'round';

        // ctx.strokeStyle = 'white';
        // ctx.lineWidth = 5;
        // drawCorner(ctx, px, py, 'tl', 20, 7);
        // drawCorner(ctx, qx, qy, 'br', 20, 7);

        // ctx.strokeStyle = 'black';
        // ctx.lineWidth = 3;
        // drawCorner(ctx, px, py, 'tl', 23, 5);
        // drawCorner(ctx, qx, qy, 'br', 23, 5);
        // drawCorner(ctx, px, py, 'tl', 20, 9);
        // drawCorner(ctx, qx, qy, 'br', 20, 9);
    });
};

const drawCorner = function (ctx: CanvasRenderingContext2D, x: number, y: number, orientation: string = 'tl', size = 20, offset = 5) {

    switch (orientation) {
        case 'tl':
            ctx.beginPath();
            ctx.moveTo(x - offset, y - offset);
            ctx.lineTo(x - offset + size, y - offset);
            ctx.moveTo(x - offset, y - offset);
            ctx.lineTo(x - offset, y - offset + size);
            break;
        case 'tr':
            ctx.beginPath();
            ctx.moveTo(x + offset, y - offset);
            ctx.lineTo(x + offset - size, y - offset);
            ctx.moveTo(x + offset, y - offset);
            ctx.lineTo(x + offset, y - offset + size);
            break;
        case 'bl':
            ctx.beginPath();
            ctx.moveTo(x - offset, y + offset);
            ctx.lineTo(x - offset + size, y + offset);
            ctx.moveTo(x - offset, y + offset);
            ctx.lineTo(x - offset, y + offset - size);
            break;
        case 'br':
            ctx.beginPath();
            ctx.moveTo(x + offset, y + offset);
            ctx.lineTo(x + offset - size, y + offset);
            ctx.moveTo(x + offset, y + offset);
            ctx.lineTo(x + offset, y + offset - size);
            break;
    }

    ctx.stroke();
};

// watch(props.mousePositionData, () => {
//     drawOnscreen();
// });

onUpdated(() => {
    canv.value.width = props.width;
    canv.value.height = props.height;
    // drawOnscreen();
});

onMounted(() => {
    canv.value.width = props.width;
    canv.value.height = props.height;
    ctx.value = canv.value.getContext('2d');
    ctx.value.translate(0.5, 0, 5);
    start();
});
</script>

<style lang="scss" scoped>
canvas {
    position: absolute;
}
</style>