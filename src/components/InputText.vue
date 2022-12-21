<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    label: String,
    modelValue: String,
    transform: Function,
    password: {
        type: Boolean,
        default: false
    },
    error: String
});
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
            <input :type="password ? 'password' : 'text'"
                class="mb-1 border rounded border-gray-500 text-black dark:bg-zinc-800 dark:text-zinc-50 dark:border-zinc-700 focus:outline-none"
                :class="{ 'border-red-500': error }" :value="transformedModelValue" @input="onUpdate" />
            <span v-if="error" class="mb-1 inputtext-validation-error text-sm text-red-600">
                {{ error }}
            </span>
        </label>
        <div v-else>
            <input :type="password ? 'password' : 'text'"
                class="mb-1 border rounded border-gray-500 text-black dark:bg-zinc-800 dark:text-zinc-50 dark:border-zinc-700  focus:outline-none"
                :class="{ 'border-red-500': error }" :value="transformedModelValue" @input="onUpdate" />
            <span v-if="error" class="mb-1 inputtext-validation-error text-sm text-red-600">
                {{ error }}
            </span>
        </div>
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

.shake {
    animation: shake 0.3s ease;
    animation-iteration-count: 1;
}

@keyframes shake {
    0% {
        transform: translate(0, 0);
    }

    20% {
        transform: translate(-3px, 0);
    }

    40% {
        transform: translate(1px, 0);
    }

    60% {
        transform: translate(-3px, 0);
    }

    80% {
        transform: translate(-1px, 0);
    }

    100% {
        transform: translate(1px, 0);
    }
}
</style>