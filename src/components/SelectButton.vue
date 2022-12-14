<script setup lang="ts">
  import { ref } from 'vue'
  import {
    RadioGroup,
    RadioGroupLabel,
    RadioGroupOption,
  } from '@headlessui/vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

defineProps(['items']);
</script>

<template>
 <RadioGroup class="c-selectbutton">
    <!-- <RadioGroupLabel>Plan</RadioGroupLabel> -->

    <RadioGroupOption class="c-selectbutton-option" v-for="item in items" v-slot="{ checked }" :value="item.code">
        <div :class="checked ? 'bg-blue-500 text-zinc-50 border-blue-700' : ''" class="c-selectbutton-option-inner">
            <span>{{ item.name }}</span>
            <FontAwesomeIcon :icon="item.icon ?? ''" />
        </div>
    </RadioGroupOption>

    <!-- <RadioGroupOption class="c-selectbutton-option" v-slot="{ checked }" value="startup">
        <div :class="checked ? 'bg-blue-500 text-zinc-50 border-blue-700' : ''" class="c-selectbutton-option-inner">
            Free Select
            <FontAwesomeIcon icon="fa-solid fa-lock-open" />
        </div>
    </RadioGroupOption>
    <RadioGroupOption class="c-selectbutton-option" v-slot="{ checked }" value="business">
        <div :class="checked ? 'bg-blue-500 text-zinc-50' : ''" class="c-selectbutton-option-inner">
            Fixed Ratio
            <FontAwesomeIcon icon="fa-solid fa-lock" />
        </div>
    </RadioGroupOption>
    <RadioGroupOption class="c-selectbutton-option" v-slot="{ checked }" value="enterprise">
        <div :class="checked ? 'bg-blue-500 text-zinc-50' : ''" class="c-selectbutton-option-inner">
            Fixed Size
        </div>
    </RadioGroupOption> -->
  </RadioGroup>
</template>

<style lang="scss">
div.c-selectbutton {
    display: flex;
    flex-direction: row;
}

div.c-selectbutton div.c-selectbutton-option > div {
    border: solid 1px;
    text-align: center;
    line-height: 110%;
    @apply border-zinc-500;
    @apply dark:border-zinc-700;
    @apply cursor-pointer;
    @apply active:ring;
}

div.c-selectbutton-option > div.c-selectbutton-option-inner {
    padding: 0.75rem 1rem;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

div.c-selectbutton div.c-selectbutton-option:first-of-type > div {
    border-right-width: 0;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
}

div.c-selectbutton div.c-selectbutton-option:not(:first-of-type) > div {
    border-right-width: 0;
    // border-top-left-radius: 5px;
    // border-bottom-left-radius: 5px;
}

div.c-selectbutton div.c-selectbutton-option:last-of-type > div {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    // border-right: solid 1px !important;
    border-right-width: 1px;
    // @apply border-zinc-500;
    // @apply dark:border-zinc-700;
}
</style>