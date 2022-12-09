<script setup lang="ts">

defineProps(['dataURL']);
</script>

<template>
<div class="image-entry rounded border border-zinc-300 dark:border-zinc-700 p-2">
    <img class="max-w-xs" :src="dataURL" />
</div>
</template>

<style lang="scss">
</style>