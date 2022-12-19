<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import Spinner from './Spinner.vue';

const props = defineProps<{
    image: Promise<string>
}>();

const width = ref(0);
const height = ref(0);

const imageSrc = ref('');
// const imageObject = ref(document.createElement('img'));
const imageObject = ref(null);

const imageLoaded = ref(false);

props.image.then(im => {
    imageSrc.value = im;
    imageLoaded.value = true;
    nextTick(() => {
        imageObject.value.decode().then(() => {
            width.value = imageObject.value.naturalWidth;
            height.value = imageObject.value.naturalHeight;
        });
    });
});

const downloadImage = function() {
    if (!imageLoaded.value) return;
    const win = window.open();
    win.document.write('<iframe src="' + imageSrc.value  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
};

onMounted(() => {
});
</script>

<template>
    <div
        class="image-entry w-full rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 dark:hover:border-zinc-600"
        @click="downloadImage"
        >
        <div v-if="imageLoaded" class="image-entry-content flex w-full space-x-2">
            <div class="image-entry-thumb bg-zinc-300 dark:bg-zinc-900 rounded-tl rounded-bl">
                <img class="image-entry-thumb-img" ref="imageObject" :src="imageSrc" />
            </div>
            <div class="image-entry-info flex flex-col flex-grow p-2">
                <span class="text-sm">Properties</span>
                <span class="text-zinc-400 tracking-tight">{{ width }}px × {{ height }}px</span>
            </div>
        </div>
        <div v-else class="image-entry-loading w-full flex justify-center">
            <div class="spinner">
                <Spinner />
            </div>
        </div>
    </div>
</template>

<style lang="scss">
html div.image-entry {
    transition: background 0.1s;
    cursor: pointer;
}

div.image-entry-thumb {
    background: url('@/assets/thumbbg.png');
}

img.image-entry-thumb-img {
    object-fit: contain;
    width: 100px;
    height: 100px
}
</style>