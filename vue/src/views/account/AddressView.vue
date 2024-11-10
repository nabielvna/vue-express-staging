<template>
    <div class="space-y-6 sm:space-y-8">
        <!-- Header -->
        <div
            class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
        >
            <h2 class="text-xl sm:text-2xl font-semibold text-white">
                Address Information
            </h2>
            <div class="flex items-center gap-4">
                <span
                    v-if="showAddressForm && hasChanges"
                    class="text-sm text-yellow-400 animate-pulse"
                >
                    ● Changes not saved
                </span>
                <button
                    @click="toggleAddressForm"
                    class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-800 focus:ring-blue-500 transition-colors"
                >
                    {{ showAddressForm ? 'Cancel' : '+ Add New Address' }}
                </button>
            </div>
        </div>

        <!-- Saved Addresses -->
        <div v-if="!showAddressForm" class="space-y-4">
            <!-- Loading State -->
            <div
                v-if="loading"
                class="flex flex-col items-center justify-center min-h-[200px] rounded-lg border border-dashed border-zinc-700 bg-zinc-900/50"
            >
                <div
                    class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-zinc-500 border-t-blue-500"
                ></div>
                <p class="mt-4 text-sm text-zinc-400">Loading addresses...</p>
            </div>

            <!-- Empty State -->
            <div
                v-else-if="addresses.length === 0"
                class="flex flex-col items-center justify-center min-h-[200px] rounded-lg border border-dashed border-zinc-700 bg-zinc-900/50"
            >
                <div class="p-3 rounded-full bg-zinc-800/50 text-zinc-400">
                    <svg
                        class="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.5"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.5"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                    </svg>
                </div>
                <p class="mt-4 text-zinc-300 font-medium">
                    No addresses saved yet
                </p>
                <p class="mt-1 text-sm text-zinc-500">
                    Add your first shipping address
                </p>
            </div>

            <!-- Address List -->
            <div v-if="!showAddressForm" class="space-y-4">
                <!-- Loading State -->
                <div
                    v-if="loading"
                    class="flex flex-col items-center justify-center min-h-[200px] rounded-lg border border-dashed border-zinc-700 bg-zinc-900/50"
                >
                    <div
                        class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-zinc-500 border-t-blue-500"
                    ></div>
                    <p class="mt-4 text-sm text-zinc-400">
                        Loading addresses...
                    </p>
                </div>

                <!-- Address List -->
                <div v-else class="grid gap-4 sm:grid-cols-2">
                    <div
                        v-for="address in addresses"
                        :key="address.id"
                        class="group relative p-4 border border-zinc-800 rounded-lg hover:border-zinc-600 transition-all duration-200 bg-zinc-900/50"
                    >
                        <!-- Tag & Actions -->
                        <div class="flex justify-between items-start mb-3">
                            <div class="inline-flex items-center">
                                <span
                                    v-if="address.is_primary"
                                    class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-400 bg-blue-400/10 rounded-md"
                                >
                                    <svg
                                        class="w-3 h-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    Primary Address
                                </span>
                                <span
                                    v-else
                                    class="px-2 py-1 text-xs font-medium text-zinc-500 bg-zinc-500/10 rounded-md"
                                >
                                    Secondary Address
                                </span>
                            </div>

                            <div class="flex gap-1">
                                <button
                                    @click="editAddress(address)"
                                    class="p-1.5 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 transition-colors"
                                    title="Edit address"
                                >
                                    <svg
                                        class="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                        />
                                    </svg>
                                </button>
                                <button
                                    @click="deleteAddress(address.id)"
                                    class="p-1.5 text-zinc-400 hover:text-red-400 rounded-md hover:bg-zinc-800 transition-colors"
                                    title="Delete address"
                                >
                                    <svg
                                        class="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <!-- Address Details -->
                        <div class="space-y-2">
                            <!-- Name -->
                            <h3 class="font-medium text-white">
                                {{ address.name }}
                            </h3>

                            <!-- Address Details -->
                            <p class="text-sm leading-relaxed text-zinc-300">
                                {{ address.street_address }}
                            </p>

                            <!-- City, Province & Postal Code -->
                            <div class="flex items-baseline gap-2">
                                <p class="text-sm text-zinc-400">
                                    {{ address.city }}, {{ address.province }}
                                </p>
                                <span class="text-sm font-medium text-zinc-300">
                                    {{ address.postal_code }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Address Form -->
        <form
            v-if="showAddressForm"
            @submit.prevent="handleSubmit"
            class="space-y-6"
        >
            <!-- Name -->
            <div class="space-y-2">
                <label
                    for="name"
                    class="block text-sm font-medium text-zinc-300"
                >
                    Tag
                    <span class="text-red-500">*</span>
                    <span
                        v-if="isFieldChanged('name')"
                        class="text-yellow-400 ml-2 text-xs"
                    >
                        (Changed)
                    </span>
                </label>
                <input
                    id="name"
                    type="text"
                    v-model="formData.name"
                    required
                    @input="handleInputChange('name')"
                    class="w-full px-3 py-2 bg-zinc-900 border rounded-md text-white placeholder-zinc-400 focus:ring-2 focus:ring-white focus:border-transparent transition-colors"
                    :class="{
                        'border-yellow-500': isFieldChanged('name'),
                        'border-zinc-600': !isFieldChanged('name'),
                    }"
                />
            </div>

            <!-- Street Address -->
            <div class="space-y-2">
                <label
                    for="street_address"
                    class="block text-sm font-medium text-zinc-300"
                >
                    Address Detail
                    <span class="text-red-500">*</span>
                    <span
                        v-if="isFieldChanged('street_address')"
                        class="text-yellow-400 ml-2 text-xs"
                    >
                        (Changed)
                    </span>
                </label>
                <input
                    id="street_address"
                    type="text"
                    v-model="formData.street_address"
                    required
                    @input="handleInputChange('street_address')"
                    class="w-full px-3 py-2 bg-zinc-900 border rounded-md text-white placeholder-zinc-400 focus:ring-2 focus:ring-white focus:border-transparent transition-colors"
                    :class="{
                        'border-yellow-500': isFieldChanged('street_address'),
                        'border-zinc-600': !isFieldChanged('street_address'),
                    }"
                />
            </div>

            <!-- Subdistrict and District -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                    <label
                        for="subdistrict"
                        class="block text-sm font-medium text-zinc-300"
                    >
                        Subdistrict
                        <span
                            v-if="isFieldChanged('subdistrict')"
                            class="text-yellow-400 ml-2 text-xs"
                        >
                            (Changed)
                        </span>
                    </label>
                    <input
                        id="subdistrict"
                        type="text"
                        v-model="formData.subdistrict"
                        @input="handleInputChange('subdistrict')"
                        class="w-full px-3 py-2 bg-zinc-900 border rounded-md text-white placeholder-zinc-400 focus:ring-2 focus:ring-white focus:border-transparent transition-colors"
                        :class="{
                            'border-yellow-500': isFieldChanged('subdistrict'),
                            'border-zinc-600': !isFieldChanged('subdistrict'),
                        }"
                    />
                </div>

                <div class="space-y-2">
                    <label
                        for="district"
                        class="block text-sm font-medium text-zinc-300"
                    >
                        District
                        <span
                            v-if="isFieldChanged('district')"
                            class="text-yellow-400 ml-2 text-xs"
                        >
                            (Changed)
                        </span>
                    </label>
                    <input
                        id="district"
                        type="text"
                        v-model="formData.district"
                        @input="handleInputChange('district')"
                        class="w-full px-3 py-2 bg-zinc-900 border rounded-md text-white placeholder-zinc-400 focus:ring-2 focus:ring-white focus:border-transparent transition-colors"
                        :class="{
                            'border-yellow-500': isFieldChanged('district'),
                            'border-zinc-600': !isFieldChanged('district'),
                        }"
                    />
                </div>
            </div>

            <!-- City and Province -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                    <label
                        for="city"
                        class="block text-sm font-medium text-zinc-300"
                    >
                        City
                        <span class="text-red-500">*</span>
                        <span
                            v-if="isFieldChanged('city')"
                            class="text-yellow-400 ml-2 text-xs"
                        >
                            (Changed)
                        </span>
                    </label>
                    <input
                        id="city"
                        type="text"
                        v-model="formData.city"
                        required
                        @input="handleInputChange('city')"
                        class="w-full px-3 py-2 bg-zinc-900 border rounded-md text-white placeholder-zinc-400 focus:ring-2 focus:ring-white focus:border-transparent transition-colors"
                        :class="{
                            'border-yellow-500': isFieldChanged('city'),
                            'border-zinc-600': !isFieldChanged('city'),
                        }"
                    />
                </div>

                <div class="space-y-2">
                    <label
                        for="province"
                        class="block text-sm font-medium text-zinc-300"
                    >
                        Province
                        <span class="text-red-500">*</span>
                        <span
                            v-if="isFieldChanged('province')"
                            class="text-yellow-400 ml-2 text-xs"
                        >
                            (Changed)
                        </span>
                    </label>
                    <input
                        id="province"
                        type="text"
                        v-model="formData.province"
                        required
                        @input="handleInputChange('province')"
                        class="w-full px-3 py-2 bg-zinc-900 border rounded-md text-white placeholder-zinc-400 focus:ring-2 focus:ring-white focus:border-transparent transition-colors"
                        :class="{
                            'border-yellow-500': isFieldChanged('province'),
                            'border-zinc-600': !isFieldChanged('province'),
                        }"
                    />
                </div>
            </div>

            <!-- Postal Code -->
            <div class="space-y-2">
                <label
                    for="postal_code"
                    class="block text-sm font-medium text-zinc-300"
                >
                    Postal Code
                    <span class="text-red-500">*</span>
                    <span
                        v-if="isFieldChanged('postal_code')"
                        class="text-yellow-400 ml-2 text-xs"
                    >
                        (Changed)
                    </span>
                </label>
                <input
                    id="postal_code"
                    type="text"
                    v-model="formData.postal_code"
                    required
                    @input="handleInputChange('postal_code')"
                    class="w-full px-3 py-2 bg-zinc-900 border rounded-md text-white placeholder-zinc-400 focus:ring-2 focus:ring-white focus:border-transparent transition-colors"
                    :class="{
                        'border-yellow-500': isFieldChanged('postal_code'),
                        'border-zinc-600': !isFieldChanged('postal_code'),
                    }"
                />
            </div>

            <!-- Country -->
            <div class="space-y-2">
                <label
                    for="country"
                    class="block text-sm font-medium text-zinc-300"
                >
                    Country
                    <span class="text-red-500">*</span>
                    <span
                        v-if="isFieldChanged('country')"
                        class="text-yellow-400 ml-2 text-xs"
                    >
                        (Changed)
                    </span>
                </label>
                <select
                    id="country"
                    v-model="formData.country"
                    required
                    @change="handleInputChange('country')"
                    class="w-full px-3 py-2 bg-zinc-900 border rounded-md text-white placeholder-zinc-400 focus:ring-2 focus:ring-white focus:border-transparent transition-colors appearance-none"
                    :class="{
                        'border-yellow-500': isFieldChanged('country'),
                        'border-zinc-600': !isFieldChanged('country'),
                    }"
                >
                    <option value="">Select a country</option>
                    <option value="ID">Indonesia</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="CA">Canada</option>
                </select>
            </div>

            <!-- Form Actions -->
            <div
                class="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-zinc-700"
            >
                <div class="text-xs sm:text-sm text-zinc-400">
                    <span v-if="hasChanges">
                        Changed fields:
                        <span class="text-yellow-400">{{
                            changedFieldsText
                        }}</span>
                    </span>
                    <span v-else>No changes to save</span>
                </div>

                <div
                    class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4 sm:mt-0"
                >
                    <button
                        type="button"
                        @click="resetForm"
                        :disabled="loading || !hasChanges"
                        class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-zinc-400 bg-zinc-800 rounded-md hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-800 focus:ring-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Reset Changes
                    </button>
                    <button
                        type="submit"
                        :disabled="loading || !hasChanges"
                        class="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center space-x-2"
                    >
                        <svg
                            v-if="loading"
                            class="animate-spin h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                class="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                stroke-width="4"
                            ></circle>
                            <path
                                class="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        <span>{{
                            loading
                                ? 'Saving...'
                                : editMode
                                  ? 'Update Address'
                                  : 'Save Address'
                        }}</span>
                    </button>
                </div>
            </div>
        </form>
    </div>
    <ConfirmationModal
        :is-open="showDiscardChangesModal"
        title="Discard Changes"
        message="You have unsaved changes. Are you sure you want to discard them?"
        confirm-text="Discard"
        confirm-type="danger"
        @close="showDiscardChangesModal = false"
        @cancel="showDiscardChangesModal = false"
        @confirm="handleDiscardChanges"
    />

    <ConfirmationModal
        :is-open="showDeleteModal"
        title="Delete Address"
        message="Are you sure you want to delete this address? This action cannot be undone."
        confirm-text="Delete"
        confirm-type="danger"
        @close="showDeleteModal = false"
        @cancel="showDeleteModal = false"
        @confirm="handleDeleteConfirm"
    />
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import axiosInstance from '@/utils/axios'
import ConfirmationModal from '@/components/ConfirmationModal.vue'

// State
const loading = ref(false)
const showAddressForm = ref(false)
const addresses = ref([])
const editMode = ref(false)
const currentAddressId = ref(null)
const originalData = reactive({})
const changedFields = reactive(new Set())

// Modal states
const showDiscardChangesModal = ref(false)
const showDeleteModal = ref(false)
const pendingDeleteId = ref(null)

// Form Data
const formData = reactive({
    name: '',
    street_address: '',
    subdistrict: '',
    district: '',
    city: '',
    province: '',
    postal_code: '',
    country: '',
})

// Computed Properties
const hasChanges = computed(() => {
    return changedFields.size > 0
})

const changedFieldsText = computed(() => {
    return Array.from(changedFields)
        .map(field => {
            const fieldNames = {
                name: 'Name',
                street_address: 'Street Address',
                subdistrict: 'Subdistrict',
                district: 'District',
                city: 'City',
                province: 'Province',
                postal_code: 'Postal Code',
                country: 'Country',
            }
            return fieldNames[field] || field
        })
        .join(', ')
})

// Methods
const toggleAddressForm = () => {
    if (showAddressForm.value && hasChanges.value) {
        showDiscardChangesModal.value = true
        return
    }
    showAddressForm.value = !showAddressForm.value
    clearForm()
}

const handleDiscardChanges = () => {
    showDiscardChangesModal.value = false
    showAddressForm.value = false
    clearForm()
}

const fetchAddresses = async () => {
    try {
        loading.value = true
        const response = await axiosInstance.get('/addresses')
        addresses.value = response.data.data
    } catch (error) {
        console.error('Error fetching addresses:', error)
    } finally {
        loading.value = false
    }
}

const isFieldChanged = fieldName => {
    if (!editMode.value) {
        // Untuk mode tambah, anggap berubah jika ada isinya
        return formData[fieldName] !== ''
    }
    // Untuk mode edit, bandingkan dengan nilai asli
    return formData[fieldName] !== originalData[fieldName]
}

const handleInputChange = fieldName => {
    if (isFieldChanged(fieldName)) {
        changedFields.add(fieldName)
    } else {
        changedFields.delete(fieldName)
    }
}

const editAddress = address => {
    editMode.value = true
    currentAddressId.value = address.id

    // Simpan data asli
    Object.assign(originalData, {
        name: address.name || '',
        street_address: address.street_address || '',
        subdistrict: address.subdistrict || '',
        district: address.district || '',
        city: address.city || '',
        province: address.province || '',
        postal_code: address.postal_code || '',
        country: address.country || '',
    })

    // Set form data
    Object.assign(formData, originalData)

    showAddressForm.value = true
    changedFields.clear()
}

const handleSubmit = async () => {
    try {
        loading.value = true

        // Buat objek dengan hanya field yang berubah
        const updateData = {}
        changedFields.forEach(field => {
            updateData[field] = formData[field]
        })

        if (editMode.value) {
            await axiosInstance.put(
                `/addresses/${currentAddressId.value}`,
                updateData,
            )
        } else {
            await axiosInstance.post('/addresses', formData)
        }

        await fetchAddresses()
        resetForm()
        showAddressForm.value = false
    } catch (error) {
        console.error('Error saving address:', error)
        alert(error.response?.data?.message || 'Failed to save address')
    } finally {
        loading.value = false
    }
}

const deleteAddress = id => {
    pendingDeleteId.value = id
    showDeleteModal.value = true
}

const handleDeleteConfirm = async () => {
    try {
        loading.value = true
        await axiosInstance.delete(`/addresses/${pendingDeleteId.value}`)
        await fetchAddresses()
        showDeleteModal.value = false
    } catch (error) {
        console.error('Error deleting address:', error)
        alert(error.response?.data?.message || 'Failed to delete address')
    } finally {
        loading.value = false
        pendingDeleteId.value = null
    }
}

const resetForm = () => {
    if (editMode.value) {
        // Jika dalam mode edit, kembalikan ke nilai asli
        Object.assign(formData, originalData)
    } else {
        // Jika dalam mode tambah, kosongkan form
        Object.keys(formData).forEach(key => (formData[key] = ''))
    }

    // Reset state perubahan
    changedFields.clear()
}

const clearForm = () => {
    // Reset semua state ke kondisi awal
    editMode.value = false
    currentAddressId.value = null
    Object.keys(formData).forEach(key => (formData[key] = ''))
    Object.keys(originalData).forEach(key => delete originalData[key])
    changedFields.clear()
}

// Lifecycle
onMounted(() => {
    fetchAddresses()
})
</script>
