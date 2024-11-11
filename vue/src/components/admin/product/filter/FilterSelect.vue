<template>
    <select
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="bg-black/50 border border-zinc-800 text-white rounded-xl px-6 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
    >
        <option value="">{{ placeholder }}</option>
        <option
            v-for="option in options"
            :key="option.value || option"
            :value="option.value || option"
        >
            {{ formatOption(option.label || option) }}
        </option>
    </select>
</template>

<script setup>
defineProps({
    modelValue: {
        type: String,
        default: '',
    },
    options: {
        type: Array,
        required: true,
    },
    placeholder: {
        type: String,
        required: true,
    },
})

defineEmits(['update:modelValue'])

const formatOption = option => {
    if (!option) return ''
    return typeof option === 'string'
        ? option
              .split('_')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')
        : option
}
</script>
