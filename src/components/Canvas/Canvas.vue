<template>
    <div ref="wrapper" class="canvas-wrapper">
        <canvas id="main-canv" ref="canv">
            <CanvasImage
                :canv="canv"
                :dataURL="props.dataURL"
                :width="props.width"
                :height="props.height"
                :image="props.image"
            />
        </canvas>
    </div>
</template>

<script setup lang="ts">import { nextTick, onMounted, onUpdated, provide, reactive, ref, watch } from 'vue';
import CanvasImage from './CanvasImage.vue';


const props = defineProps<{
    width: number,
    height: number,
    dataURL: string,
    image: typeof Image
}>();

const dataLoaded = ref(false);

const canv = ref(null);
const ctx = ref(null);
const wrapper = ref(null);
const workspace = ref(null);

const resize = function (width: number, height: number): void {
    width = Math.floor(width);
    height = Math.floor(height);
    wrapper.value.style.width = `${width + 2}px`;     //Add 2 to account for border width
    wrapper.value.style.height = `${height + 2}px`;
    canv.value.width = width;
    canv.value.height = height;
}

onUpdated(() => {
    console.log('updated');
    resize(props.width, props.height);
});

onMounted(() => {
    ctx.value = canv.value.getContext('2d');
    resize(props.width, props.height);
});

provide('canvas-context', ctx);

</script>

<style lang="scss" scoped>
.canvas-wrapper {
    margin: 0 auto;
    border: solid 1px black;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}
</style>