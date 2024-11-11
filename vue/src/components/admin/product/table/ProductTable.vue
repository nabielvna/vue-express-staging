<template>
    <div
        class="bg-gradient-to-b from-zinc-900/80 to-zinc-900/50 rounded-xl border border-zinc-800 overflow-hidden"
    >
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-zinc-800">
                <ProductTableHeader />
                <ProductTableBody
                    :products="products"
                    @edit="$emit('edit', $event)"
                    @delete="$emit('delete', $event)"
                    @view-stock="$emit('view-stock', $event)"
                />
            </table>
        </div>
        <!-- Remove internal pagination, use slot instead -->
        <slot name="pagination"></slot>
    </div>
</template>

<script setup>
import ProductTableHeader from './ProductTableHeader.vue'
import ProductTableBody from './ProductTableBody.vue'

defineProps({
    products: {
        type: Array,
        required: true,
    },
})

defineEmits(['edit', 'delete', 'view-stock'])
</script>
