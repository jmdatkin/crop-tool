<script setup lang="ts">
defineProps(['title']);
</script>

<template>
    <div class="sidebar-section w-full flex flex-col border-zinc-300 dark:border-zinc-700">
        <span v-if="title" class="sidebar-section-label font-bold text-zinc-700 dark:text-zinc-100 uppercase text-md mb-4">
            {{ title }}
        </span>
        <div class="sidebar-section-content w-full space-y-6">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped lang="scss">
</style>