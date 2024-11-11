<template>
    <thead class="bg-zinc-900/50">
        <tr>
            <th
                v-for="header in headers"
                :key="header.id"
                class="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider"
                :class="{ 'text-right': header.align === 'right' }"
            >
                {{ header.label }}
            </th>
        </tr>
    </thead>
</template>

<script setup>
const headers = [
    { id: 'info', label: 'Product Info' },
    { id: 'price', label: 'Price' },
    { id: 'category', label: 'Category' },
    { id: 'status', label: 'Status' },
    { id: 'stock', label: 'Stock' },
    { id: 'collection', label: 'Collection' },
    { id: 'actions', label: 'Actions', align: 'right' },
]
</script>
