<script setup lang="ts">
import { ref, onMounted } from 'vue';

defineProps(['image']);

const width = ref(0);
const height = ref(0);

const imageObject = ref(null);

onMounted(() => {
    width.value = imageObject.value.naturalWidth;
    height.value = imageObject.value.naturalHeight;
})


</script>

<template>
<div class="image-entry rounded border border-zinc-300 dark:border-zinc-700 p-2">
    <span>{{image.w}}px x {{image.h}}px</span>
    <img class="max-w-xs" ref="imageObject" :src="image.src" />
</div>
</template>

<style lang="scss">
</style>