<template>
    <Switch :class="modelValue ? 'bg-blue-600' : 'bg-zinc-400'"
        class="relative inline-flex h-8 w-14 items-center rounded-full">
        <span class="sr-only">Show Gridlines</span>
        <span :class="modelValue ? 'translate-x-7' : 'translate-x-1.5'"
            class="inline-block h-5 w-5 transform rounded-full bg-white transition"></span>
    </Switch>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Switch } from '@headlessui/vue'

const props = defineProps < {
    label: string,
    modelValue: boolean
} > ();

const enabled = ref(false)
</script>
