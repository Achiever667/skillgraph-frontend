<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useGraphStore } from '../stores/graphStore';
import MainLayout from '../layouts/MainLayout.vue';
import RoleAnalysis from '../components/RoleAnalysis.vue';
import UiSelect from '../components/ui/select/UiSelect.vue';
import UiLoading from '../components/ui/loading/UiLoading.vue';
import UiEmptyState from '../components/ui/empty/UiEmptyState.vue';
import { NetworkIcon, UserIcon, BriefcaseIcon } from 'lucide-vue-next';

const store = useGraphStore();

onMounted(async () => {
  await store.fetchUsers();
  await store.fetchRoles();
});

const userOptions = computed(() => {
  return store.users.map(u => ({ label: `${u.name} (${u.email})`, value: u.id }));
});

const roleOptions = computed(() => {
  return store.roles.map(r => ({ label: r.name, value: r.id }));
});
</script>

<template>
  <MainLayout>
    <div v-if="store.error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center shadow-sm">
      <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      {{ store.error }}
    </div>

    <!-- Page Header -->
    <header class="mb-10 text-center max-w-2xl mx-auto">
      <h1 class="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
        Discover Your <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Career Trajectory</span>
      </h1>
      <p class="text-lg text-slate-500">
        Map your current skills against industry roles and leverage our graph engine to identify the optimal learning path.
      </p>
    </header>

    <div v-if="store.users.length === 0 || store.roles.length === 0">
      <UiLoading v-if="!store.error" text="Initializing Graph Engine..." fullScreen />
    </div>

    <div v-else class="space-y-8">
      
      <!-- Selectors Card -->
      <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          
          <!-- User Profile Section -->
          <div class="flex flex-col gap-5 pt-6 md:pt-0 first:pt-0">
            <div class="flex items-center gap-2 mb-2 text-indigo-600">
              <UserIcon class="w-5 h-5" />
              <h2 class="font-semibold text-slate-900">1. Select Persona</h2>
            </div>
            
            <UiSelect
              label="Acting As Developer"
              :options="userOptions"
              :modelValue="store.selectedUser?.id ?? null"
              @update:modelValue="val => store.selectUser(store.users.find(u => u.id === val)!)"
              placeholder="Choose a user profile..."
              variant="outlined"
            />
            
            <div v-if="store.selectedUser" class="mt-2 bg-slate-50 rounded-xl p-5 border border-slate-100">
              <div class="flex items-center justify-between mb-3">
                <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider">Acquired Skills</h4>
                <span class="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  {{ store.userSkills.length }}
                </span>
              </div>
              
              <div v-if="store.userSkills.length > 0" class="flex flex-wrap gap-2">
                <span v-for="skill in store.userSkills" :key="skill.id" 
                      class="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 text-sm rounded-lg shadow-sm">
                  {{ skill.name }}
                </span>
              </div>
              <div v-else class="text-sm text-slate-400 italic">No skills documented in graph.</div>
            </div>
          </div>

          <!-- Target Role Section -->
          <div class="flex flex-col gap-5 pt-6 md:pt-0 md:pl-12">
             <div class="flex items-center gap-2 mb-2 text-violet-600">
              <BriefcaseIcon class="w-5 h-5" />
              <h2 class="font-semibold text-slate-900">2. Target Destination</h2>
            </div>

            <UiSelect
              label="Target Career Role"
              :options="roleOptions"
              :modelValue="store.selectedRole?.id ?? null"
              @update:modelValue="val => store.selectRole(store.roles.find(r => r.id === val)!)"
              placeholder="Select destination role..."
              variant="outlined"
            />
            
            <div v-if="store.selectedRole" class="mt-2 bg-violet-50/50 rounded-xl p-5 border border-violet-100">
               <h4 class="text-xs font-bold text-violet-600/80 uppercase tracking-wider mb-2">Role Overview</h4>
               <p class="text-sm text-slate-700 leading-relaxed">
                 {{ store.selectedRole.description }}
               </p>
            </div>
          </div>

        </div>
      </div>

      <!-- Analysis Section -->
      <div v-if="store.selectedRole && store.selectedUser">
        <RoleAnalysis />
      </div>
      
      <UiEmptyState 
        v-else 
        title="Ready for Analysis" 
        description="Select both a persona and a target role to visualize the learning trajectory."
      >
        <template #icon>
          <NetworkIcon class="w-8 h-8 text-indigo-400" />
        </template>
      </UiEmptyState>

    </div>
  </MainLayout>
</template>
