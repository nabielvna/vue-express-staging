<template>
    <div class="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
        <div class="flex items-center justify-between">
            <div>
                <p class="text-zinc-400 text-sm">{{ title }}</p>
                <p class="text-2xl font-bold" :class="`text-${color}-500`">
                    {{ value }}
                </p>
            </div>
            <div :class="`bg-${color}-500/10 p-3 rounded-lg`">
                <slot name="icon"></slot>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        required: true,
    },
    value: {
        type: [Number, String],
        required: true,
    },
    color: {
        type: String,
        default: 'purple',
    },
})
</script>
