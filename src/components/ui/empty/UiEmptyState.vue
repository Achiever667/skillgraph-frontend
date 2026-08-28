<script setup lang="ts">
import { InboxIcon } from 'lucide-vue-next';

withDefaults(defineProps<{
  title?: string;
  description?: string;
}>(), {
  title: 'No Data Available',
  description: 'There is no data to display here yet.',
});
</script>

<template>
  <div class="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-gray-50/50 border border-dashed border-gray-200">
    <div class="w-16 h-16 mb-4 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100">
      <slot name="icon">
        <InboxIcon class="w-8 h-8 text-gray-400" />
      </slot>
    </div>
    
    <h3 class="text-lg font-semibold text-gray-900 mb-1">
      {{ title }}
    </h3>
    
    <p class="text-sm text-gray-500 max-w-sm mx-auto">
      {{ description }}
    </p>
    
    <div v-if="$slots.action" class="mt-6">
      <slot name="action" />
    </div>
  </div>
</template>
