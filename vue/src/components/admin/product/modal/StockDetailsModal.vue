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
                        <div>
                            <h3 class="text-lg font-medium text-white">
                                Stock Details
                            </h3>
                            <p
                                v-if="product"
                                class="mt-1 text-sm text-zinc-400"
                            >
                                {{ product.name }}
                            </p>
                        </div>
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

                <div v-if="product" class="p-6 space-y-6">
                    <!-- Total Stock Summary Card -->
                    <div
                        class="bg-purple-900/30 rounded-xl p-4 border border-purple-700/50"
                    >
                        <div class="flex items-center justify-between">
                            <div>
                                <span
                                    class="text-sm font-medium text-purple-200"
                                    >Total Stock</span
                                >
                                <div class="mt-1 flex items-baseline">
                                    <span
                                        class="text-2xl font-semibold text-purple-300"
                                    >
                                        {{ getTotalStock(product.sizeStock) }}
                                    </span>
                                    <span class="ml-2 text-sm text-purple-400"
                                        >units</span
                                    >
                                </div>
                            </div>
                            <div class="p-3 bg-purple-800/30 rounded-lg">
                                <svg
                                    class="w-6 h-6 text-purple-400"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <path
                                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <!-- Size Stock Grid -->
                    <div class="grid grid-cols-2 gap-4">
                        <div
                            v-for="(stock, size) in product.sizeStock"
                            :key="size"
                            class="bg-zinc-800/30 rounded-xl p-4 border border-zinc-700/50"
                        >
                            <div class="flex items-center justify-between">
                                <span class="text-sm font-medium text-zinc-300">
                                    Size {{ size }}
                                </span>
                                <span :class="getStockBadgeClass(stock)">
                                    {{ stock }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Status Summary -->
                    <div
                        class="flex items-center justify-between p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/50"
                    >
                        <span class="text-sm font-medium text-zinc-300"
                            >Status</span
                        >
                        <span
                            :class="
                                getStatusClass(
                                    getOverallStatus(product.sizeStock),
                                )
                            "
                        >
                            {{
                                formatStatus(
                                    getOverallStatus(product.sizeStock),
                                )
                            }}
                        </span>
                    </div>
                </div>

                <div
                    class="px-6 py-4 bg-zinc-800/50 rounded-b-xl border-t border-zinc-800 flex justify-end space-x-3"
                >
                    <button
                        @click="$emit('edit')"
                        class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
                    >
                        Edit Stock
                    </button>
                    <button
                        @click="close"
                        class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors duration-200"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
    modelValue: Boolean,
    product: Object,
})

const emit = defineEmits(['update:modelValue', 'edit'])

const close = () => {
    emit('update:modelValue', false)
}

const getTotalStock = sizeStock => {
    return Object.values(sizeStock).reduce((sum, stock) => sum + stock, 0)
}

const getOverallStatus = sizeStock => {
    const total = getTotalStock(sizeStock)
    if (total === 0) return 'out_of_stock'
    if (Object.values(sizeStock).some(stock => stock > 0 && stock <= 5))
        return 'low_stock'
    return 'in_stock'
}

const formatStatus = status => {
    return status
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

const getStockBadgeClass = stock => {
    const baseClasses = 'px-2 py-0.5 rounded-md text-xs font-medium'
    if (stock > 10) return `${baseClasses} bg-emerald-500/20 text-emerald-400`
    if (stock > 0) return `${baseClasses} bg-yellow-500/20 text-yellow-400`
    return `${baseClasses} bg-red-500/20 text-red-400`
}

const getStatusClass = status => {
    const baseClasses = 'px-3 py-1 text-xs font-medium rounded-full border'
    const statusClasses = {
        in_stock: 'bg-emerald-900/30 text-emerald-400 border-emerald-700/50',
        low_stock: 'bg-yellow-900/30 text-yellow-400 border-yellow-700/50',
        out_of_stock: 'bg-red-900/30 text-red-400 border-red-700/50',
    }
    return `${baseClasses} ${statusClasses[status]}`
}
</script>
