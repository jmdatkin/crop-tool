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
        ctx.strokeWidth = 0.5;
        ctx.strokeRect(px,py, qx-px, qy-py);
    });
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