<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps(['label', 'modelValue', 'transform']);
const emit = defineEmits(['update:modelValue']);

const onUpdate = function (e) {
    let val = (e.target as HTMLInputElement).value;
    // if (props.transform)
    //     val = props.transform(val);

    emit('update:modelValue', (e.target as HTMLInputElement).value);
}

const transformedModelValue = computed(() => {
    return props.transform ? props.transform(props.modelValue) : props.modelValue;
})

</script>

<template>
    <div class="inputtext">
        <label v-if="label">
            <span>{{ label }}</span>
            <input
                class="border rounded border-gray-500 text-black dark:bg-zinc-800 dark:text-zinc-50 dark:border-zinc-700 focus:outline-none"
                :value="transformedModelValue" @input="onUpdate" />
        </label>
        <input v-else
            class="border rounded border-gray-500 text-black dark:bg-zinc-800 dark:text-zinc-50 dark:border-zinc-700  focus:outline-none"
            :value="transformedModelValue"
            @input="onUpdate" />
    </div>
</template>

<style scoped lang="scss">
label {
    display: flex;
    flex-direction: column;
    font-weight: 600;
}

input {
    padding: 7px 9px;
    min-width: 0;
    width: 100%;
}
</style>