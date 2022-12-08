<script setup lang="ts">
import { ref } from 'vue';

    const props = defineProps<{
            label: string,
            modelValue: boolean
    }>();

    const checked = ref();
</script>

<template>
<span class="inputswitch">
    <label class="inputswitch-text-label">
        {{label}}
        <label class="inputswitch-label">
            <input type="checkbox" :checked="modelValue" @input="$emit('update:modelValue', $event.target.value)"/>
            <span class="inputswitch-slider after:bg-white" />
        </label>
    </label>
</span>
</template>

<style lang="scss">
    input[type="checkbox"] {
        height: 0;
        width: 0;
        visibility: hidden;
    }

    .inputswitch-text-label {
        display: flex;
        flex-direction: column;
    }

    .inputswitch-label {
        position: relative;
        display: inline-block;
        width: 45px;
        height: 25px;
    }

    .inputswitch-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: grey;
        -webkit-transition: 0.4s;
        transition: 0.4s;

        border-radius: 34px;
    }

    .inputswitch-slider:after {
        position: absolute;
        content: "";
        height: 17px;
        width: 17px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: 0.3s;
        -webkit-transition: 0.3s;

        border-radius: 50%;
    }

    input:checked + .inputswitch-slider {
        background: #6fb9dd;
    }

    input:checked + .inputswitch-slider:after {
        left: calc(100% - 4px);
        transform: translateX(-100%);
    }

    .inputswitch-slider:active:after {
        width: 18px;
    }
</style>