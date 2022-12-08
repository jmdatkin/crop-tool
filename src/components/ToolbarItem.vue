<script setup lang="ts">
defineProps(['title']);
</script>

<template>
    <div class="toolbar-item">
        <span class="toolbar-item-label font-medium">
            {{ title }}
        </span>
        <div class="toolbar-item-content">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped lang="scss">
    span.toolbar-item-label {
        font-weight:600;
    }
</style>