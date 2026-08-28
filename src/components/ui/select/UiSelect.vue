<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { ChevronDown, Check } from 'lucide-vue-next';

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

const isOpen = ref(false);
const containerRef = ref<HTMLElement | null>(null);

const selectedOption = computed(() =>
  props.options.find((opt) => opt.value === props.modelValue)
);

const toggleDropdown = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value;
  }
};

const selectOption = (option: Option) => {
  if (option.disabled) return;
  emit('update:modelValue', option.value);
  isOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'filled':
      return 'bg-gray-100 border-transparent hover:bg-gray-200/80 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10';
    case 'outlined':
      return 'bg-transparent border-gray-300 hover:border-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10';
    default:
      return 'bg-white border-gray-200 hover:border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-xs';
  }
});
</script>

<template>
  <div ref="containerRef" class="relative flex flex-col gap-1.5 w-full text-left">
    <label v-if="label" class="text-sm font-medium text-gray-700 select-none">
      {{ label }}
    </label>

    <div class="relative w-full">
      <button
        type="button"
        @click="toggleDropdown"
        :disabled="disabled"
        class="flex w-full items-center justify-between rounded-lg border py-2.5 px-3.5 text-sm transition-all duration-150 outline-none select-none"
        :class="[
          variantClasses,
          error ? '!border-red-500 focus:!ring-red-500/10' : '',
          disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'cursor-pointer',
          isOpen ? 'ring-4 ring-indigo-500/10 border-indigo-500' : ''
        ]"
      >
        <span 
          class="truncate" 
          :class="selectedOption ? 'text-gray-900 font-medium' : 'text-gray-400'"
        >
          {{ selectedOption ? selectedOption.label : placeholder }}
        </span>

        <ChevronDown 
          class="h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200"
          :class="{ 'rotate-180 text-gray-600': isOpen }"
        />
      </button>

      <Transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="opacity-0 scale-95 -translate-y-1"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 -translate-y-1"
      >
        <div
          v-if="isOpen"
          class="absolute left-0 right-0 z-50 mt-1.5 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg ring-1 ring-black/5 outline-none"
        >
          <div
            v-for="option in options"
            :key="option.value"
            @click="selectOption(option)"
            class="flex items-center justify-between w-full rounded-md px-3 py-2 text-sm transition-colors select-none"
            :class="[
              option.disabled 
                ? 'opacity-40 cursor-not-allowed' 
                : 'cursor-pointer hover:bg-gray-100 active:bg-gray-100/80',
              option.value === modelValue 
                ? 'bg-gray-100 text-gray-900 font-medium' 
                : 'text-gray-700'
            ]"
          >
            <span class="truncate">{{ option.label }}</span>
            <Check 
              v-if="option.value === modelValue" 
              class="h-4 w-4 text-indigo-600 shrink-0 ml-2" 
            />
          </div>
        </div>
      </Transition>
    </div>

    <span v-if="error" class="text-xs font-medium text-red-500">
      {{ error }}
    </span>
  </div>
</template>