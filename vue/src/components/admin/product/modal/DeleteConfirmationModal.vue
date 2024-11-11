<template>
    <div class="fixed inset-0 z-50 overflow-y-auto" @click="close">
        <div class="fixed inset-0 bg-black/75 backdrop-blur-sm"></div>

        <div class="flex min-h-full items-center justify-center p-4">
            <div
                class="relative bg-zinc-900 rounded-xl max-w-md w-full mx-auto shadow-xl border border-zinc-800"
                @click.stop
            >
                <div class="px-6 pt-6 pb-4 border-b border-zinc-800">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-medium text-white">
                            Confirm Delete
                        </h3>
                        <button
                            @click="close"
                            class="text-zinc-400 hover:text-white rounded-lg p-1 hover:bg-zinc-800/50 transition-colors"
                        >
                            <svg
                                class="w-5 h-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                            >
                                <path
                                    d="M6 18L18 6M6 6l12 12"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="p-6">
                    <p class="text-zinc-300">
                        Are you sure you want to delete this product? This
                        action cannot be undone
                    </p>
                </div>

                <div
                    class="px-6 py-4 bg-zinc-800/50 rounded-b-xl border-t border-zinc-800 flex justify-end space-x-3"
                >
                    <button
                        @click="confirm"
                        class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                    >
                        Delete
                    </button>
                    <button
                        @click="close"
                        class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors duration-200"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const defineProps = defineProps({
    modelValue: Boolean,
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const close = () => {
    emit('update:modelValue', false)
}

const confirm = () => {
    emit('confirm')
    close()
}
</script>
