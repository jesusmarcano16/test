<script setup>
import { useStore } from '../store/store';
import { computed, onMounted, ref } from 'vue';
import axios from 'axios';
import alert from '../utils/alert';
import getFormatedtDate from '../utils/getFormatedDate';

import Spinner from '../components/Spinner.vue';
import VerFactura from '../components/VerFactura.vue';

const store = useStore();
let error = ref(false);
let spinerCargarDatosVisible = ref(true);
let spinerGenerarFacturaVisible = ref(false);
let factura = ref(false);
let clienteSeleccionado = ref('Selecciona un cliente');

const total = computed(() => {
  return productos.value.reduce((acc, value) => acc + value.cantidad * value.price, 0);
});

const dinero = computed(() => {
  return store.sellersData.reduce((acumulador, user) => acumulador + user.puntuacion, 0);
});

const ganador = computed(() => {
  return store.sellersData.find((x) => x.puntuacion > 20);
});

let productos = ref([]);
const obtenerProductos = async () => {
  const productosUrl = 'https://api.alegra.com/api/v1/items/';
  let data = await axios
    .get(productosUrl, { headers })
    .then((resp) => {
      productos.value = resp.data;
      productos.value.forEach((x) => {
        x.cantidad = 0;
        x.price = Number(x.price[0].price).toFixed(2);
      });
      return resp.data;
    })
    .catch((e) => {
      return { error: e.message };
    });
  return data;
};

let clientes = ref([]);
const obtenerClientes = async () => {
  const clientesUrl = 'https://api.alegra.com/api/v1/contacts/';
  let data = await axios
    .get(clientesUrl, { headers })
    .then((resp) => {
      clientes.value = resp.data;
      return resp.data;
    })
    .catch((e) => {
      return { error: e.message };
    });
  console.log(data);
  return data;
};

const cargarDatos = async () => {
  error.value = false;
  spinerCargarDatosVisible.value = true;
  let clientesResponse = await obtenerClientes();
  let productosResponse = await obtenerProductos();
  if (clientesResponse.error) {
    error.value = clientesResponse.error;
  } else if (productosResponse.error) {
    error.value = productosResponse.error;
  }
  spinerCargarDatosVisible.value = false;
};

onMounted(() => {
  cargarDatos();
});

const generarFactura = async () => {
  spinerGenerarFacturaVisible.value = true;
  const facturaUrl = 'https://api.alegra.com/api/v1/invoices';
  let productosFactura = productos.value.filter((x) => x.cantidad > 0);
  productosFactura = productosFactura.map((x) => {
    return { id: x.id, price: x.price, quantity: x.cantidad };
  });
  const body = {
    date: getFormatedtDate(),
    dueDate: getFormatedtDate(7),
    seller: ganador.value.id,
    client: clienteSeleccionado.value.id,
    items: productosFactura,
    status: 'open',
    payments: [{ date: String(getFormatedtDate()), account: { id: 2 }, amount: total.value, paymentMethod: 'cash' }]
  };
  await axios
    .post(facturaUrl, body, { headers })
    .then((res) => {
      factura.value = res.data;
      store.facturaCreada();
    })
    .catch((err) => {
      alert('ha ocurrido un error', `al crear la factura ${err.message}`);
    });
  spinerGenerarFacturaVisible.value = false;
};
const generarFacturaHandler = () => {
  if (total.value === 0) {
    alert('Sin productos', 'debe agregar productos para generar la factura');
  } else if (total.value > dinero.value) {
    alert('No tiene suficiente dinero', 'elimine algunos productos');
  } else if (clienteSeleccionado.value === 'Selecciona un cliente') {
    alert('Debes seleccionar un cliente');
  } else {
    generarFactura();
  }
};

const productoReducirCantidadHandler = (num) => {
  if (num - 1 < 0) {
    return 0;
  }
  return num - 1;
};
</script>

<template>
  <section class="text-gray-600">
    <div v-if="factura == false" class="container mx-auto flex flex-col items-center justify-center px-5 pt-24">
      <div class="w-full text-center md:w-2/3">
        <h1 class="mb-4 text-3xl font-medium text-gray-900 sm:text-4xl">Facturar</h1>
        <svg class="m-auto max-w-full" width="447" height="30" viewBox="0 0 447 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M189.622 3.576C168.647 4.50823 147.918 5.6545 127.703 6.90766C99.0876 8.68043 70.4829 10.5143 42.0507 13.418C33.1009 14.3349 24.0123 14.9157 15.1184 16.0618C9.53536 16.7801 2.13241 17.8039 1.16087 18.0178C0.652709 18.1401 0.431017 18.3237 0.359383 18.3848C-0.144298 18.8127 -0.0523948 19.2252 0.231905 19.5461C0.346072 19.6836 0.634768 20.02 1.43618 20.0658C55.0323 23.1987 109.837 17.0858 163.498 16.4439C256.556 15.3436 352.434 19.7143 444.753 29.2506C445.559 29.327 446.343 28.9448 446.455 28.3794C446.589 27.8292 446.007 27.2943 445.201 27.2179C352.725 17.6664 256.69 13.2803 163.453 14.3959C113.444 14.9919 62.4464 20.3562 12.3672 18.5223C13.5178 18.3695 14.6461 18.2166 15.6758 18.079C24.5339 16.9329 33.5845 16.3674 42.4985 15.4505C70.8702 12.5468 99.4167 10.7129 127.994 8.95546C163.453 6.75478 200.457 4.85975 237.752 3.97336C251.094 4.1109 264.391 4.24851 277.688 4.41661C306.454 4.78339 335.354 5.85317 364.053 7.28972C372.694 7.73291 381.334 8.19135 389.975 8.58869C392.841 8.72624 400.228 9.12351 401.258 9.09295C402.534 9.06238 402.78 8.32889 402.802 8.20663C402.869 7.93155 402.825 7.54946 402.198 7.22853C402.131 7.18269 401.728 7.02976 400.832 6.93807C348.651 1.52808 292.933 0.626557 237.797 1.92557C179.638 1.36012 121.256 1.11548 63.2457 0.855682C62.4151 0.855682 61.7368 1.31422 61.7301 1.87967C61.7257 2.44512 62.3949 2.90368 63.2254 2.91896C105.23 3.10235 147.448 3.28564 189.622 3.576Z"
            fill="black"
          />
        </svg>
        <p v-if="!store.ganador" class="mb text-lg leading-relaxed">Debe haber un ganador para generar la factura</p>
        <div v-else>
          <p class="mt-4 leading-relaxed">Felicitaciones {{ ganador.name }} el premio es de $ {{ dinero }}</p>
          <p>Selecciona el cliente y los productos que desees para tu factura</p>
          <div v-if="error" class="mt-8 text-center text-gray-600">
            <p>ha ocurrido siguiente error al intentar cargar datos de clientes y productos</p>
            <p>{{ error }}</p>
            <button
              @click="cargarDatos"
              class="m-auto mt-4 inline-flex items-center rounded border-0 bg-indigo-500 py-2 px-6 text-base text-white hover:bg-indigo-600 focus:outline-none"
            >
              Volver a intentar
            </button>
          </div>
          <div v-else-if="spinerCargarDatosVisible" class="mt-20">
            <spinner />
          </div>
          <div v-else>
            <div class="mt-10 flex items-center justify-center gap-4">
              <p>Cliente:</p>
              <select
                v-model="clienteSeleccionado"
                class="m-0 block w-full max-w-lg rounded border border-solid border-gray-300 bg-white bg-clip-padding bg-no-repeat px-3 py-1.5 text-base font-normal text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
              >
                <option selected>Selecciona un cliente</option>
                <option v-for="cliente in clientes" :value="cliente" :key="cliente.id">{{ cliente.name }}</option>
              </select>
            </div>
            <div class="overflow-x-auto">
              <table class="whitespace-nowrap	 mt-10 w-full table-auto text-left">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="rounded-tl rounded-bl px-4 py-3 text-sm font-medium tracking-wider text-gray-900">Nombre producto</th>
                    <th class="px-4 py-3 text-center text-sm font-medium tracking-wider text-gray-900">Precio</th>
                    <th class="px-4 py-3 text-center text-sm font-medium tracking-wider text-gray-900">Cantidad</th>
                    <th class="px-4 py-3 text-center text-sm font-medium tracking-wider text-gray-900">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="producto in productos" class="border-t-2 border-gray-200" :key="producto.id">
                    <td class="px-4 py-3 capitalize">{{ producto.name }}</td>
                    <td class="px-4 py-3 text-center">${{ producto.price }}</td>
                    <td class="px-4 py-3 text-center">
                      <div class="m-auto flex h-10 w-24 flex-row rounded-lg border">
                        <button
                          @click="producto.cantidad = productoReducirCantidadHandler(producto.cantidad)"
                          class="flex h-full w-20 cursor-pointer rounded-l border-r bg-gray-100 text-2xl font-semibold text-black hover:bg-red-600 focus:outline-none"
                        >
                          <span class="m-auto">-</span>
                        </button>
                        <div class="flex w-24 cursor-default items-center justify-center text-xs md:text-base">
                          <span>{{ producto.cantidad }}</span>
                        </div>
                        <button
                          @click="producto.cantidad++"
                          class="flex h-full w-20 cursor-pointer rounded-r border-l bg-gray-100 font-semibold text-black hover:bg-blue-600 focus:outline-none"
                        >
                          <span class="m-auto">+</span>
                        </button>
                      </div>
                    </td>
                    <td class="px-4 py-3 text-center text-gray-900">${{ (producto.price * producto.cantidad).toFixed(2) }}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="border-t-2 border-gray-200">
                    <td colspan="2"></td>
                    <td class="px-4 py-3 text-center"><span class="text-xl">TOTAL</span></td>
                    <td class="px-4 py-3 text-center">${{ total.toFixed(2) }}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <button
              @click="generarFacturaHandler"
              :disabled="spinerGenerarFacturaVisible"
              class="inline-flex items-center gap-2 rounded border-0 bg-indigo-500 py-2 px-6 text-lg text-white hover:bg-indigo-600 focus:outline-none disabled:cursor-not-allowed"
            >
              Generar factura
              <spinner v-if="spinerGenerarFacturaVisible" :width="20" :height="20"></spinner>
            </button>
          </div>
        </div>
      </div>
    </div>
    <VerFactura v-else :factura="factura" />
  </section>
</template>
