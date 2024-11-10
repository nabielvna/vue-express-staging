<template>
    <div class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen p-4">
            <!-- Backdrop -->
            <div
                class="fixed inset-0 bg-black/80 transition-opacity"
                @click="$emit('close')"
            ></div>

            <!-- Modal Content -->
            <div
                class="relative bg-zinc-900 rounded-lg w-full max-w-lg shadow-xl transform transition-all"
            >
                <!-- Header -->
                <div
                    class="flex items-center justify-between p-4 border-b border-zinc-800"
                >
                    <h3 class="text-lg font-medium text-white">
                        {{ title }}
                    </h3>
                    <button
                        @click="$emit('close')"
                        class="text-zinc-400 hover:text-white transition-colors"
                    >
                        <svg
                            class="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <!-- Body -->
                <div class="p-4">
                    <slot></slot>
                </div>
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
})

defineEmits(['close'])
</script>
