<template>
  <div class="p-4 md:p-6">
    <PageHeader title="Admin Management">
      <template #actions>
        <button @click="openCreateModal" class="btn btn-primary">
          Create Admin
        </button>
      </template>
    </PageHeader>

    <div v-if="branchesLoading || loading" class="flex justify-center py-10">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
    </div>
    <div v-else-if="fetchError || branchesError" class="text-center text-error-500 py-10">
        Error loading data: {{ fetchError || branchesError }}
    </div>
    <BaseTable
        v-else
        :columns="columns"
        :data="admins"
        :loading="loading"
        :totalItems="totalAdmins"
        :showPagination="true"
        :currentPage="currentPage"
        :itemsPerPage="itemsPerPage"
        @page-change="fetchAdmins"
      >
      <!-- Custom cell rendering for Status -->
      <template #cell-status="{ row }">
         <span
          :class="[
            'px-2 py-0.5 rounded text-xs font-medium',
            row.verification_status === 'verified' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400' :
            row.verification_status === 'pending' ? 'bg-warning-100 text-warning-800 dark:bg-warning-900/50 dark:text-warning-400' :
            row.verification_status === 'rejected' ? 'bg-error-100 text-error-800 dark:bg-error-900/50 dark:text-error-400' :
            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
          ]"
        >
          {{ row.verification_status }}
        </span>
         <span
            v-if="row.banned_at"
            class="ml-2 px-2 py-0.5 rounded text-xs font-medium bg-error-100 text-error-800 dark:bg-error-900/50 dark:text-error-400"
         >
             Banned
         </span>
      </template>

       <!-- Custom cell rendering for Branch -->
       <template #cell-branch="{ row }">
           {{ row.branch?.name || 'N/A' }}
       </template>

      <!-- Actions -->
      <template #actions="{ row }">
        <div class="flex justify-end space-x-2">
          <button @click="viewAdmin(row.id)" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm">View</button>
          <button @click="openEditModal(row)" class="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300 text-sm">Edit</button>
          <button v-if="!row.banned_at" @click="banAdmin(row.id)" class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm">Ban</button>
           <button v-else @click="unbanAdmin(row.id)" class="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 text-sm">Unban</button>
        </div>
      </template>
    </BaseTable>

    <!-- Create Admin Modal -->
    <BaseModal v-model="showCreateAdminModal" title="Create New Admin">
       <template #body>
          <AdminForm @submit="handleCreateAdmin" :branches="branches" />
       </template>
    </BaseModal>

    <!-- Edit Admin Modal -->
     <BaseModal v-model="showEditAdminModal" title="Edit Admin">
       <template #body>
          <AdminForm
            :initialData="editingAdminData"
            :branches="branches"
            @submit="handleUpdateAdmin"
          />
       </template>
    </BaseModal>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import PageHeader from '@/components/common/PageHeader.vue';
import BaseTable from '@/components/common/BaseTable.vue';
import BaseModal from '@/components/common/BaseModal.vue';
import AdminForm, { type AdminFormData } from '@/components/SuperAdmin/AdminForm.vue';
import { useAuthStore } from '@/stores/auth';
import apiService, { type ApiUser, type BranchData, getBranches, createAdmin, updateUser, type BackendValidationErrorResponse } from '@/services/apiService';
import { isAxiosError } from 'axios';

// Use ApiUser type for admins
type AdminUser = ApiUser;

// --- State ---
const authStore = useAuthStore();
const loading = ref(false);
const admins = ref<AdminUser[]>([]);
const totalAdmins = ref(0);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const fetchError = ref<string | null>(null);

const branches = ref<BranchData[]>([]);
const branchesLoading = ref(true);
const branchesError = ref<string | null>(null);

// --- Table Columns ---
const columns = ref([
  { key: 'fullname', label: 'Full Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'phone', label: 'Phone', sortable: true },
  { key: 'branch', label: 'Branch', sortable: false }, // Custom rendering, not directly sortable by API
  { key: 'status', label: 'Status', sortable: false }, // Custom rendering, not directly sortable by API
  { key: 'actions', label: 'Actions', sortable: false },
]);

// --- Modal State ---
const showCreateAdminModal = ref(false);
const showEditAdminModal = ref(false);
const editingAdminData = ref<Partial<AdminUser> | undefined>(undefined);

// --- Fetch Data ---
onMounted(async () => {
    await fetchBranches();
    await fetchAdmins();
});

async function fetchAdmins(page: number = currentPage.value) {
  if (!authStore.token) {
    fetchError.value = "Authentication token not found. Cannot fetch admins.";
    return;
  }
  loading.value = true;
  fetchError.value = null;
  try {
    const response = await apiService.get<{ data: ApiUser[], total: number }>(`/users?role=admin&page=${page}&limit=${itemsPerPage.value}`, authStore.token);
    admins.value = response.data;
    totalAdmins.value = response.total;
    currentPage.value = page;
  } catch (error: unknown) {
    console.error("Failed to fetch admins:", error);
    fetchError.value = error instanceof Error ? error.message : "An unknown error occurred";
    admins.value = [];
    totalAdmins.value = 0;
  } finally {
    loading.value = false;
  }
}

async function fetchBranches() {
  branchesLoading.value = true;
  branchesError.value = null;
  try {
    const token = authStore.token;
    if (!token) {
      branchesError.value = 'Authentication token missing. Cannot fetch branches.';
      return;
    }
    const response = await getBranches(token);
    branches.value = response.data;
  } catch (error: unknown) {
    console.error('Error fetching branches:', error);
    branchesError.value = error instanceof Error ? error.message : 'An unknown error occurred while fetching branches.';
  } finally {
    branchesLoading.value = false;
  }
}

// --- Modal Openers ---
const openCreateModal = () => {
    editingAdminData.value = undefined;
    showCreateAdminModal.value = true;
}

const openEditModal = (admin: AdminUser) => {
    editingAdminData.value = { ...admin };
    showEditAdminModal.value = true;
}

// --- Form Submission Handlers ---
const handleCreateAdmin = async (formData: AdminFormData) => {
    console.log("Create Admin Data:", formData);
    try {
        const payload: {
            fullname: string;
            email: string;
            phone: string;
            password: string;
            password_confirmation: string;
            branch_id: string;
        } = {
            fullname: formData.fullname,
            email: formData.email,
            phone: formData.phone,
            password: formData.password || '',
            password_confirmation: formData.password_confirmation || '',
            branch_id: formData.branch_id
        };

        const createdAdmin = await createAdmin(authStore.token as string, payload);
        console.log('Admin creation successful:', createdAdmin);
        await fetchAdmins(currentPage.value);
        alert('Admin created successfully!');
        showCreateAdminModal.value = false;

    } catch (error: unknown) {
        console.error("Admin creation failed:", error);
         if (isAxiosError(error) && error.response && error.response.data) {
             const errorData = error.response.data as BackendValidationErrorResponse;
             if (errorData.errors) {
                 alert('Validation failed. Please check the form data.');
             } else if (errorData.message) {
                 alert(`Creation failed: ${errorData.message}`);
             } else {
                 alert('An unknown error occurred during creation.');
             }
         } else if (error instanceof Error) {
             alert(`Creation failed: ${error.message}`);
         } else {
             alert('An unknown error occurred during creation.');
         }
    }
};

const handleUpdateAdmin = async (formData: AdminFormData) => {
     console.log("Update Admin Data:", formData);
     if (!formData.id) {
         console.error("Update failed: Admin ID is missing.");
         alert("Update failed: Admin ID is missing.");
         return;
     }

     try {
         const payload: Partial<{
             fullname: string;
             email: string;
             phone: string;
             branch_id: string | null;
             password?: string;
             password_confirmation?: string;
         }> = {
             fullname: formData.fullname,
             email: formData.email,
             phone: formData.phone,
             branch_id: formData.branch_id === '' ? null : formData.branch_id
         };

         if (formData.password) {
             payload.password = formData.password;
             payload.password_confirmation = formData.password_confirmation;
         }

         const updatedAdmin = await updateUser(authStore.token as string, formData.id, payload);
         console.log('Admin update successful:', updatedAdmin);
         await fetchAdmins(currentPage.value);
         alert('Admin updated successfully!');
         showEditAdminModal.value = false;
         editingAdminData.value = undefined;

     } catch (error: unknown) {
         console.error("Admin update failed:", error);
          if (isAxiosError(error) && error.response && error.response.data) {
              const errorData = error.response.data as BackendValidationErrorResponse;
              if (errorData.errors) {
                  alert('Validation failed. Please check the form data.');
              } else if (errorData.message) {
                  alert(`Update failed: ${errorData.message}`);
              } else {
                  alert('An unknown error occurred during update.');
              }
          } else if (error instanceof Error) {
              alert(`Update failed: ${error.message}`);
          } else {
              alert('An unknown error occurred during update.');
          }
     }
}

// --- Action Handlers ---
const viewAdmin = (id: string) => {
  console.log('View admin:', id);
  alert('View functionality not fully implemented yet.')
};

const banAdmin = async (id: string) => {
  console.log('Ban admin:', id);
   if (!authStore.token) {
       alert("Authentication token missing. Cannot ban admin.");
       return;
   }
   if (confirm(`Are you sure you want to ban admin ${id}?`)) {
        try {
            const response = await apiService.post(authStore.token as string, `/users/${id}/ban`, { user_id: id });
             console.log('Admin ban successful:', response);
             await fetchAdmins(currentPage.value);
             alert(`Admin ${id} has been banned.`);
        } catch (error: unknown) {
            console.error("Failed to ban admin:", error);
             if (isAxiosError(error) && error.response && error.response.data && typeof error.response.data.message === 'string'){
                  alert(`Failed to ban admin: ${error.response.data.message}`);
             } else if (error instanceof Error) {
                 alert(`Failed to ban admin: ${error.message}`);
             } else {
                 alert('An unknown error occurred while banning admin.');
             }
        }
   }
};

const unbanAdmin = async (id: string) => {
    console.log('Unban admin:', id);
     if (!authStore.token) {
         alert("Authentication token missing. Cannot unban admin.");
         return;
     }
    if (confirm(`Are you sure you want to unban admin ${id}?`)) {
         try {
             const response = await apiService.post(authStore.token as string, `/users/${id}/unban`, { user_id: id });
             console.log('Admin unban successful:', response);
             await fetchAdmins(currentPage.value);
             alert(`Admin ${id} has been unbanned.`);
         } catch (error: unknown) {
             console.error("Failed to unban admin:", error);
              if (isAxiosError(error) && error.response && error.response.data && typeof error.response.data.message === 'string'){
                  alert(`Failed to unban admin: ${error.response.data.message}`);
              } else if (error instanceof Error) {
                  alert(`Failed to unban admin: ${error.message}`);
              } else {
                  alert('An unknown error occurred while unbanning admin.');
              }
         }
    }
};

</script>

<style scoped>
/* Add simple button styling if not globally available */
/* .btn {
    @apply px-4 py-2 rounded-md font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800;
}
.btn-primary {
    @apply bg-brand-500 text-white hover:bg-brand-600 focus:ring-brand-500;
} */
</style>
