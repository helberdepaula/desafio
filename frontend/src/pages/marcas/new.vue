<template>
   <v-card>
      <v-card-title>
         <v-row align="center" justify="space-between">
            <v-col>
               <div class="d-flex align-center">
                  <v-icon class="me-2">mdi-tag-check-outline</v-icon>
                  <v-breadcrumbs :items="breadcrumps"></v-breadcrumbs>
               </div>
            </v-col>
            <v-col cols="auto">
               <v-btn href="/marcas" color="primary" prepend-icon="mdi-arrow-left-top-bold">
                  Voltar
               </v-btn>
            </v-col>
         </v-row>
      </v-card-title>
      <v-divider class="mb-5"></v-divider>
      <v-card>
         <form @submit.prevent="submitForm">
            <v-row align="center" justify="space-between">
               <v-col>
                  <v-text-field v-model="nome.value.value" :error-messages="nome.errorMessage.value"
                     append-outer-icon="mdi-magnify" label="Nome"></v-text-field>
               </v-col>
            </v-row>
            <v-divider class="mb-5"></v-divider>
            <v-btn class="me-4" type="submit">
               <v-icon icon="mdi-content-save-check" />
               submit
            </v-btn>

            <v-btn @click="handleReset">
               <v-icon icon="mdi-reload" />
               Limpar
            </v-btn>

            <v-btn href="/marcas">
               <v-icon icon="mdi-window-close" />
               Cancelar
            </v-btn>
         </form>
      </v-card>
   </v-card>
</template>

<script lang="ts" setup>
import { useField, useForm } from 'vee-validate';
import useToastCustom from '@/composables/toastCustom';
import { useRouter } from 'vue-router';
import { watch } from 'vue';
import { useMarcas } from '@/composables/marcas';
import type { CreateMarcaDto } from '@/types/marcas-type';
import { schemaValidade } from './schemaValidade';

const breadcrumps = [
   { title: 'Marcas', href: '/marcas' },
   { title: 'Cadastrar', href: 'marcas' }
];

const { createMarca, errorMarca } = useMarcas()
const toast = new useToastCustom();
const router = useRouter();
const { handleSubmit, handleReset } = useForm<CreateMarcaDto>({
   validationSchema: schemaValidade,
});

const nome = useField('nome');

const submitForm = handleSubmit(async (data: CreateMarcaDto) => {
   const result = await createMarca(data)
   toast.success(result.message);
   router.push(`/marcas`)
});

watch(errorMarca, (newError) => {
   if (newError) {
      toast.error(newError);
   }
})
</script>
