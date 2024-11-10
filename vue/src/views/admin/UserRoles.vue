<template>
    <div class="min-h-screen bg-black p-28">
        <!-- Header -->
        <div class="mb-8 flex justify-between items-center">
            <div>
                <h1 class="text-3xl font-bold text-white tracking-wider uppercase">
                    Role Management
                </h1>
                <p class="text-zinc-400 mt-1 tracking-wide">
                    Manage user roles and permissions
                </p>
            </div>
            <button
                v-if="isSuperAdmin"
                @click="openAddRoleModal"
                class="bg-purple-600 text-white px-4 py-2.5 rounded-lg hover:bg-purple-700 transition-all duration-300 flex items-center space-x-2"
            >
                <svg
                    class="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                >
                    <path
                        d="M12 4v16m8-8H4"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
                <span>Add Role</span>
            </button>
        </div>

        <!-- Roles Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
                v-for="role in roles"
                :key="role.id"
                class="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden hover:border-purple-500/50 transition-all duration-300"
            >
                <!-- Role Header -->
                <div class="p-6 border-b border-zinc-800">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center space-x-4">
                            <div class="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                                <svg
                                    class="w-6 h-6 text-white"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <path
                                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h3 class="text-lg font-medium text-white capitalize">
                                    {{ role.name }}
                                </h3>
                                <p class="text-sm text-zinc-400">
                                    {{ role.Users?.length || 0 }} users assigned
                                </p>
                            </div>
                        </div>

                        <!-- Role Actions (Superadmin only) -->
                        <div v-if="isSuperAdmin && !isSystemRole(role.name)" class="flex space-x-2">
                            <button
                                @click="editRole(role)"
                                class="p-2 text-purple-400 hover:text-purple-300 transition-colors"
                                title="Edit Role"
                            >
                                <svg
                                    class="w-5 h-5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <path
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            </button>
                            <button
                                @click="confirmDeleteRole(role)"
                                class="p-2 text-red-400 hover:text-red-300 transition-colors"
                                title="Delete Role"
                            >
                                <svg
                                    class="w-5 h-5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <path
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <p class="text-sm text-zinc-300">{{ role.description || 'No description available' }}</p>
                </div>

                <!-- Role Users -->
                <div class="p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h4 class="text-sm font-medium text-zinc-400">Members</h4>
                        <button
                            v-if="isSuperAdmin"
                            @click="openManageUsers(role)"
                            class="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                        >
                            Manage Members
                        </button>
                    </div>

                    <!-- User List -->
                    <div class="space-y-3">
                        <div
                            v-for="user in role.Users?.slice(0, 3)"
                            :key="user.id"
                            class="flex items-center space-x-3"
                        >
                            <!-- User Avatar -->
                            <div
                                v-if="user.profile_picture"
                                class="h-8 w-8 rounded-lg overflow-hidden"
                            >
                                <img
                                    :src="getImageUrl(user.profile_picture)"
                                    :alt="user.name"
                                    class="h-full w-full object-cover"
                                />
                            </div>
                            <div
                                v-else
                                class="h-8 w-8 rounded-lg bg-purple-600/20 flex items-center justify-center"
                            >
                                <span class="text-purple-400 text-sm font-medium">
                                    {{ getInitials(user.name) }}
                                </span>
                            </div>

                            <!-- User Info -->
                            <div class="flex-1 min-w-0">
                                <p class="text-sm text-white truncate">
                                    {{ user.name }}
                                </p>
                                <p class="text-xs text-zinc-400 truncate">
                                    {{ user.email }}
                                </p>
                            </div>
                        </div>

                        <!-- Show more users indicator -->
                        <div
                            v-if="role.Users?.length > 3"
                            class="text-sm text-zinc-400 pt-2"
                        >
                            And {{ role.Users.length - 3 }} more members
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add/Edit Role Modal -->
        <NormalModal
            v-if="showRoleModal"
            :title="editingRole ? 'Edit Role' : 'Add New Role'"
            @close="closeRoleModal"
        >
            <form @submit.prevent="saveRole" class="space-y-4">
                <!-- Role Name -->
                <div>
                    <label class="block text-sm font-medium text-zinc-400 mb-1">
                        Role Name
                    </label>
                    <input
                        v-model="roleForm.name"
                        type="text"
                        required
                        class="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                </div>

                <!-- Description -->
                <div>
                    <label class="block text-sm font-medium text-zinc-400 mb-1">
                        Description
                    </label>
                    <textarea
                        v-model="roleForm.description"
                        rows="3"
                        class="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    ></textarea>
                </div>

                <!-- Modal Actions -->
                <div class="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        @click="closeRoleModal"
                        class="px-4 py-2 text-zinc-300 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        :disabled="loading"
                    >
                        {{ editingRole ? 'Update Role' : 'Create Role' }}
                    </button>
                </div>
            </form>
        </NormalModal>

        <!-- Manage Users Modal -->
        <NormalModal
            v-if="showUsersModal"
            :title="`Manage ${selectedRole?.name} Users`"
            @close="closeUsersModal"
        >
            <div class="space-y-4">
                <!-- Search Users -->
                <div class="relative">
                    <input
                        type="text"
                        v-model="searchQuery"
                        placeholder="Search users..."
                        class="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 pr-10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                    <svg
                        class="w-5 h-5 text-zinc-400 absolute right-3 top-3"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                    >
                        <path
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                </div>

                <!-- User List -->
                <div class="max-h-96 overflow-y-auto space-y-2">
                    <div
                        v-for="user in filteredUsers"
                        :key="user.id"
                        class="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg"
                    >
                        <div class="flex items-center space-x-3">
                            <!-- User Avatar -->
                            <div
                                v-if="user.profile_picture"
                                class="h-10 w-10 rounded-lg overflow-hidden"
                            >
                                <img
                                    :src="getImageUrl(user.profile_picture)"
                                    :alt="user.name"
                                    class="h-full w-full object-cover"
                                />
                            </div>
                            <div
                                v-else
                                class="h-10 w-10 rounded-lg bg-purple-600/20 flex items-center justify-center"
                            >
                                <span class="text-purple-400 text-sm font-medium">
                                    {{ getInitials(user.name) }}
                                </span>
                            </div>

                            <div>
                                <p class="text-sm font-medium text-white">
                                    {{ user.name }}
                                </p>
                                <p class="text-xs text-zinc-400">
                                    {{ user.email }}
                                </p>
                            </div>
                        </div>

                        <button
                            v-if="canManageUserRole(user)"
                            @click="toggleUserRole(user)"
                            :class="[
                                'px-3 py-1.5 rounded-lg text-sm transition-colors',
                                isUserInRole(user)
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                            ]"
                        >
                            {{ isUserInRole(user) ? 'Remove' : 'Add' }}
                        </button>
                    </div>
                </div>
            </div>
        </NormalModal>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import NormalModal from '@/components/NormalModal.vue'
import axiosInstance from '@/utils/axios'

// Store and state
const authStore = useAuthStore()
const roles = ref([])
const users = ref([])
const loading = ref(false)
const showRoleModal = ref(false)
const showUsersModal = ref(false)
const editingRole = ref(null)
const selectedRole = ref(null)
const searchQuery = ref('')

// Form state
const roleForm = ref({
    name: '',
    description: ''
})

// Computed
const isSuperAdmin = computed(() => {
    return authStore.user?.Role?.name === 'superadmin'
})

const filteredUsers = computed(() => {
    if (!searchQuery.value) return users.value

    const query = searchQuery.value.toLowerCase()
    return users.value.filter(user =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    )
})

// Methods - API Calls
const fetchRoles = async () => {
    try {
        loading.value = true
        const response = await axiosInstance.get('/roles')
        roles.value = response.data.data
    } catch (error) {
        console.error('Error fetching roles:', error)
        showError('Failed to fetch roles')
    } finally {
        loading.value = false
    }
}

const fetchUsers = async () => {
    try {
        loading.value = true
        const response = await axiosInstance.get('/users', {
            params: {
                limit: 100 // Adjust based on your needs
            }
        })
        users.value = response.data.data.users
    } catch (error) {
        console.error('Error fetching users:', error)
        showError('Failed to fetch users')
    } finally {
        loading.value = false
    }
}

// Role CRUD Operations
const saveRole = async () => {
    try {
        loading.value = true
        if (editingRole.value) {
            // Update existing role
            await axiosInstance.put(`/roles/${editingRole.value.id}`, {
                name: roleForm.value.name,
                description: roleForm.value.description
            })
            showSuccess('Role updated successfully')
        } else {
            // Create new role
            await axiosInstance.post('/roles', {
                name: roleForm.value.name,
                description: roleForm.value.description
            })
            showSuccess('Role created successfully')
        }
        await fetchRoles()
        closeRoleModal()
    } catch (error) {
        console.error('Error saving role:', error)
        showError(error.response?.data?.message || 'Failed to save role')
    } finally {
        loading.value = false
    }
}

const confirmDeleteRole = async (role) => {
    try {
        if (!confirm(`Are you sure you want to delete the ${role.name} role? This action cannot be undone.`)) {
            return
        }

        loading.value = true
        await axiosInstance.delete(`/roles/${role.id}`)
        showSuccess('Role deleted successfully')
        await fetchRoles()
    } catch (error) {
        console.error('Error deleting role:', error)
        showError(error.response?.data?.message || 'Failed to delete role')
    } finally {
        loading.value = false
    }
}

// User Role Management
const toggleUserRole = async (user) => {
    if (!selectedRole.value || !canManageUserRole(user)) return

    try {
        loading.value = true
        await axiosInstance.post('/roles/assign', {
            userId: user.id,
            roleId: isUserInRole(user) ? 1 : selectedRole.value.id // 1 is assumed to be default user role
        })

        await Promise.all([fetchRoles(), fetchUsers()])
        showSuccess('User role updated successfully')
    } catch (error) {
        console.error('Error updating user role:', error)
        showError(error.response?.data?.message || 'Failed to update user role')
    } finally {
        loading.value = false
    }
}

// Modal Management
const openAddRoleModal = () => {
    editingRole.value = null
    roleForm.value = {
        name: '',
        description: ''
    }
    showRoleModal.value = true
}

const editRole = (role) => {
    editingRole.value = role
    roleForm.value = {
        name: role.name,
        description: role.description
    }
    showRoleModal.value = true
}

const closeRoleModal = () => {
    showRoleModal.value = false
    editingRole.value = null
    roleForm.value = {
        name: '',
        description: ''
    }
}

const openManageUsers = async (role) => {
    selectedRole.value = role
    showUsersModal.value = true
    await fetchUsers()
}

const closeUsersModal = () => {
    showUsersModal.value = false
    selectedRole.value = null
    searchQuery.value = ''
}

// Utility Functions
const isSystemRole = (roleName) => {
    return ['superadmin', 'user'].includes(roleName.toLowerCase())
}

const canManageUserRole = (user) => {
    if (user.Role?.name === 'superadmin') return false
    if (user.id === authStore.user?.id) return false
    return true
}

const isUserInRole = (user) => {
    return selectedRole.value?.Users?.some(u => u.id === user.id)
}

const getImageUrl = (url) => {
    if (!url) return null
    return `${import.meta.env.VITE_API_URL}/${url}`
}

const getInitials = (name) => {
    return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
}

// Toast notifications - implement based on your toast system
const showSuccess = (message) => {
    // Implement based on your toast system
    console.log('Success:', message)
}

const showError = (message) => {
    // Implement based on your toast system
    console.error('Error:', message)
}

// Lifecycle Hooks
onMounted(async () => {
    await fetchRoles()
})

// Exports (if needed)
defineExpose({
    fetchRoles,
    openAddRoleModal,
    closeRoleModal
})
</script>

<style scoped>
/* Custom scrollbar styling */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: #18181b;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb {
    background: #3f3f46;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: #52525b;
}

/* Role card hover effects */
.role-card {
    transition: all 0.3s ease-in-out;
}

.role-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(147, 51, 234, 0.1);
}

/* Loading state styles */
.loading-overlay {
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
}
</style>
