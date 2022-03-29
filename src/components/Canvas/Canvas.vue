<template>
    <div ref="wrapper" class="canvas-wrapper">
        <canvas id="main-canv" ref="canv"></canvas>
    </div>
</template>

<script setup lang="ts">import { onMounted, onUpdated, ref } from 'vue';


const props = defineProps<{
    // width: Number,
    // height: Number,
    dataURL: string
}>();

const canv = ref(null);
const wrapper = ref(null);

onUpdated(() => {
    let im = new Image();
    im.src = props.dataURL;
    im.decode().then(() => {
        let c_w = im.naturalWidth;
        let c_h = im.naturalHeight;

        wrapper.value.style.width = `${c_w}px`;
        wrapper.value.style.height = `${c_h}px`;
        canv.value.width = c_w;
        canv.value.height = c_h;

        canv.value.getContext('2d').drawImage(im,0,0);
    });
});

onMounted(() => {
    // console.log(canv.value);
    // wrapper.value.style.width = `${props.width}px`;
    // wrapper.value.style.height = `${props.height}px`;


    // canv.value.width = props.width;
    // canv.value.height = props.height;
});
</script>

<style lang="scss" scoped>
.canvas-wrapper {
    margin: 0 auto;
    border: solid 1px black;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}
</style>