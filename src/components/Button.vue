<script setup lang="ts">
defineProps(['label'])
</script>

<template>
    <button class="croppy-button bg-blue-500 p-3 rounded shadow text-white hover:shadow active:ring">{{label}}</button>
</template>

<style scoped lang="scss">
button {
    transition: box-shadow 0.05s;
}
</style>