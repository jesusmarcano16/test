<script setup></script>

<template>
  <header class="text-gray-600">
    <div class="container mx-auto flex flex-col flex-wrap items-center p-5 md:flex-row">
      <div class="mb-4 flex items-center font-medium text-gray-900 md:mb-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          class="h-10 w-10 rounded-full bg-indigo-500 p-2 text-white"
          viewBox="0 0 24 24"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
        </svg>
        <span class="ml-3 text-xl">IMÁGENES DEL MUNDO</span>
      </div>
      <nav class="flex flex-wrap items-center justify-center text-base md:ml-auto">
        <router-link class="mr-5 border-b-2 border-transparent hover:text-gray-900" to="/">Carrera</router-link>
        <router-link class="mr-5 border-b-2 border-transparent hover:text-gray-900" to="/facturar">Facturar</router-link>
      </nav>
    </div>
  </header>
  <router-view v-slot="{ Component }">
    <transition mode="out-in" name="route">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </transition>
  </router-view>
  <footer class="mt-auto">
    <p class="mt-20 text-center">Hecho por Jesus Marcano</p>
  </footer>
</template>

<style>
.route-enter-from {
  opacity: 0;
  transform: translateX(100px);
}
.route-enter-active {
  transition: all 0.3s ease-out;
}
.route-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}
.route-leave-active {
  transition: all 0.3s ease-in;
}
</style>
