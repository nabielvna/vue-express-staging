// AdminProducts.vue
<template>
    <div class="min-h-screen bg-black p-28">
        <!-- Stats Cards -->
        <ProductStatsCards :products="filteredProducts" />

        <!-- Search and Filter Section -->
        <ProductSearchFilter
            v-model:search="searchQuery"
            v-model:category="categoryFilter"
            v-model:status="statusFilter"
            v-model:collection="collectionFilter"
            :categories="productCategories"
            @add-product="openAddProductModal"
        />

        <!-- Products Table -->
        <ProductTable
            :products="paginatedProducts"
            @edit="editProduct"
            @delete="deleteProduct"
            @view-stock="openStockModal"
        >
            <template #pagination>
                <ProductTablePagination
                    v-model:currentPage="currentPage"
                    :total-items="filteredProducts.length"
                    :items-per-page="itemsPerPage"
                />
            </template>
        </ProductTable>

        <!-- Modals -->
        <ProductFormModal
            v-if="showModal"
            v-model="showModal"
            :product="editingProduct"
            :categories="productCategories"
            :collections="collectionsData"
            :available-sizes="availableSizes"
            @save="saveProduct"
        />

        <StockDetailsModal
            v-if="showStockModal"
            v-model="showStockModal"
            :product="selectedProduct"
            @edit="editStockProduct"
        />

        <DeleteConfirmationModal
            v-if="showDeleteModal"
            v-model="showDeleteModal"
            @confirm="confirmDelete"
        />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
    productsData as initialProductsData,
    productCategories,
    collectionsData,
    availableSizes,
} from './MenuConfig'

// Import Components
import ProductStatsCards from '@/components/admin/product/card/ProductStatsCards.vue'
import ProductSearchFilter from '@/components/admin/product/filter/ProductSearchFilter.vue'
import ProductTable from '@/components/admin/product/table/ProductTable.vue'
import ProductTablePagination from '@/components/admin/product/table/ProductTablePagination.vue'
import ProductFormModal from '@/components/admin/product/modal/ProductFormModal.vue'
import StockDetailsModal from '@/components/admin/product/modal/StockDetailsModal.vue'
import DeleteConfirmationModal from '@/components/admin/product/modal/DeleteConfirmationModal.vue'

// State
const products = ref([]) // New reactive products array
const searchQuery = ref('')
const categoryFilter = ref('')
const statusFilter = ref('')
const collectionFilter = ref('')
const showModal = ref(false)
const showStockModal = ref(false)
const showDeleteModal = ref(false)
const editingProduct = ref(null)
const selectedProduct = ref(null)
const productToDelete = ref(null)
const currentPage = ref(1)
const itemsPerPage = 4

// Initialize products data
onMounted(() => {
    products.value = JSON.parse(JSON.stringify(initialProductsData))
})

// Computed
const filteredProducts = computed(() => {
    return products.value.filter(product => {
        const matchesSearch = product.name
            .toLowerCase()
            .includes(searchQuery.value.toLowerCase())
        const matchesCategory =
            !categoryFilter.value || product.category === categoryFilter.value
        const matchesStatus =
            !statusFilter.value ||
            getOverallStatus(product.sizeStock) === statusFilter.value
        const matchesCollection =
            !collectionFilter.value ||
            product.collection === parseInt(collectionFilter.value)
        return (
            matchesSearch &&
            matchesCategory &&
            matchesStatus &&
            matchesCollection
        )
    })
})

const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    return filteredProducts.value.slice(start, start + itemsPerPage)
})

// Methods
const getOverallStatus = sizeStock => {
    const totalStock = Object.values(sizeStock).reduce(
        (sum, current) => sum + current,
        0,
    )
    if (totalStock === 0) return 'out_of_stock'
    if (Object.values(sizeStock).some(stock => stock > 0 && stock <= 5))
        return 'low_stock'
    return 'in_stock'
}

// Modal Methods
const openAddProductModal = () => {
    editingProduct.value = null
    showModal.value = true
}

const editProduct = product => {
    // Create a deep copy of the product to avoid direct mutations
    editingProduct.value = JSON.parse(JSON.stringify(product))
    showModal.value = true
}

const openStockModal = product => {
    selectedProduct.value = product
    showStockModal.value = true
}

const editStockProduct = () => {
    if (selectedProduct.value) {
        editProduct(selectedProduct.value)
        showStockModal.value = false
    }
}

const deleteProduct = productId => {
    productToDelete.value = productId
    showDeleteModal.value = true
}

const confirmDelete = () => {
    if (productToDelete.value) {
        const index = products.value.findIndex(
            p => p.id === productToDelete.value,
        )
        if (index !== -1) {
            products.value.splice(index, 1)

            // Reset pagination if necessary
            const maxPage = Math.ceil(
                filteredProducts.value.length / itemsPerPage,
            )
            if (currentPage.value > maxPage) {
                currentPage.value = Math.max(1, maxPage)
            }
        }
    }
    showDeleteModal.value = false
    productToDelete.value = null
}

const saveProduct = formData => {
    // Convert FormData to a regular object
    const productData = {}
    formData.forEach((value, key) => {
        if (key === 'sizeStock') {
            productData[key] = JSON.parse(value)
        } else if (key === 'price') {
            productData[key] = parseFloat(value)
        } else if (key === 'collection') {
            productData[key] = parseInt(value)
        } else {
            productData[key] = value
        }
    })

    if (editingProduct.value) {
        // Update existing product
        const index = products.value.findIndex(
            p => p.id === editingProduct.value.id,
        )
        if (index !== -1) {
            // Merge the existing product with new data
            products.value[index] = {
                ...products.value[index],
                ...productData,
                lastUpdated: new Date().toISOString().split('T')[0],
            }
        }
    } else {
        // Create new product
        const newProduct = {
            id: Math.max(0, ...products.value.map(p => p.id)) + 1,
            ...productData,
            lastUpdated: new Date().toISOString().split('T')[0],
        }
        products.value.push(newProduct)
    }

    showModal.value = false
    editingProduct.value = null
}
</script>
