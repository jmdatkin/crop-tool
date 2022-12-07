<template>
<div class="toolbar-collapsible w-full fixed bg-opacity-50 bg-slate-200 shadow border-b border-slate-500 py-2">
    <div class="toolbar-items">
    <ToolbarItem title="Crop Preview">
    <CropPreview
        :mousePositionData="props.mousePositionData"
        :sourceImage="props.sourceImage"
        :sourceImageWidth="props.sourceImageWidth"
        :sourceImageHeight="props.sourceImageHeight"
        :scaleFactor="scaleFactor"
    ></CropPreview>
    </ToolbarItem>

    </div>
</div>
</template>

<script setup lang="ts">
import type MousePositionData from '@/types/MousePositionData';
import CropPreview from './CropPreview.vue';
import ToolbarItem from './ToolbarItem.vue';

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
    height: 200px;
    pointer-events: none;
}

div.toolbar-items {
    margin: 0 40px;
}
</style>