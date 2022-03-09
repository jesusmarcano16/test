<script setup>
import { useStore } from '../store/store';
import { ref } from 'vue';
import { imagesData } from '../utils/imagesData';
import axios from 'axios';
import alert from '../utils/alert';
import Spinner from './Spinner.vue';
import imageError from '../assets/error-image.jpg';

let images = ref([]);
let search = ref('');
let searchError = ref('');
let spinerVisible = ref(false);

const searchHandler = async () => {
  searchError.value = '';
  if (search.value === '') {
    searchError.value = 'el campo de busqueda no puede estar vacio';
    return;
  }
  // images.value=await googleImagesRequest(search.value)
  images.value = imagesData;
  search.value = '';
};

const googleImagesRequest = async (query) => {
  let response = await getRequest(url);
  if (response.error) {
    alert('Ocurrio un error', `Al buscar las imagenes ${response.error}`);
    return [];
  }
  if (response.searchInformation.totalResults == 0) {
    alert('Sin resultados', `para la busqueda ${query}`);
    return [];
  }
  for (let i of response.items) {
    imagesArray.push(i.link);
  }
  return imagesArray;
};
const getRequest = async (url) => {
  spinerVisible.value = true;
  const result = await axios
    .get(url)
    .then((resp) => {
      return resp.data;
    })
    .catch((error) => {
      return { error: error.message };
    });
  spinerVisible.value = false;
  return result;
};
const imageSelectHandler = (user) => {
  store.puntuar(user.id);
  images.value = [];
};
const store = useStore();

const imageErrorHandler = (event) => {
  event.target.src = imageError;
};
</script>

<template>
  <section class="text-gray-600" v-if="store.sellersData.length > 0">
    <div v-if="!store.ganador" class="container mx-auto px-5 py-4">
      <form @submit.prevent="searchHandler" class="relative mt-10 mb-16 flex w-full items-end justify-center">
        <div class="relative mr-4 w-2/4 text-left md:w-full lg:w-full xl:w-1/2">
          <label for="hero-field" class="text-sm leading-7 text-gray-600">Que deseas buscar</label>
          <input
            :disabled="spinerVisible"
            v-model="search"
            type="text"
            id="hero-field"
            name="hero-field"
            class="w-full rounded border border-gray-300 bg-gray-100 bg-opacity-50 py-1 px-3 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-200 disabled:text-slate-500"
          />
          <p class="absolute text-sm text-red-700">{{ searchError }}</p>
        </div>
        <button
          :disabled="spinerVisible"
          class="inline-flex min-w-[140px] items-center justify-center gap-3 rounded border-0 bg-indigo-500 py-2 px-6 text-lg text-white hover:bg-indigo-600 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-300 disabled:hover:bg-slate-300"
        >
          Buscar
          <spinner v-if="spinerVisible" :width="20" :height="20"></spinner>
        </button>
      </form>

      <transition name="fade">
        <div v-if="images.length > 0">
          <p class="mb-10 text-center text-xl">selecciona una imagen para continuar</p>
          <div class="-m-4 flex flex-wrap">
            <div class="m-auto p-4 md:w-1/3 lg:w-1/4" v-for="(user, index) in store.sellersData" :key="user.id + '' + index">
              <div class="h-full overflow-hidden rounded-lg border-2 border-gray-200 border-opacity-60">
                <img
                  class="w-full max-w-xs object-cover object-center md:h-36 lg:h-48"
                  :src="images[index % 10]"
                  :alt="'imagen de ' + user.name"
                  @error="(e) => imageErrorHandler(e)"
                />
                <div class="p-6">
                  <div>
                    <div class="flex justify-between">
                      <h2 class="mb-1 text-xs font-medium tracking-widest text-gray-400">Vendedor</h2>
                      <div class="flex flex-wrap items-center">
                        <span class="inline-flex items-center text-sm leading-none text-gray-400"> puntuacion: {{ user.puntuacion }} </span>
                      </div>
                    </div>
                    <h1 class="mb-3 text-xl font-medium capitalize text-gray-900">{{ user.name }}</h1>
                  </div>
                  <div class="text-center">
                    <button
                      @click="imageSelectHandler(user)"
                      class="m-auto mt-4 inline-flex items-center rounded border-0 bg-indigo-500 py-2 px-6 text-base text-white hover:bg-indigo-600 focus:outline-none"
                    >
                      Seleccionar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </section>
</template>

<style>
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  max-height: 1000px;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  max-height: 0;
}
.fade-enter-active {
  transition: max-height 0.5s ease, opacity 0.5s ease 0.3s;
}
.fade-leave-active {
  transition: max-height 0.8s ease 0.2s, opacity 0.3s ease;
}
</style>
