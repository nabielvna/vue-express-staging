<template>
    <div class="min-h-screen bg-black p-28">
        <!-- Header -->
        <div class="mb-8 flex justify-between items-center">
            <div>
                <h1
                    class="text-3xl font-bold text-white tracking-wider uppercase"
                >
                    Roles
                </h1>
                <p class="text-zinc-400 mt-1 tracking-wide">
                    Manage user roles and permissions
                </p>
            </div>
            <button
                @click="openAddRoleModal"
                class="bg-purple-600 text-white px-4 py-2.5 rounded-lg hover:bg-purple-700 transition-all duration-300 flex items-center space-x-2 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black"
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
                v-for="role in rolesData"
                :key="role.id"
                class="group bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden hover:border-purple-500/50 transition-all duration-300"
            >
                <!-- Role Header -->
                <div class="p-6 border-b border-zinc-800">
                    <div class="flex items-center space-x-4 mb-4">
                        <div
                            class="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center"
                        >
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
                            <h3
                                class="text-lg font-medium text-white group-hover:text-purple-400 transition-colors duration-300"
                            >
                                {{ role.name }}
                            </h3>
                            <p class="text-sm text-zinc-400">
                                {{ role.usersCount }} users assigned
                            </p>
                        </div>
                    </div>
                    <p class="text-sm text-zinc-300">{{ role.description }}</p>
                </div>

                <!-- Permissions -->
                <div class="p-6 bg-zinc-900/50">
                    <h4 class="text-sm font-medium text-zinc-400 mb-3">
                        Permissions
                    </h4>
                    <div class="grid grid-cols-2 gap-2">
                        <div
                            v-for="(permission, index) in displayedPermissions(
                                role.permissions,
                            )"
                            :key="index"
                            class="flex items-center space-x-2 text-sm"
                        >
                            <svg
                                class="w-4 h-4 text-purple-400"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                            >
                                <path
                                    d="M9 12l2 2 4-4"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                            <span class="text-zinc-300">{{
                                formatPermission(permission)
                            }}</span>
                        </div>
                    </div>
                    <div v-if="role.permissions.length > 6" class="mt-2">
                        <button
                            class="text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200"
                        >
                            +{{ role.permissions.length - 6 }} more permissions
                        </button>
                    </div>
                </div>

                <!-- Stats -->
                <div class="px-6 py-4 border-t border-zinc-800">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="text-center p-3 bg-zinc-800/50 rounded-lg">
                            <span class="text-sm text-zinc-400"
                                >Total Users</span
                            >
                            <p class="mt-1 text-lg font-mono text-white">
                                {{ role.usersCount }}
                            </p>
                        </div>
                        <div class="text-center p-3 bg-zinc-800/50 rounded-lg">
                            <span class="text-sm text-zinc-400"
                                >Permissions</span
                            >
                            <p class="mt-1 text-lg font-mono text-white">
                                {{ role.permissions.length }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div
                    class="px-6 py-4 border-t border-zinc-800 flex justify-end space-x-3"
                >
                    <button
                        @click="editRole(role)"
                        class="text-purple-400 hover:text-purple-300 transition-colors duration-200 text-sm flex items-center space-x-1"
                        :disabled="role.name === 'Super Admin'"
                    >
                        <svg
                            class="w-4 h-4"
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
                        <span>Edit</span>
                    </button>
                    <button
                        @click="deleteRole(role.id)"
                        class="text-red-400 hover:text-red-300 transition-colors duration-200 text-sm flex items-center space-x-1"
                        :disabled="role.name === 'Super Admin'"
                    >
                        <svg
                            class="w-4 h-4"
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
                        <span>Delete</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Role Modal -->
        <div
            v-if="showModal"
            class="fixed inset-0 z-50 overflow-y-auto"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            <div
                class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
            >
                <!-- Background overlay -->
                <div
                    class="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
                    aria-hidden="true"
                ></div>

                <div
                    class="inline-block align-bottom bg-zinc-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                >
                    <div class="bg-zinc-900 px-4 pt-5 pb-4 sm:p-6">
                        <h3 class="text-lg font-medium text-white mb-4">
                            {{ editingRole ? 'Edit Role' : 'Add New Role' }}
                        </h3>

                        <form @submit.prevent="saveRole" class="space-y-4">
                            <!-- Name -->
                            <div>
                                <label
                                    class="block text-sm font-medium text-zinc-400 mb-1"
                                >
                                    Role Name
                                </label>
                                <input
                                    type="text"
                                    v-model="roleForm.name"
                                    class="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                                    required
                                />
                            </div>

                            <!-- Description -->
                            <div>
                                <label
                                    class="block text-sm font-medium text-zinc-400 mb-1"
                                >
                                    Description
                                </label>
                                <textarea
                                    v-model="roleForm.description"
                                    rows="3"
                                    class="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                                    required
                                ></textarea>
                            </div>

                            <!-- Permissions -->
                            <div>
                                <label
                                    class="block text-sm font-medium text-zinc-400 mb-1"
                                >
                                    Permissions
                                </label>
                                <div
                                    class="space-y-2 max-h-60 overflow-y-auto px-2"
                                >
                                    <div
                                        v-for="permission in availablePermissions"
                                        :key="permission.id"
                                        class="flex items-center"
                                    >
                                        <input
                                            type="checkbox"
                                            :id="permission.id"
                                            :value="permission.id"
                                            v-model="roleForm.permissions"
                                            class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-zinc-600 rounded bg-black"
                                        />
                                        <label
                                            :for="permission.id"
                                            class="ml-2 text-sm text-zinc-300"
                                        >
                                            {{ permission.name }}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div
                        class="bg-zinc-800/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
                    >
                        <button
                            @click="saveRole"
                            class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200"
                        >
                            {{ editingRole ? 'Save Changes' : 'Add Role' }}
                        </button>
                        <button
                            @click="closeModal"
                            class="mt-3 w-full inline-flex justify-center rounded-lg border border-zinc-600 shadow-sm px-4 py-2 bg-black text-base font-medium text-zinc-300 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { rolesData, availablePermissions } from './MenuConfig'

// Modal and Form
const showModal = ref(false)
const editingRole = ref(null)
const roleForm = ref({
    name: '',
    description: '',
    permissions: [],
})

// Methods
const formatPermission = permission => {
    return permission
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

const displayedPermissions = permissions => {
    return permissions.slice(0, 6)
}

const openAddRoleModal = () => {
    editingRole.value = null
    roleForm.value = {
        name: '',
        description: '',
        permissions: [],
    }
    showModal.value = true
}

const editRole = role => {
    if (role.name === 'Super Admin') {
        alert('The Super Admin role cannot be edited.')
        return
    }
    editingRole.value = role
    roleForm.value = {
        name: role.name,
        description: role.description,
        permissions: [...role.permissions],
    }
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    editingRole.value = null
    roleForm.value = {
        name: '',
        description: '',
        permissions: [],
    }
}

const saveRole = () => {
    if (editingRole.value) {
        // Update existing role
        const index = rolesData.findIndex(r => r.id === editingRole.value.id)
        if (index !== -1) {
            rolesData[index] = {
                ...rolesData[index],
                ...roleForm.value,
            }
        }
    } else {
        // Add new role
        const newRole = {
            id: rolesData.length + 1,
            ...roleForm.value,
            usersCount: 0,
            createdAt: new Date().toISOString().split('T')[0],
        }
        rolesData.push(newRole)
    }
    closeModal()
}

const deleteRole = roleId => {
    const role = rolesData.find(r => r.id === roleId)
    if (role.name === 'Super Admin') {
        alert('The Super Admin role cannot be deleted.')
        return
    }

    if (
        confirm(
            `Are you sure you want to delete the ${role.name} role? This will affect all users assigned to this role.`,
        )
    ) {
        const index = rolesData.findIndex(r => r.id === roleId)
        if (index !== -1) {
            rolesData.splice(index, 1)
        }
    }
}
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

/* Checkbox custom styling */
input[type='checkbox'] {
    appearance: none;
    -webkit-appearance: none;
    width: 1rem;
    height: 1rem;
    border: 1px solid #3f3f46;
    border-radius: 0.25rem;
    background-color: transparent;
    display: inline-block;
    position: relative;
    margin-top: 0;
    margin-right: 0.5rem;
    cursor: pointer;
}

input[type='checkbox']:checked {
    background-color: #9333ea;
    border-color: #9333ea;
}

input[type='checkbox']:checked::after {
    content: '';
    position: absolute;
    left: 4px;
    top: 1px;
    width: 4px;
    height: 8px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}

input[type='checkbox']:focus {
    outline: none;
    ring: 2px;
    ring-color: #9333ea;
}

/* Modal transition */
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

/* Role card hover effects */
.group:hover .role-icon {
    transform: scale(1.05);
    transition: transform 0.3s ease-in-out;
}

/* Font settings */
.font-mono {
    font-family: 'JetBrains Mono', monospace;
}

/* Permission list scrollbar */
.permission-list {
    scrollbar-width: thin;
    scrollbar-color: #3f3f46 #18181b;
}

/* Card hover animations */
.role-card {
    transition:
        transform 0.3s ease-in-out,
        box-shadow 0.3s ease-in-out;
}

.role-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(147, 51, 234, 0.1);
}

/* Disabled button states */
button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Permission badge styles */
.permission-badge {
    background: rgba(147, 51, 234, 0.1);
    border: 1px solid rgba(147, 51, 234, 0.2);
    transition: all 0.2s ease-in-out;
}

.permission-badge:hover {
    background: rgba(147, 51, 234, 0.15);
    border-color: rgba(147, 51, 234, 0.3);
}

/* Critical permission highlight */
.critical-permission {
    border-left: 2px solid #9333ea;
}

/* Role stats animation */
.stats-value {
    transition: color 0.2s ease-in-out;
}

.group:hover .stats-value {
    color: #9333ea;
}

/* Loading state styles */
.loading-overlay {
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
}

/* Permission group divider */
.permission-group-divider {
    border-color: rgba(147, 51, 234, 0.2);
}
</style>
