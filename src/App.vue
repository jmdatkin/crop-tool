<script setup lang="ts">
import { inject, provide, readonly, ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router'
import AppBar from './components/AppBar.vue'
import eventBus from './events';

const sidebarOpen = ref(false);

provide('sidebar-status', readonly(sidebarOpen));

eventBus.on('sidebar-toggle', () => {
  sidebarOpen.value = !sidebarOpen.value;
});

</script>

<template>
  <AppBar></AppBar>
  <div class="app-wrapper">
    <RouterView />
  </div>
</template>

<style lang="scss">
@import "@/assets/main.scss";
@import "@/assets/variables.scss";

.app-wrapper {
  width: 100%;
  height: calc(100% - $app-bar-height);
}

</style>
