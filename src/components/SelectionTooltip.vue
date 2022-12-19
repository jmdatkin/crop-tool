<script setup lang="ts">
import { useSelectionStore } from '@/stores/selection';
import { computed, inject } from 'vue';

const scaleFactor = inject('scale-factor');

const selectionStore = useSelectionStore();

const show = computed(() => {
return selectionStore.w !== 0 && selectionStore.h !== 0;
});

const offsetLeft = 30;
const offsetTop = 40;

const left = computed(() => {
    return Math.max(0, selectionStore.x - offsetLeft);
})

const top = computed(() => {
    return Math.max(0, selectionStore.y - offsetTop);
});
</script>

<template>
<div :class="{'hidden': !show}" :style="{left: left+'px', top: top+'px'}" class="selection-tootip pointer-events-none user-select-none rounded-md p-2 border text-zinc-50 text-xs bg-zinc-700/50 border-zinc-800 absolute z-50">
    <span class="selection-tooltip-content">
        {{Math.floor(selectionStore.w/scaleFactor)}} × {{Math.floor(selectionStore.h/scaleFactor)}}
    </span>
</div>
</template>