<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import eventBus from '@/events';
import { inject } from 'vue';
import { sidebarWidth } from '@/variables';
import InputSwitch from './InputSwitch.vue';
import DarkModeSwitch from './DarkModeSwitch.vue';

const { darkMode, updateDarkMode } = inject('dark-mode');

const onInputToggle = function(e: any) {
    updateDarkMode(e.target.checked)
};

</script>

<template>
    <div class="app-bar border-b bg-gray-50 dark:bg-zinc-800 dark:border-zinc-700">
        <div class="app-bar-sidebar-spacer border-r dark:border-zinc-700" :style="{ 'min-width': sidebarWidth + 'px' }">
        </div>
        <div class="app-bar-items space-x-2">
            <div class="app-bar-start">
                <div class="app-bar-item">
                    <FontAwesomeIcon class="text-slate-700 dark:text-zinc-100" size="xl" icon="fa-solid fa-crop" />
                </div>
                <div class="app-bar-item">
                    <span class="app-title text-slate-700 dark:text-zinc-100">Croppy</span>
                </div>
            </div>
            <div class="app-bar-end">
                <DarkModeSwitch></DarkModeSwitch>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@import '@/assets/variables.scss';

.app-bar {
    width: 100%;
    height: $app-bar-height;
    display: flex;
}

.app-bar-items {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    margin: 0 40px;
    place-items: center;
    padding: 5px 0;
}

.app-bar-items > div {
    display: flex;
    place-items: center;
    // flex-grow: 1;
}

button {
    // color: #eee;
    color: rgb(55, 59, 73);
    background-color: #eee;
    font-weight: 600;
    text-shadow: 1px 1px 0 rgb(167, 167, 167);
    // border: solid 2px rgb(76, 86, 119);
    padding: 2px 10px;
    border-radius: 8px;
    line-height: 200%;
    // vertical-align: middle;
}

.app-title {
    font-weight: 700;
    font-size: 1.75rem;
}
</style>