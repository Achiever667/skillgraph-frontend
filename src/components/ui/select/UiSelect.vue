<script setup lang="ts">
import { computed } from 'vue';
import { ChevronDownIcon } from 'lucide-vue-next';

interface Option {
  label: string;
  value: string | number;
  disabled?: boolean;
}

const props = withDefaults(defineProps<{
  modelValue: string | number | null;
  options: Option[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  variant?: 'default' | 'filled' | 'outlined';
}>(), {
  placeholder: 'Select an option',
  disabled: false,
  variant: 'default',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
}>();

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'filled':
      return 'bg-gray-100 border-transparent hover:bg-gray-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200';
    case 'outlined':
      return 'bg-transparent border-gray-300 hover:border-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200';
    default:
      return 'bg-white border-gray-300 hover:border-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 shadow-sm';
  }
});
</script>

<template>
  <div class="flex flex-col gap-1.5 w-full">
    <label v-if="label" class="text-sm font-semibold text-gray-700">
      {{ label }}
    </label>
    
    <div class="relative w-full">
      <select
        :value="modelValue ?? ''"
        @change="(e) => emit('update:modelValue', (e.target as HTMLSelectElement).value)"
        :disabled="disabled"
        class="w-full appearance-none rounded-lg border py-2.5 pl-4 pr-10 text-sm transition-colors duration-200 outline-none"
        :class="[
          variantClasses,
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : '',
          disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'cursor-pointer',
          modelValue === null || modelValue === '' ? 'text-gray-500' : 'text-gray-900'
        ]"
      >
        <option value="" disabled selected hidden>{{ placeholder }}</option>
        <option 
          v-for="option in options" 
          :key="option.value" 
          :value="option.value"
          :disabled="option.disabled"
          class="text-gray-900"
        >
          {{ option.label }}
        </option>
      </select>
      
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <ChevronDownIcon class="h-4 w-4 text-gray-400" />
      </div>
    </div>
    
    <span v-if="error" class="text-xs text-red-500 mt-0.5">
      {{ error }}
    </span>
  </div>
</template>
