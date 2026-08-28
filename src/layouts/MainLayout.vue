<script setup lang="ts">
import { GitGraphIcon } from 'lucide-vue-next';
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
    <!-- Navigation Bar -->
    <header class="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center gap-2">
            <div class="bg-indigo-600 p-1.5 rounded-lg">
              <GitGraphIcon class="w-5 h-5 text-white" />
            </div>
            <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              SkillGraph
            </span>
          </div>
          
          <!-- Nav items -->
          <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#" class="text-indigo-600">Dashboard</a>
            <a href="#" class="hover:text-indigo-600 transition-colors">Career Paths</a>
            <a href="#" class="hover:text-indigo-600 transition-colors">Technologies</a>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <slot />
    </main>
    
    <!-- Footer -->
    <footer class="mt-auto py-8 text-center text-slate-400 text-sm border-t border-slate-200 bg-white">
      <p>&copy; {{ new Date().getFullYear() }} SkillGraph. Developer Career Traversal Engine.</p>
    </footer>
  </div>
</template>
