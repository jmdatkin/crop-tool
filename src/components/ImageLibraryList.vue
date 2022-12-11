<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ImageEntry from './ImageEntry.vue';
import Spinner from './Spinner.vue';

const props = defineProps<{
    images: Promise<string>[]
}>();
</script>

<template>
    <div class="image-library-list w-full flex flex-col space-y-2">
        <TransitionGroup name="image-library-list">
            <ImageEntry v-for="(image, index) in images" :image="image" :key="index"></ImageEntry>
        </TransitionGroup>
    </div>
</template>

<style lang="scss">
.image-library-list-enter-active,
.image-library-list-leave-active {
    transition: all 1s ease-in-out;
}

.image-library-list-enter-from,
.image-library-list-leave-to {
    opacity: 0;
    transform: scale(0.7);
}
.image-library-list-enter-from {
    transform: translateY(-30px);
}
</style>