<template>
<div class="toolbar-collapsible w-full fixed bg-opacity-50 bg-gray-500 p-4">
    <CropPreview
        :mousePositionData="props.mousePositionData"
        :sourceImage="props.sourceImage"
        :sourceImageWidth="props.sourceImageWidth"
        :sourceImageHeight="props.sourceImageHeight"
        :scaleFactor="scaleFactor"
    ></CropPreview>
</div>
</template>

<script setup lang="ts">
import type MousePositionData from '@/types/MousePositionData';
import CropPreview from './CropPreview.vue';

const props = defineProps<{
    sourceImage: HTMLImageElement | null,
    sourceImageWidth: Number,
    sourceImageHeight: Number,
    mousePositionData: MousePositionData,
    scaleFactor: Number
}>();

</script>

<style lang="scss" scoped>
div.toolbar-collapsible {
    z-index: 999;
    height: 170px;
    pointer-events: none;
}
</style>