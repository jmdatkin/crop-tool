<template>
    <canvas id="overlay-canvas" ref="canv"></canvas>
</template>

<script setup lang="ts">

import { onMounted, onUpdated, ref, watch, watchEffect } from 'vue';

const props = defineProps<{
    width: Number,
    height: Number,
    mousePositionData: object
}>();

const canv = ref(null);

const drawOnscreen = function() {
    let ctx = canv.value.getContext('2d');
    ctx.translate(0.5,0.5);
    let {px,py,qx,qy} = props.mousePositionData;
    window.requestAnimationFrame(() => {
        ctx.clearRect(0,0,canv.value.width,canv.value.height);

        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0,0,canv.value.width, canv.value.height);
        ctx.globalCompositeOperation = 'destination-out';

        ctx.fillStyle = '#fff';
        ctx.fillRect(px,py,qx-px,qy-py);

        ctx.globalCompositeOperation = 'source-over';

        ctx.setLineDash([7,5]);
        ctx.lineWidth = 0.5;
        ctx.strokeRect(px,py, qx-px, qy-py);

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

const drawCorner = function(ctx: CanvasRenderingContext2D, x: number, y: number, orientation: string = 'tl', size = 20, offset = 5) {

    switch (orientation) {
        case 'tl':
            ctx.beginPath();
            ctx.moveTo(x-offset, y-offset);
            ctx.lineTo(x-offset+size, y-offset);
            ctx.moveTo(x-offset, y-offset);
            ctx.lineTo(x-offset, y-offset+size);
            break;
        case 'tr':
            ctx.beginPath();
            ctx.moveTo(x+offset, y-offset);
            ctx.lineTo(x+offset-size, y-offset);
            ctx.moveTo(x+offset, y-offset);
            ctx.lineTo(x+offset, y-offset+size);
            break;
        case 'bl':
            ctx.beginPath();
            ctx.moveTo(x-offset, y+offset);
            ctx.lineTo(x-offset+size, y+offset);
            ctx.moveTo(x-offset, y+offset);
            ctx.lineTo(x-offset, y+offset-size);
            break;
        case 'br':
            ctx.beginPath();
            ctx.moveTo(x+offset, y+offset);
            ctx.lineTo(x+offset-size, y+offset);
            ctx.moveTo(x+offset, y+offset);
            ctx.lineTo(x+offset, y+offset-size);
            break;
    }

    ctx.stroke();
};

watch(props.mousePositionData, () => {
    drawOnscreen();
});

onUpdated(() => {
    canv.value.width = props.width;
    canv.value.height = props.height;
    drawOnscreen();
});

onMounted(() => {
    canv.value.width = props.width;
    canv.value.height = props.height;
});
</script>

<style lang="scss" scoped>
canvas {
    position: absolute;
}
</style>