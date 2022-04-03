<template>
<div class="sidebar bg-gray-500">
    <slot></slot>
</div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
@import "@/assets/variables.scss";
.sidebar {
    height: 100%;
    width: $sidebar-width;
    // flex-basis: $sidebar-width;
    display: flex;
    flex-direction: column;
    padding: 12px;
    position: relative;
    box-shadow: 0 0 4px rgba(0,0,0,0.3);
    // right: -1*$sidebar-width;
}
</style>