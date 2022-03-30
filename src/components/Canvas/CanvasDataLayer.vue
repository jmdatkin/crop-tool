<script setup lang="ts">
import Canvas from "./Canvas.vue";

const props = defineProps(['canvas_width', 'canvas_height', 'dataURL']);



</script>

<template>
    <Canvas :dataURL="props.dataURL" :width="props.canvas_width" :height="props.canvas_height"></Canvas>
</template>