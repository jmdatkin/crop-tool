<template>
    <canvas id="overlay-canvas" ref="canv"></canvas>
</template>

<script setup lang="ts">

import { onMounted, onUpdated, ref } from 'vue';

const props = defineProps<{
    width: Number,
    height: Number
}>();

const canv = ref(null);

onUpdated(() => {
    canv.value.width = props.width;
    canv.value.height = props.height;
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