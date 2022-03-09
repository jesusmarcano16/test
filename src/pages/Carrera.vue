<script setup>
import { onMounted, ref } from 'vue';
import axiosGet from '../utils/axiosGet';
import { useStore } from '../store/store';
import alert from '../utils/alert';

import Instrucciones from '../components/Instrucciones.vue';
import UserTable from '../components/UserTable.vue';
import SearchImages from '../components/SearchImages.vue';
import Spinner from '../components/Spinner.vue';

const store = useStore();
let error = ref(false);

const obtenerVendedores = async () => {
  error.value = false;
  const contacsUrl = 'https://api.alegra.com/api/v1/sellers/';
  const data = await axiosGet(contacsUrl);
  if (data.error) {
    error.value = data.error;
    alert('ha ocurrido un error', 'al intentar cargar datos de vendedores');
    return;
  }
  store.setsellersData(data);
};

onMounted(async () => {
  obtenerVendedores();
});
</script>

<template>
  <div>
    <Instrucciones />
    <div v-if="error" class="mt-8 text-center text-gray-600">
      <p>ha ocurrido siguiente error al intentar cargar datos de vendedores</p>
      <p>{{ error }}</p>
      <button
        @click="obtenerVendedores"
        class="m-auto mt-4 inline-flex items-center rounded border-0 bg-indigo-500 py-2 px-6 text-base text-white hover:bg-indigo-600 focus:outline-none"
      >
        Volver a intentar
      </button>
    </div>
    <div v-else-if="store.sellersData.length === 0" class="mt-20">
      <spinner />
    </div>
    <div v-else>
      <SearchImages />
      <UserTable />
    </div>
  </div>
</template>
