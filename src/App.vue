<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Toolbar from './components/Toolbar.vue'
</script>

<template>
  <Toolbar></Toolbar>
  <div class="app-wrapper">
    <RouterView />
  </div>
</template>

<style lang="scss">
@import "@/assets/main.scss";
@import "@/assets/variables.scss";

.app-wrapper {
  width: 100%;
  height: calc(100% - $toolbar-height);
}

</style>
