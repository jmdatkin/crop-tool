<template>
    <div class="crop-preview-container" ref="cropPreviewContainer">
        <canvas id="crop-preview" ref="cropPreview"></canvas>
    </div>
</template>

<script setup lang="ts">import { onMounted, ref } from 'vue';

const cropPreview = ref(null);
const cropPreviewContainer = ref(null);

const props = defineProps<{
    draw: Function
}>();

onMounted(() => {
    requestAnimationFrame(() => {
        props.draw(cropPreview.value);
    });
});

onMounted(() => {
    let style = getComputedStyle(cropPreviewContainer.value);
    cropPreview.value.width = parseInt(style.width,10);
    cropPreview.value.height = parseInt(style.height,10);
    requestAnimationFrame(() => {
        props.draw(cropPreview.value);
    });
});
</script>

<style scoped lang="scss">
.crop-preview-container {
    // width: 100%;
    width: 360px;
    height: 192px;
    // height: (9/16);
    background-color: #fff;
    border: solid 1px black;
    margin: 10px auto;
}
</style>