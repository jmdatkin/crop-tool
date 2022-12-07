<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import eventBus from '@/events';
import { inject} from 'vue';
import { sidebarWidth } from '@/variables';

const toggle = () => eventBus.emit('sidebar-toggle');

const sidebarOpen = inject('sidebar-status');

</script>

<template>
    <div class="app-bar border-b">
        <div class="app-bar-sidebar-spacer border-r" :style="{'min-width': sidebarWidth + 'px'}">
        </div>
        <div class="app-bar-items space-x-2">
            <div class="app-bar-item">
                <FontAwesomeIcon class="text-slate-700" size="xl" icon="fa-solid fa-crop" />
            </div>
            <div class="app-bar-item">
                <span class="text-slate-700">Croppy</span>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/variables.scss';
    .app-bar {
        width: 100%;
        height: $app-bar-height;
        display: flex;
    }

    .app-bar-items {
        display: flex;
        flex-direction: row;
        margin: 0 40px;
        place-items: center;
        padding: 5px 0;
    }

    button {
        // color: #eee;
        color:  rgb(55, 59, 73);
        background-color: #eee;
        font-weight: 600;
        text-shadow: 1px 1px 0 rgb(167, 167, 167);
        // border: solid 2px rgb(76, 86, 119);
        padding: 2px 10px;
        border-radius: 8px;
        line-height: 200%;
        // vertical-align: middle;
    }

    span {
        font-weight: 700;
        font-size: 1.75rem;
    }
</style>