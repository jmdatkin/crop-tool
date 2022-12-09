<script setup lang="ts">
import { ref, type Ref } from 'vue';

const props = defineProps<{
    onFileSelect: Function
}>();

const fileHandler = function(e: Event) {
    props.onFileSelect(e);
};

const input: Ref<HTMLInputElement | null> = ref(null);
const clickInput = function() {
    console.log("Hi");
    (input as Ref<HTMLInputElement>).value.click()
};
</script>

<template>
    <!-- <div class="filechooser"> -->
        <input @change="fileHandler" ref="input" type="file" />
        <slot :doClick="clickInput"></slot>
    <!-- </div> -->
</template>

<style lang="scss" scoped>
input[type=file] {
    display: none;
}

div.filechooser {
    pointer-events: auto;
}
</style>