<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import AppBar from './components/AppBar.vue'
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
