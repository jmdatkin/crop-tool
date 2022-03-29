<script setup lang="ts">
import Canvas from "./Canvas/Canvas.vue";
import { loadFile } from '../file-handler';
import { ref } from "vue";

const canvas_dataURL = ref('');

const dropHandler = function (e: DragEvent) {
    e.preventDefault();

    if (e.dataTransfer.items) {
        // for (let item of e.dataTransfer.items) {
        //     if ()
        //     console.log(item);
        // }
        let item = e.dataTransfer.items[0];

        loadFile(item).then(url => {
            console.log('im here');
            canvas_dataURL.value = url;
            // window.location.href = im;
        }).catch(err => console.error(err));
        // if (item.type.indexOf('image') < 0 && item.kind === 'file') {
        //     throw Error("Only images are allowed to be uploaded");
        // } else
        //     loadImageFile(item).then(im => {
        //         console.log(im);
        //     });
    }

    console.log('ay');
};

const dragHandler = function (e: Event) {
    e.preventDefault();
    console.log('ayyy');
}

</script>

<template>
    <div class="main-view">
        <div class="drop-target" @drop.prevent="dropHandler" @dragover="dragHandler"></div>
        <div class="content-wrapper">
            <Canvas :dataURL="canvas_dataURL"></Canvas>
        </div>
    </div>
</template>

<style lang="scss">
.drop-target {
    position: absolute;
    width: 100%;
    height: 100%;
}
.main-view {
    width: 100%;
    height: 100%;
}

.content-wrapper {
    width: 100%;
    height: 100%;
    padding-top: 40px;
}
</style>