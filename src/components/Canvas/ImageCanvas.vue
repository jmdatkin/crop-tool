<template>
    <canvas id="image-canvas" ref="canv"></canvas>
</template>

<script setup lang="ts">

import { onMounted, onUpdated, ref } from 'vue';

const props = defineProps<{
    width: Number,
    height: Number,
    sourceImage: HTMLImageElement | null,
    sourceImageWidth: Number,
    sourceImageHeight: Number
}>();

const canv = ref(null);

const drawOnscreen = function () {
    window.requestAnimationFrame(() => {
        canv.value.getContext('2d').drawImage(
            props.sourceImage,
            0, 0,
            props.sourceImageWidth, props.sourceImageHeight,
            0, 0,
            canv.value.width, canv.value.height
        );

    });
}

onUpdated(() => {
    canv.value.width = props.width;
    canv.value.height = props.height;
    drawOnscreen();
});

onMounted(() => {
    canv.value.width = props.width;
    canv.value.height = props.height;
    drawOnscreen();
});
</script>

<style lang="scss" scoped>
canvas {
    position: absolute;
}
</style>