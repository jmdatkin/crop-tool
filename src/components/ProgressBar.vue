<template>
    <div class="progress-bar">
        <div ref="progressBar" class="progress-bar-inner"></div>
        <!-- <div class="progress-bar-outer"></div> -->
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EventBus from '../events';

const progressBar = ref(null)

EventBus.on('image-load-progress', progress => {
    progressBar.value.style.width = `${progress*100}%`;
    // console.log('hi'); 
});
    
</script>

<style scoped lang="scss">
    .progress-bar {
        width: 200px;
        height: 25px;
        position: relative;
        border: solid 1px black;
    }

    .progress-bar-inner {
        position: absolute;
        background-color: #222;
        height: 100%;
        float: left;
        width: 0;
    }

</style>