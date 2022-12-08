<script setup lang="ts">
defineProps(['modelValue']);

</script>

<template>
    <div class="inputtext">
        <input class="border rounded border-gray-500 text-black dark:bg-zinc-800 dark:text-zinc-50 dark:border-zinc-700 focus:shadow-inner focus:shadow-slate-500/20 focus:outline-none"  :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
    </div>
</template>

<style scoped lang="scss">

input {
    padding: 7px 9px;
    min-width: 0;
    max-width: 100%;
}

</style>