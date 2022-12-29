<script setup lang="ts">
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { inject, provide, readonly, ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router'
import AppBar from './components/AppBar.vue'
import eventBus from './events';
import { firebaseApp } from './firebase';
import { useAuthStore } from './stores/auth';

const authStore = useAuthStore();
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

// onAuthStateChanged(getAuth(), (user) => {
//     if (user)
//         authStore.user = user;
//     else
//         authStore.user = null;
// });
// setTimeout(() => authStore.init(), 2000);
authStore.init();
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
  display: flex;
  justify-content: center;
  align-items: center;
  @apply dark:bg-zinc-800;
  @apply dark:text-zinc-50;
  @apply text-zinc-800;
}

</style>
