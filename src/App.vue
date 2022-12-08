<script setup lang="ts">
import { inject, provide, readonly, ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router'
import AppBar from './components/AppBar.vue'
import eventBus from './events';

const sidebarOpen = ref(false);
const darkMode = ref(false);

const updateDarkMode = function(value: boolean) {
  darkMode.value  = value;
};

eventBus.on('sidebar-toggle', () => {
  sidebarOpen.value = !sidebarOpen.value;
});

eventBus.on('toggle-dark-mode', () => {
  darkMode.value = !darkMode.value;
});

provide('sidebar-status', readonly(sidebarOpen));
provide('dark-mode', { darkMode: readonly(darkMode), updateDarkMode });

</script>

<template>
  <div class="app-container" :class="{'dark': darkMode}">
  <AppBar></AppBar>
  <div class="app-wrapper">
    <RouterView />
  </div>
  </div>
</template>

<style lang="scss">
@import "@/assets/main.scss";
@import "@/assets/variables.scss";

.app-container {
  width: 100vw;
  height: 100vh;
}

.app-wrapper {
  width: 100%;
  height: calc(100% - $app-bar-height);
}

</style>
