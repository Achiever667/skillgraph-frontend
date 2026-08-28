<script setup lang="ts">
import { Loader2Icon } from 'lucide-vue-next';

withDefaults(defineProps<{
  text?: string;
  fullScreen?: boolean;
}>(), {
  text: 'Loading...',
  fullScreen: false
});
</script>

<template>
  <div 
    class="flex flex-col items-center justify-center p-8 space-y-4"
    :class="{ 'min-h-[60vh]': fullScreen }"
  >
    <div class="relative">
      <div class="absolute inset-0 rounded-full blur-md bg-indigo-200 animate-pulse"></div>
      <Loader2Icon class="relative w-10 h-10 text-indigo-600 animate-spin" />
    </div>
    <p class="text-sm font-medium text-gray-500 animate-pulse">{{ text }}</p>
  </div>
</template>
