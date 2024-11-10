<template>
    <Transition name="fade">
        <div
            v-if="isOpen"
            class="fixed inset-0 z-50 overflow-y-auto"
            @click.self="onClose"
        >
            <!-- Backdrop -->
            <div class="fixed inset-0 bg-black/70"></div>

            <!-- Modal -->
            <div
                class="relative min-h-full flex items-center justify-center p-4"
            >
                <Transition name="zoom">
                    <div
                        v-if="isOpen"
                        class="relative w-full max-w-md rounded-lg bg-zinc-900 border border-zinc-700 p-6 text-left shadow-xl"
                    >
                        <h3 class="text-lg font-medium text-white">
                            {{ title }}
                        </h3>

                        <div class="mt-3">
                            <p class="text-sm text-zinc-300">
                                {{ message }}
                            </p>
                        </div>

                        <div class="mt-6 flex gap-3 justify-end">
                            <button
                                type="button"
                                class="inline-flex justify-center rounded-md border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-colors"
                                @click="onCancel"
                            >
                                {{ cancelText }}
                            </button>
                            <button
                                type="button"
                                class="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white"
                                :class="[
                                    confirmType === 'danger'
                                        ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                                        : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
                                ]"
                                @click="onConfirm"
                            >
                                {{ confirmText }}
                            </button>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>
    </Transition>
</template>

<script setup>
defineProps({
    isOpen: {
        type: Boolean,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    confirmText: {
        type: String,
        default: 'Confirm',
    },
    cancelText: {
        type: String,
        default: 'Cancel',
    },
    confirmType: {
        type: String,
        default: 'primary',
        validator: value => ['primary', 'danger'].includes(value),
    },
})

const emit = defineEmits(['close', 'cancel', 'confirm'])

const onClose = () => emit('close')
const onCancel = () => emit('cancel')
const onConfirm = () => emit('confirm')
</script>

<style scoped>
/* Fade transition untuk backdrop */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Zoom transition untuk modal content */
.zoom-enter-active,
.zoom-leave-active {
    transition: all 0.3s ease;
}

.zoom-enter-from,
.zoom-leave-to {
    opacity: 0;
    transform: scale(0.95);
}
</style>
