<template>
    <canvas id="overlay-canvas" ref="canv"></canvas>
</template>

<script setup lang="ts">

import { useSelectionStore } from '@/stores/selection';
import { onMounted, onUpdated, ref, watch, watchEffect, type Ref } from 'vue';
import useDraw from '@/hooks/useDraw';

const props = defineProps<{
    width: Number,
    height: Number,
    showGridlines: boolean
}>();

const canv = ref(null);
const ctx: Ref<CanvasRenderingContext2D | null> = ref(null);
const iid = ref(null);

const selectionStore = useSelectionStore();

const draw = function () {
    let x = selectionStore.x;
    let y = selectionStore.y;
    let w = selectionStore.w;
    let h = selectionStore.h;

    ctx.value.clearRect(0, 0, canv.value.width, canv.value.height);

    ctx.value.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.value.fillRect(0, 0, canv.value.width, canv.value.height);
    ctx.value.globalCompositeOperation = 'destination-out';

    ctx.value.fillStyle = '#fff';
    ctx.value.fillRect(x, y, w, h);

    ctx.value.globalCompositeOperation = 'source-over';

    ctx.value.setLineDash([7, 5]);
    // ctx.value.lineWidth = 0.5;
    // ctx.value.strokeRect(x, y, w, h);
    // White stroke with black outline
    ctx.value.lineWidth = 3;
    ctx.value.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.value.strokeRect(x, y, w, h);
    ctx.value.lineWidth = 1;
    ctx.value.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.value.strokeRect(x, y, w, h);
    ctx.value.strokeRect(x, y, w, h);

    // Rule of thirds
    let oneThirdW = Math.floor(w*0.33);
    let twoThirdsW = Math.floor(w*0.66);

    let oneThirdH = Math.floor(h*0.33);
    let twoThirdsH = Math.floor(h*0.66);

    ctx.value?.setLineDash([]);
    ctx.value.lineWidth = 0.5;
    ctx.value?.beginPath();
    ctx.value?.moveTo(x + oneThirdW, y);
    ctx.value?.lineTo(x + oneThirdW, y + h);
    ctx.value?.moveTo(x + twoThirdsW, y);
    ctx.value?.lineTo(x + twoThirdsW, y + h);

    ctx.value?.moveTo(x, y + oneThirdH);
    ctx.value?.lineTo(x + w, y + oneThirdH);
    ctx.value?.moveTo(x, y + twoThirdsH);
    ctx.value?.lineTo(x + w, y + twoThirdsH);

    // White stroke with black outline
    ctx.value.lineWidth = 3;
    ctx.value.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.value?.stroke();
    ctx.value.lineWidth = 0.5;
    ctx.value.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.value?.stroke();
    ctx.value?.stroke();

};

const {start, stop} = useDraw(draw);

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

onUpdated(() => {
    canv.value.width = props.width;
    canv.value.height = props.height;
    ctx.value.translate(0.5, 0.5);
});

onMounted(() => {
    canv.value.width = props.width;
    canv.value.height = props.height;
    ctx.value = canv.value.getContext('2d');
    ctx.value.translate(0.5, 0.5);
    start();
});
</script>

<style lang="scss" scoped>
canvas {
    position: absolute;
}
</style>