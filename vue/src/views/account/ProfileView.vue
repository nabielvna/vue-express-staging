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
            <!-- Profile Picture -->
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

            <!-- Profile Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Name Field -->
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
                        @input="checkChanges"
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
                        @input="checkChanges"
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
                        @input="checkChanges"
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
                    <span v-if="hasChanges"
                        >Fields marked with yellow border have unsaved
                        changes</span
                    >
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
import { ref, reactive, onMounted } from 'vue'
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
const initialData = ref(null)

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

// Change Detection Methods
const isFieldChanged = fieldName => {
    if (!initialData.value) return false
    const initial = initialData.value[fieldName] || ''
    const current = formData[fieldName] || ''
    return initial !== current
}

const checkChanges = () => {
    if (!initialData.value) return

    hasChanges.value =
        isFieldChanged('name') ||
        isFieldChanged('nickname') ||
        isFieldChanged('phone_number') ||
        previewUrl.value !== null
}

// Data Fetching
const fetchProfile = async () => {
    try {
        const response = await axiosInstance.get('/api/v1/account/profile')

        if (response.data.status === 'success') {
            const userData = response.data.data

            // Set initial data
            initialData.value = {
                name: userData.name || '',
                nickname: userData.nickname || '',
                phone_number: userData.phone_number || '',
            }

            // Set form data
            Object.assign(formData, initialData.value)

            // Set profile picture
            if (userData.profile_picture_url) {
                profilePictureUrl.value = `/${userData.profile_picture_url}`
            }

            // Reset changes flag
            hasChanges.value = false
        }
    } catch (error) {
        console.error('Error fetching profile:', error)
        // You might want to show a toast/notification here
    }
}

// File Handling
const handleFileChange = event => {
    const file = event.target.files[0]
    imageError.value = ''

    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
        imageError.value = 'Please select a valid image file'
        return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
        imageError.value = 'Image size should be less than 5MB'
        return
    }

    // Create preview
    previewUrl.value = URL.createObjectURL(file)
    hasChanges.value = true

    // Reset file input
    event.target.value = ''
}

const removeProfilePicture = () => {
    previewUrl.value = null
    if (profilePictureUrl.value) {
        hasChanges.value = true
    }
    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

// Form Actions
const resetForm = () => {
    if (initialData.value) {
        // Reset form data to initial values
        Object.assign(formData, initialData.value)
    }

    // Reset all states
    previewUrl.value = null
    hasChanges.value = false
    errors.name = ''
    imageError.value = ''
}

const handleSubmit = async () => {
    try {
        loading.value = true
        errors.name = ''
        imageError.value = ''

        // Create FormData instance
        const submitData = new FormData()
        submitData.append('name', formData.name)
        submitData.append('nickname', formData.nickname)
        submitData.append('phone_number', formData.phone_number)

        // Append file if selected
        if (fileInput.value?.files[0]) {
            submitData.append('profile_picture', fileInput.value.files[0])
        }

        // Send request
        const response = await axiosInstance.put(
            '/api/v1/account/profile',
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

            // Update profile picture URL if needed
            if (response.data.data.profile_picture_url) {
                profilePictureUrl.value = `/${response.data.data.profile_picture_url}`
            }

            // Reset states
            hasChanges.value = false
            previewUrl.value = null

            // Show success message (you might want to use a toast here)
            alert('Profile updated successfully')
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
    fetchProfile()
})
</script>
