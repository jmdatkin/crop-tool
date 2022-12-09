<script setup lang="ts">
defineProps(['label', 'modelValue']);

</script>

<template>
    <div class="inputtext">
        <label v-if="label">
            <span>{{ label }}</span>
            <input
                class="border rounded border-gray-500 text-black dark:bg-zinc-800 dark:text-zinc-50 dark:border-zinc-700 focus:outline-none"
                :value="modelValue" @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" />
        </label>
        <input v-else
            class="border rounded border-gray-500 text-black dark:bg-zinc-800 dark:text-zinc-50 dark:border-zinc-700  focus:outline-none"
            :value="modelValue" @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" />
    </div>
</template>

<style scoped lang="scss">
label {
    display: flex;
    flex-direction: column;
    font-weight: 600;
}

input {
    padding: 7px 9px;
    min-width: 0;
    max-width: 100%;
}
</style>