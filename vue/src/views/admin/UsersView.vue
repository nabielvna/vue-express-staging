<template>
    <div class="min-h-screen bg-black p-28">
        <!-- Header -->
        <div class="mb-8">
            <div class="flex justify-between items-center">
                <div>
                    <h1
                        class="text-3xl font-bold text-white tracking-wider uppercase"
                    >
                        Users
                    </h1>
                    <p class="text-zinc-400 mt-1 tracking-wide">
                        Manage system users and their permissions
                    </p>
                </div>
                <button
                    v-if="isSuperAdmin"
                    @click="openAddUserModal"
                    class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 flex items-center"
                >
                    <span class="mr-2">+</span>
                    Add User
                </button>
            </div>
        </div>

        <!-- Search and Filters -->
        <div class="bg-zinc-900 rounded-lg border border-zinc-800 p-6 mb-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="relative">
                    <input
                        type="text"
                        v-model="filters.search"
                        @input="handleSearch"
                        class="w-full bg-black border border-zinc-800 text-white rounded-lg pl-10 pr-4 py-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                        placeholder="Search users..."
                    />
                    <div class="absolute left-3 top-3 text-zinc-400">
                        <svg
                            class="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>

                <select
                    v-model="filters.role"
                    @change="handleFilters"
                    class="bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                >
                    <option value="">All Roles</option>
                    <option
                        v-for="role in roles"
                        :key="role.id"
                        :value="role.name"
                    >
                        {{ role.name }}
                    </option>
                </select>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8">
            <div
                class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"
            ></div>
        </div>

        <!-- Error State -->
        <div
            v-else-if="error"
            class="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-8"
        >
            <p class="text-red-400">{{ error }}</p>
        </div>

        <!-- Empty State -->
        <div
            v-else-if="!users.length"
            class="bg-zinc-900 rounded-lg border border-zinc-800 p-8 text-center"
        >
            <div class="text-zinc-400">No users found</div>
        </div>

        <!-- Users Table -->
        <div
            v-else
            class="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden"
        >
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-zinc-800">
                    <thead>
                        <tr class="bg-zinc-900/50">
                            <th
                                class="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider"
                            >
                                User
                            </th>
                            <th
                                class="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider"
                            >
                                Role
                            </th>
                            <th
                                class="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider"
                            >
                                Joined Date
                            </th>
                            <th
                                v-if="isSuperAdmin"
                                class="px-6 py-4 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider"
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-zinc-800">
                        <tr
                            v-for="user in users"
                            :key="user.id"
                            class="hover:bg-zinc-800/50 transition-colors duration-200"
                        >
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div
                                        v-if="user.profile_picture"
                                        class="h-10 w-10 rounded-lg overflow-hidden"
                                    >
                                        <img
                                            :src="user.profile_picture"
                                            :alt="user.name"
                                            class="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div
                                        v-else
                                        class="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white"
                                    >
                                        {{ getUserInitials(user.name) }}
                                    </div>
                                    <div class="ml-4">
                                        <div
                                            class="text-sm font-medium text-white"
                                        >
                                            {{ user.name }}
                                        </div>
                                        <div class="text-sm text-zinc-400">
                                            {{ user.email }}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="getRoleClass(user.Role?.name)">
                                    {{ user.Role?.name || 'User' }}
                                </span>
                            </td>
                            <td
                                class="px-6 py-4 whitespace-nowrap text-sm text-zinc-400"
                            >
                                {{ formatDate(user.created_at) }}
                            </td>
                            <td
                                v-if="isSuperAdmin"
                                class="px-6 py-4 whitespace-nowrap text-right space-x-3"
                            >
                                <button
                                    @click="editUser(user)"
                                    class="text-purple-400 hover:text-purple-300 transition-colors duration-200 text-sm font-medium"
                                >
                                    Edit
                                </button>
                                <button
                                    @click="confirmDeleteUser(user)"
                                    class="text-red-400 hover:text-red-300 transition-colors duration-200 text-sm font-medium"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div
                v-if="pagination.totalPages > 1"
                class="bg-zinc-900 px-6 py-4 border-t border-zinc-800"
            >
                <div class="flex items-center justify-between">
                    <div class="text-sm text-zinc-400">
                        Showing {{ startIndex + 1 }} to
                        {{ Math.min(endIndex, pagination.total) }} of
                        {{ pagination.total }} users
                    </div>
                    <div class="flex items-center space-x-2">
                        <button
                            @click="previousPage"
                            :disabled="currentPage === 1"
                            class="px-3 py-1 text-sm text-zinc-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            Previous
                        </button>
                        <div class="flex space-x-1">
                            <button
                                v-for="page in displayedPages"
                                :key="page"
                                @click="goToPage(page)"
                                class="px-3 py-1 text-sm rounded-md transition-all duration-200"
                                :class="
                                    currentPage === page
                                        ? 'bg-purple-600 text-white'
                                        : 'text-zinc-400 hover:text-white'
                                "
                            >
                                {{ page }}
                            </button>
                        </div>
                        <button
                            @click="nextPage"
                            :disabled="currentPage === pagination.totalPages"
                            class="px-3 py-1 text-sm text-zinc-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- User Modal -->
        <template v-if="isSuperAdmin">
            <NormalModal
                v-if="showModal"
                :title="editingUser ? 'Edit User' : 'Add New User'"
                @close="closeModal"
            >
                <form @submit.prevent="saveUser" class="space-y-4">
                    <div>
                        <label
                            class="block text-sm font-medium text-zinc-400 mb-1"
                            >Name</label
                        >
                        <input
                            type="text"
                            v-model="userForm.name"
                            class="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                            required
                        />
                    </div>

                    <div>
                        <label
                            class="block text-sm font-medium text-zinc-400 mb-1"
                            >Email</label
                        >
                        <input
                            type="email"
                            v-model="userForm.email"
                            :disabled="editingUser"
                            class="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300 disabled:opacity-50"
                            required
                        />
                    </div>

                    <div v-if="!editingUser">
                        <label
                            class="block text-sm font-medium text-zinc-400 mb-1"
                            >Password</label
                        >
                        <input
                            type="password"
                            v-model="userForm.password"
                            class="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                            required
                        />
                    </div>

                    <div>
                        <label
                            class="block text-sm font-medium text-zinc-400 mb-1"
                            >Profile Picture</label
                        >
                        <input
                            type="file"
                            @change="handleFileUpload"
                            accept="image/*"
                            class="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                        />
                    </div>

                    <div class="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            @click="closeModal"
                            class="px-4 py-2 border border-zinc-600 rounded-lg text-zinc-300 hover:bg-zinc-800 transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200"
                            :disabled="loading"
                        >
                            {{ editingUser ? 'Update User' : 'Add User' }}
                        </button>
                    </div>
                </form>
            </NormalModal>

            <!-- Delete Confirmation Modal -->
            <NormalModal
                v-if="showDeleteModal"
                title="Confirm Delete"
                @close="closeDeleteModal"
            >
                <div class="p-4">
                    <p class="text-zinc-300">
                        Are you sure you want to delete user "{{
                            userToDelete?.name
                        }}"? This action cannot be undone.
                    </p>
                    <div class="flex justify-end space-x-3 mt-6">
                        <button
                            @click="closeDeleteModal"
                            class="px-4 py-2 border border-zinc-600 rounded-lg text-zinc-300 hover:bg-zinc-800 transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            @click="deleteUser"
                            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
                            :disabled="loading"
                        >
                            Delete User
                        </button>
                    </div>
                </div>
            </NormalModal>
        </template>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import NormalModal from '@/components/NormalModal.vue'
import axiosInstance from '@/utils/axios'

// Auth Store
const authStore = useAuthStore()

// Computed Properties
const isSuperAdmin = computed(() => {
    return authStore.user?.user?.Role?.name === 'superadmin'
})

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => startIndex.value + itemsPerPage.value)

const displayedPages = computed(() => {
    const maxVisiblePages = 5
    let startPage = Math.max(
        1,
        currentPage.value - Math.floor(maxVisiblePages / 2),
    )
    let endPage = Math.min(
        pagination.value.totalPages,
        startPage + maxVisiblePages - 1,
    )

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    const pages = []
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
    }
    return pages
})

// State Management
const loading = ref(false)
const error = ref(null)
const users = ref([])
const roles = ref([])
const currentPage = ref(1)
const itemsPerPage = ref(10)
const showModal = ref(false)
const showDeleteModal = ref(false)
const editingUser = ref(null)
const userToDelete = ref(null)
const selectedFile = ref(null)

const pagination = ref({
    total: 0,
    page: 1,
    totalPages: 0,
})

const filters = ref({
    search: '',
    role: '',
})

const userForm = ref({
    name: '',
    email: '',
    password: '',
})

// API Methods
const fetchUsers = async () => {
    try {
        loading.value = true
        error.value = null

        const params = {
            page: currentPage.value,
            limit: itemsPerPage.value,
            ...(filters.value.search && { search: filters.value.search }),
            ...(filters.value.role && { role: filters.value.role }),
        }

        const response = await axiosInstance.get('/users', { params })

        if (response.data?.data) {
            users.value = response.data.data.users.map(user => ({
                ...user,
                Role: { name: user.role },
            }))
            pagination.value = response.data.data.pagination
        }
    } catch (err) {
        console.error('Error fetching users:', err)
        if (err.response?.status === 403) {
            error.value = 'You do not have permission to view users'
        } else {
            error.value = err.response?.data?.message || 'Failed to fetch users'
        }
        users.value = []
    } finally {
        loading.value = false
    }
}

const fetchRoles = async () => {
    try {
        const response = await axiosInstance.get('/roles')
        roles.value = response.data.data || []
    } catch (err) {
        console.error('Error fetching roles:', err)
        error.value = err.response?.data?.message || 'Failed to fetch roles'
        roles.value = []
    }
}

// User Management Methods
const openAddUserModal = () => {
    if (!isSuperAdmin.value) return

    editingUser.value = null
    error.value = null
    userForm.value = {
        name: '',
        email: '',
        password: '',
    }
    selectedFile.value = null
    showModal.value = true
}

const editUser = user => {
    if (!isSuperAdmin.value) return

    editingUser.value = user
    error.value = null
    userForm.value = {
        name: user.name,
        email: user.email,
        phone_number: user.phone_number || '',
    }
    selectedFile.value = null
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    editingUser.value = null
    selectedFile.value = null
    error.value = null
    userForm.value = {
        name: '',
        email: '',
        password: '',
    }
}

const saveUser = async () => {
    if (!isSuperAdmin.value) return

    try {
        loading.value = true
        error.value = null

        const formData = new FormData()

        // Add form fields to FormData
        Object.entries(userForm.value).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                formData.append(key, value)
            }
        })

        // Add profile picture if selected
        if (selectedFile.value) {
            formData.append('profile_picture', selectedFile.value)
        }

        if (editingUser.value) {
            await axiosInstance.put(`/users/${editingUser.value.id}`, formData)
        } else {
            await axiosInstance.post('/users', formData)
        }

        await fetchUsers()
        closeModal()
    } catch (err) {
        console.error('Error saving user:', err)
        error.value = err.response?.data?.message || 'Failed to save user'
    } finally {
        loading.value = false
    }
}

// Delete Management Methods
const confirmDeleteUser = user => {
    if (!isSuperAdmin.value) return

    userToDelete.value = user
    showDeleteModal.value = true
}

const closeDeleteModal = () => {
    showDeleteModal.value = false
    userToDelete.value = null
    error.value = null
}

const deleteUser = async () => {
    if (!isSuperAdmin.value || !userToDelete.value) return

    try {
        loading.value = true
        error.value = null

        await axiosInstance.delete(`/users/${userToDelete.value.id}`)
        await fetchUsers()
        closeDeleteModal()
    } catch (err) {
        console.error('Error deleting user:', err)
        error.value = err.response?.data?.message || 'Failed to delete user'
    } finally {
        loading.value = false
    }
}

// File Handling Method
const handleFileUpload = event => {
    const file = event.target.files[0]
    if (file) {
        // 2MB limit
        if (file.size > 2 * 1024 * 1024) {
            error.value = 'File size should not exceed 2MB'
            event.target.value = ''
            return
        }
        selectedFile.value = file
    }
}

// Pagination Methods
const previousPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--
        fetchUsers()
    }
}

const nextPage = () => {
    if (currentPage.value < pagination.value.totalPages) {
        currentPage.value++
        fetchUsers()
    }
}

const goToPage = page => {
    currentPage.value = page
    fetchUsers()
}

// Search and Filter Methods
let searchTimeout
const handleSearch = () => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
        currentPage.value = 1
        fetchUsers()
    }, 300)
}

const handleFilters = () => {
    currentPage.value = 1
    fetchUsers()
}

// Helper Methods
const getUserInitials = name => {
    if (!name) return ''
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
}

const getRoleClass = role => {
    if (!role) return 'bg-blue-900/30 text-blue-400 border-blue-700/50'

    const baseClasses = 'px-3 py-1 text-xs font-medium rounded-full border'
    const roleClasses = {
        superadmin: 'bg-red-900/30 text-red-400 border-red-700/50',
        admin: 'bg-purple-900/30 text-purple-400 border-purple-700/50',
        user: 'bg-blue-900/30 text-blue-400 border-blue-700/50',
    }
    return `${baseClasses} ${roleClasses[role.toLowerCase()] || roleClasses.user}`
}

const formatDate = date => {
    if (!date) return '-'

    const dateObj = new Date(date)

    if (isNaN(dateObj.getTime())) {
        return '-'
    }

    return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

// Component Initialization
onMounted(() => {
    Promise.all([fetchUsers(), fetchRoles()])
})
</script>
