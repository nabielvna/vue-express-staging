<template>
    <div class="relative flex-1 group">
        <input
            type="text"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
            class="w-full bg-black/50 border border-zinc-800 text-white rounded-xl pl-10 pr-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
            placeholder="Search products..."
        />
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center">
            <svg
                class="h-5 w-5 text-zinc-400 transition-colors duration-200 group-focus-within:text-purple-500"
                viewBox="0 0 24 24"
                fill="none"
            >
                <path
                    d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        </span>
    </div>
</template>

<script setup>
defineProps({
    modelValue: {
        type: String,
        default: '',
    },
})

defineEmits(['update:modelValue'])
</script>
