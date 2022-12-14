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
    ctx.value.lineWidth = 0.5;
    ctx.value.strokeRect(x, y, w, h);
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