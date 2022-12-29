<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref, inject } from 'vue';

defineProps<{
    icon: string,
}>();

</script>

<template>
        <button
            class="p-1 rounded w-12 h-12 active:bg-zinc-200 text-zinc-400 hover:text-zinc-500 active:text-zinc-700 dark:text-zinc-700 active:dark:bg-zinc-700 active:dark:text-zinc-100 hover:dark:text-zinc-600 dark:border-zinc-700"
            >
            <FontAwesomeIcon class="text-inherit" size="lg" :icon="icon" />
        </button>
</template>

<style lang="scss" scoped>

</style>