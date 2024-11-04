<template>
    <div class="space-y-8">
        <!-- Header -->
        <div class="flex justify-between items-center">
            <h2 class="text-2xl font-semibold text-white">Public Profile</h2>
            <span
                v-if="hasChanges"
                class="text-sm text-yellow-400 animate-pulse"
            >
                ● Changes not saved
            </span>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-8">
            <!-- Rest of the template remains the same until the form fields -->
            <div class="flex items-start space-x-6">
                <!-- Avatar Image -->
                <div class="relative group">
                    <img
                        :src="
                            previewUrl ||
                            profilePictureUrl ||
                            '/assets/profiles/default-avatar.png'
                        "
                        alt="Profile picture"
                        class="w-32 h-32 rounded-full object-cover ring-2 ring-gray-700 bg-gray-800"
                    />
                    <div
                        class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        @click="$refs.fileInput.click()"
                    >
                        <span class="text-white text-sm">Change Photo</span>
                    </div>
                </div>

                <!-- Upload Controls -->
                <div class="space-y-3">
                    <div>
                        <h3 class="text-lg font-medium text-white">
                            Profile Picture
                        </h3>
                        <p class="text-sm text-gray-400">
                            Upload a new avatar or remove the current one
                        </p>
                    </div>

                    <div class="flex space-x-3">
                        <input
                            type="file"
                            ref="fileInput"
                            @change="handleFileChange"
                            accept="image/*"
                            class="hidden"
                        />
                        <button
                            type="button"
                            @click="$refs.fileInput.click()"
                            class="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-colors"
                        >
                            Upload new
                        </button>
                        <button
                            v-if="profilePictureUrl || previewUrl"
                            type="button"
                            @click="removeProfilePicture"
                            class="px-4 py-2 text-sm font-medium text-red-400 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500 transition-colors"
                        >
                            Remove
                        </button>
                    </div>

                    <div v-if="imageError" class="text-red-400 text-sm">
                        {{ imageError }}
                    </div>
                </div>
            </div>

            <!-- Name Field -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                    <label
                        for="name"
                        class="block text-sm font-medium text-gray-300"
                    >
                        Full Name
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
                        :placeholder="initialData?.name || ''"
                        @input="handleInputChange('name', $event)"
                        class="w-full px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        :class="{
                            'border-yellow-500': isFieldChanged('name'),
                            'border-red-500 focus:ring-red-500': errors.name,
                        }"
                    />
                    <p v-if="errors.name" class="text-red-400 text-sm mt-1">
                        {{ errors.name }}
                    </p>
                </div>

                <!-- Nickname Field -->
                <div class="space-y-2">
                    <label
                        for="nickname"
                        class="block text-sm font-medium text-gray-300"
                    >
                        Display Name
                        <span
                            v-if="isFieldChanged('nickname')"
                            class="text-yellow-400 ml-2 text-xs"
                        >
                            (Changed)
                        </span>
                    </label>
                    <input
                        id="nickname"
                        type="text"
                        v-model="formData.nickname"
                        :placeholder="initialData?.nickname || ''"
                        @input="handleInputChange('nickname', $event)"
                        class="w-full px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        :class="{
                            'border-yellow-500': isFieldChanged('nickname'),
                        }"
                    />
                    <p class="text-gray-400 text-sm">
                        This is how your name will appear publicly
                    </p>
                </div>

                <!-- Phone Number Field -->
                <div class="space-y-2">
                    <label
                        for="phone_number"
                        class="block text-sm font-medium text-gray-300"
                    >
                        Phone Number
                        <span
                            v-if="isFieldChanged('phone_number')"
                            class="text-yellow-400 ml-2 text-xs"
                        >
                            (Changed)
                        </span>
                    </label>
                    <input
                        id="phone_number"
                        type="tel"
                        v-model="formData.phone_number"
                        :placeholder="
                            initialData?.phone_number || '+1 (555) 000-0000'
                        "
                        @input="handleInputChange('phone_number', $event)"
                        class="w-full px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        :class="{
                            'border-yellow-500': isFieldChanged('phone_number'),
                        }"
                    />
                </div>
            </div>

            <!-- Form Actions -->
            <div
                class="flex items-center justify-between pt-4 border-t border-gray-700"
            >
                <div class="text-sm text-gray-400">
                    <span v-if="hasChanges">
                        Changed fields:
                        <span class="text-yellow-400">
                            {{ getChangedFields() }}
                        </span>
                    </span>
                    <span v-else>No changes to save</span>
                </div>

                <div class="flex space-x-4">
                    <button
                        type="button"
                        @click="resetForm"
                        :disabled="loading || !hasChanges"
                        class="px-4 py-2 text-sm font-medium text-gray-400 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Reset Changes
                    </button>
                    <button
                        type="submit"
                        :disabled="loading || !hasChanges"
                        class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center space-x-2"
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
                            loading ? 'Saving...' : 'Save Changes'
                        }}</span>
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import axiosInstance from '@/utils/axios'

// Store and State Management
const authStore = useAuthStore()
const loading = ref(false)
const profilePictureUrl = ref(null)
const previewUrl = ref(null)
const fileInput = ref(null)
const imageError = ref('')
const hasChanges = ref(false)
const showSuccess = ref(false)
const initialData = ref(null)
const changedFields = reactive(new Set())

// Form Data
const formData = reactive({
    name: '',
    nickname: '',
    phone_number: '',
})

// Form Errors
const errors = reactive({
    name: '',
})

// Data Fetching
const fetchProfile = async () => {
    try {
        const response = await axiosInstance.get('/auth/me')

        if (response.data.status === 'success') {
            const userData = response.data.data.user

            // Set initial data
            initialData.value = {
                name: userData.name || '',
                nickname: userData.nickname || '',
                phone_number: userData.phone_number || '',
                profile_picture_url: userData.profile_picture_url || null,
            }

            // Set form data
            formData.name = userData.name || ''
            formData.nickname = userData.nickname || ''
            formData.phone_number = userData.phone_number || ''

            // Set profile picture
            if (userData.profile_picture_url) {
                profilePictureUrl.value = userData.profile_picture_url
            }
        }
    } catch (error) {
        console.error('Error fetching profile:', error)
    }
}

// Change Detection Methods
const isFieldChanged = fieldName => {
    if (!initialData.value) return false
    const initial = initialData.value[fieldName] || ''
    const current = formData[fieldName] || ''
    return initial !== current
}

const handleInputChange = (fieldName, event) => {
    const newValue = event.target.value
    formData[fieldName] = newValue

    // Check if value is different from initial
    const isChanged = newValue !== (initialData.value?.[fieldName] || '')

    if (isChanged) {
        changedFields.add(fieldName)
        hasChanges.value = true
    } else {
        changedFields.delete(fieldName)
        hasChanges.value = changedFields.size > 0 || previewUrl.value !== null
    }
}

const getChangedFields = () => {
    return Array.from(changedFields)
        .map(field => {
            switch (field) {
                case 'name':
                    return 'Full Name'
                case 'nickname':
                    return 'Display Name'
                case 'phone_number':
                    return 'Phone Number'
                case 'profile_picture':
                    return 'Profile Picture'
                default:
                    return field
            }
        })
        .join(', ')
}

// File handling
const handleFileChange = event => {
    const file = event.target.files[0]
    imageError.value = ''

    if (!file) return

    if (!file.type.startsWith('image/')) {
        imageError.value = 'Please select a valid image file'
        return
    }

    if (file.size > 5 * 1024 * 1024) {
        imageError.value = 'Image size should be less than 5MB'
        return
    }

    previewUrl.value = URL.createObjectURL(file)
    changedFields.add('profile_picture')
    hasChanges.value = true

    event.target.value = ''
}

const removeProfilePicture = () => {
    previewUrl.value = null
    if (profilePictureUrl.value) {
        changedFields.add('profile_picture')
        hasChanges.value = true
    }
    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

// Form Actions
const resetForm = () => {
    if (initialData.value) {
        // Reset to initial values
        formData.name = initialData.value.name || ''
        formData.nickname = initialData.value.nickname || ''
        formData.phone_number = initialData.value.phone_number || ''
    }

    previewUrl.value = null
    hasChanges.value = false
    errors.name = ''
    imageError.value = ''
    changedFields.clear()
}

const handleSubmit = async () => {
    try {
        loading.value = true
        errors.name = ''
        imageError.value = ''

        const submitData = new FormData()
        submitData.append('name', formData.name)
        submitData.append('nickname', formData.nickname)
        submitData.append('phone_number', formData.phone_number)

        if (fileInput.value?.files[0]) {
            submitData.append('profile_picture', fileInput.value.files[0])
        }

        const response = await axiosInstance.put(
            '/accounts/profile',
            submitData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            },
        )

        if (response.data.status === 'success') {
            // Update auth store
            authStore.setUser(response.data.data)

            // Update initial data
            initialData.value = {
                name: formData.name,
                nickname: formData.nickname,
                phone_number: formData.phone_number,
            }

            // Update profile picture if provided
            if (response.data.data.profile_picture_url) {
                profilePictureUrl.value = response.data.data.profile_picture_url
            }

            // Reset states
            hasChanges.value = false
            previewUrl.value = null
            changedFields.clear()

            // Show success message
            showSuccess.value = true
            setTimeout(() => {
                showSuccess.value = false
            }, 3000)
        }
    } catch (error) {
        console.error('Profile update error:', error)
        alert(error.response?.data?.message || 'Failed to update profile')
    } finally {
        loading.value = false
    }
}

// Initialize component
onMounted(() => {
    // Get initial data from auth store first
    const userData = authStore.user
    if (userData) {
        initialData.value = {
            name: userData.name || '',
            nickname: userData.nickname || '',
            phone_number: userData.phone_number || '',
        }

        // Set initial form data
        formData.name = userData.name || ''
        formData.nickname = userData.nickname || ''
        formData.phone_number = userData.phone_number || ''

        // Set profile picture if exists
        if (userData.profile_picture_url) {
            profilePictureUrl.value = userData.profile_picture_url
        }
    }

    // Then fetch fresh data
    fetchProfile()
})

// Watch for changes
watch(
    [() => formData.name, () => formData.nickname, () => formData.phone_number],
    () => {
        const anyFieldChanged =
            isFieldChanged('name') ||
            isFieldChanged('nickname') ||
            isFieldChanged('phone_number')

        hasChanges.value = anyFieldChanged || previewUrl.value !== null
    },
    { deep: true },
)
</script>
