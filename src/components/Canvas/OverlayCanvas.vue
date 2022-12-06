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
    let {px,py,qx,qy} = props.mousePositionData;
    window.requestAnimationFrame(() => {
        ctx.clearRect(0,0,canv.value.width,canv.value.height);
        ctx.setLineDash([7,5]);
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