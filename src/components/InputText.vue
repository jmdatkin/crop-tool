<script setup lang="ts">
defineProps(['modelValue']);

</script>

<template>
    <div class="inputtext">
        <input class="border border-gray-500 focus:shadow-inner focus:shadow-slate-500/20 focus:outline-none"  :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
    </div>
</template>

<style scoped lang="scss">

input {
    padding: 7px;
    min-width: 0;
    max-width: 100%;
}

</style>