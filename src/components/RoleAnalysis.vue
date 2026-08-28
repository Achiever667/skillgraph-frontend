<script setup lang="ts">
import { useGraphStore } from '../stores/graphStore';
import { computed } from 'vue';
import UiEmptyState from './ui/empty/UiEmptyState.vue';
import UiLoading from './ui/loading/UiLoading.vue';

const store = useGraphStore();

const missingSkills = computed(() => {
  return store.roleAnalysis.filter(a => !a.hasSkill);
});

const acquiredSkills = computed(() => {
  return store.roleAnalysis.filter(a => a.hasSkill);
});
</script>

<template>
  <div class="mt-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Role Analysis: {{ store.selectedRole?.name }}</h2>
    
    <div v-if="store.loading" class="text-gray-500 py-4">
     <UiLoading  />
    </div>
    
    <div v-else-if="store.roleAnalysis.length > 0">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <!-- Missing Skills -->
        <div>
          <h3 class="text-lg font-medium text-red-600 mb-3 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            Missing Skills
          </h3>
          <ul class="space-y-4">
            <li v-for="skill in missingSkills" :key="skill.skill" class="bg-red-50 p-4 rounded border border-red-100">
              <div class="font-semibold text-gray-900">{{ skill.skill }}</div>
              <div class="text-sm text-gray-500 mb-2">{{ skill.category }}</div>
              
              <div v-if="skill.recommendedTechnologies.length > 0">
                <div class="text-xs font-medium text-gray-500 uppercase tracking-wide mt-2 mb-1">Recommended Tech:</div>
                <div class="flex flex-wrap gap-2">
                  <span v-for="tech in skill.recommendedTechnologies" :key="tech" class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {{ tech }}
                  </span>
                </div>
              </div>
            </li>
            <li v-if="missingSkills.length === 0" class="mt-4">
              <UiEmptyState title="All Set!" description="No missing skills! You have all the required skills for this role." />
            </li>
          </ul>
        </div>

        <!-- Acquired Skills -->
        <div>
          <h3 class="text-lg font-medium text-green-600 mb-3 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Acquired Skills
          </h3>
          <ul class="space-y-3">
            <li v-for="skill in acquiredSkills" :key="skill.skill" class="flex justify-between items-center bg-green-50 p-3 rounded border border-green-100">
              <span class="font-medium text-gray-800">{{ skill.skill }}</span>
              <span class="text-xs text-gray-500">{{ skill.category }}</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
    
    <div v-else class="py-4">
      <UiEmptyState title="No Requirements" description="No requirements found for this role." />
    </div>
  </div>
</template>
