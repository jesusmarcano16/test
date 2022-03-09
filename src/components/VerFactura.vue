<script setup>
import axios from 'axios';
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';
import { ref, onMounted } from 'vue';
import alert, { alertSuccess } from '../utils/alert';
import axiosGet from '../utils/axiosGet';

import Spinner from './Spinner.vue';
const props = defineProps({
  factura: Object
});

let pdfUrl = ref(null);
let spinerVisible = ref(false);
const getFacturapdf = `https://api.alegra.com/api/v1/invoices/${props.factura.id}?fields=pdf`;

onMounted(async () => {
  const data = await axiosGet(getFacturapdf);
  if (data.error) {
    return;
  }
  pdfUrl.value = data.pdf;
});

const verPdfHandler = async () => {
  spinerVisible.value = true;
  if (!pdfUrl.value) {
    const data = await axiosGet(getFacturapdf);
    if (data.error) {
      alert('ha ocurrido un error', 'al generar enlace del pdf');
      return;
    }
    pdfUrl.value = data.pdf;
  }
  spinerVisible.value = false;
  window.open(pdfUrl.value, '_blank');
};

let saveAsImageElement = ref();
const saveAsImage = () => {
  domtoimage.toBlob(saveAsImageElement.value).then(function (blob) {
    saveAs(blob, `factura${props.factura.id}`);
  });
};

let correo = ref('');
let spinnerCorreoVisible = ref(false);
const enviarACorreoHandler = async () => {
  const mailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (correo.value === '') {
    alert('Debe introducir un correo');
  } else if (!correo.value.match(mailRegex)) {
    alert('La direccion de correo es invalida');
  } else {
    spinnerCorreoVisible.value = true;
    const enviarCorreoUrl = `https://api.alegra.com/api/v1/invoices/${props.factura.id}/email`;
    const body = { emails: [correo.value] };
    await axios
      .post(enviarCorreoUrl, body, { headers })
      .then((resp) => {
        alertSuccess('Factura enviada a correo');
        correo.value = '';
      })
      .catch((err) => alert('Error al enviar factura', err.message));
    spinnerCorreoVisible.value = false;
  }
};
</script>

<template>
  <div ref="saveAsImageElement" id="elem-print" class="container mx-auto flex flex-col bg-white px-16 pt-24">
    <p class="mb-2 text-2xl font-bold">Factura #{{ factura.id }}</p>
    <p>Creada: {{ factura.datetime }}</p>
    <p>Fecha de vencimiento: {{ factura.dueDate }}</p>
    <p>Nombre del cliente: {{ factura.client.name }}</p>
    <p>Vendedor asociado: {{ factura.seller.name }}</p>
    <div class="overflow-x-auto">
      <table class="mt-4 w-full table-auto whitespace-nowrap text-left">
        <thead>
          <tr>
            <th class="rounded-tl bg-gray-100 px-4 py-3 text-sm font-medium tracking-wider text-gray-900">Nombre producto</th>
            <th class="bg-gray-100 px-4 py-3 text-center text-sm font-medium tracking-wider text-gray-900">Precio</th>
            <th class="bg-gray-100 px-4 py-3 text-center text-sm font-medium tracking-wider text-gray-900">Cantidad</th>
            <th class="rounded-tr bg-gray-100 px-4 py-3 text-center text-sm font-medium tracking-wider text-gray-900">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="{ name, price, quantity, id } in factura.items" class="border-t-2 border-gray-200" :key="id">
            <td class="px-4 py-3 capitalize">{{ name }}</td>
            <td class="px-4 py-3 text-center">${{ price }}</td>
            <td class="px-4 py-3 text-center">{{ quantity }}</td>
            <td class="px-4 py-3 text-center">${{ price * quantity }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="border-t-2 border-gray-200">
            <td colspan="2"></td>
            <td class="px-4 py-3 text-center"><span class="text-xl">TOTAL</span></td>
            <td class="px-4 py-3 text-center">${{ factura.total.toFixed(2) }}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
  <div class="container mx-auto mt-10 block justify-start gap-4 px-16 lg:flex">
    <div class="mb-4 flex justify-center gap-4 lg:mb-0">
      <button
        @click="verPdfHandler"
        :disabled="spinerVisible"
        class="inline-flex max-w-xs items-center gap-3 rounded border-0 bg-indigo-500 py-2 px-6 text-white hover:bg-indigo-600 focus:outline-none disabled:cursor-not-allowed"
      >
        Ver PDF
        <spinner v-if="spinerVisible" :width="20" :height="20"></spinner>
      </button>
      <button
        @click="saveAsImage"
        :disabled="spinerVisible"
        class="inline-flex max-w-xs items-center gap-3 rounded border-0 bg-indigo-500 py-2 px-6 text-white hover:bg-indigo-600 focus:outline-none disabled:cursor-not-allowed"
      >
        Guardar como imagen
      </button>
    </div>
    <form @submit.prevent="enviarACorreoHandler" class="flex flex-wrap justify-center">
      <input
        v-model="correo"
        type="text"
        placeholder="ingrese correo"
        class="mb-4 w-full rounded-l border border-indigo-500 py-2 px-6 outline-none sm:mb-0 sm:w-auto"
      />
      <button
        :disabled="spinnerCorreoVisible"
        class="inline-flex max-w-xs items-center gap-3 rounded-r border border-l-0 border-indigo-500 bg-indigo-500 py-2 px-6 text-white hover:bg-indigo-600 focus:outline-none disabled:cursor-not-allowed"
      >
        Enviar factura a correo
        <spinner v-if="spinnerCorreoVisible" :width="20" :height="20"></spinner>
      </button>
    </form>
  </div>
</template>
