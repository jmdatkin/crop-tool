<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref, inject } from 'vue';

const { darkMode, updateDarkMode } = inject('dark-mode');

const checked = ref(darkMode);
const checkbox = ref(null);

const clickHandler = function () {
    // checked.value = !checked.value;
    checkbox.value.click();
};

const changeHandler = function (e: any) {
    updateDarkMode(e.target.checked);
};
</script>

<template>
    <span class="dark-mode-toggle">
        <button
            class="p-1 rounded w-12 h-12 active:bg-zinc-200 text-zinc-400 hover:text-zinc-500 active:text-zinc-700 dark:text-zinc-700 active:dark:bg-zinc-700 active:dark:text-zinc-100 hover:dark:text-zinc-600 dark:border-zinc-700"
            @click="clickHandler">
            <FontAwesomeIcon class="text-inherit" size="lg" v-if="checked" icon="fa-solid fa-moon" />
            <FontAwesomeIcon class="text-inherit" size="lg" v-else icon="fa-solid fa-sun" />
        </button>
    </span>
    <input type="checkbox" :checked="checked" ref="checkbox" @change="changeHandler" />
</template>

<style lang="scss" scoped>
input[type="checkbox"] {
    display: none;
}
</style>