<template>
   <v-card>
      <v-card-title>
         <v-row align="center" justify="space-between">
            <v-col>
               <div class="d-flex align-center">
                  <v-icon class="me-2">mdi-umbrella-beach</v-icon>
                  <v-breadcrumbs :items="breadcrumps"></v-breadcrumbs>
               </div>
            </v-col>
            <v-col cols="auto">
               <v-btn href="/categorias" color="primary" prepend-icon="mdi-arrow-left-top-bold">
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

            <v-btn class="me-4" type="submit">
               <v-icon icon="mdi-content-save-check" />
               submit
            </v-btn>

            <v-btn @click="handleReset">
               <v-icon icon="mdi-reload" />
               Limpar
            </v-btn>

            <v-btn href="/categorias">
               <v-icon icon="mdi-window-close" />
               Cancelar
            </v-btn>
         </form>
      </v-card>
   </v-card>
</template>

<script lang="ts" setup>
import type { CreateCategoriaDto } from '@/types/categorias-types';
import { useField, useForm } from 'vee-validate';
import { schemaValidade } from './schemaValidade';
import { useCategoria } from '@/composables/categorias';
import useToastCustom from '@/composables/toastCustom';
import { useRouter } from 'vue-router';
import { watch } from 'vue';

const breadcrumps = [
   { title: 'Categorias', href: '/categorias' },
   { title: 'Cadastrar', href: 'categorias' }
];

const { createCategoria, errorCategoria } = useCategoria()
const toast = new useToastCustom();
const router = useRouter();
const { handleSubmit, handleReset } = useForm<CreateCategoriaDto>({
   validationSchema: schemaValidade,
});

const nome = useField('nome');

const submitForm = handleSubmit(async (data: CreateCategoriaDto) => {
   const result = await createCategoria(data)
   toast.success(result.message);
   router.push(`/categorias`)
});

watch(errorCategoria, (newError) => {
   if (newError) {
      toast.error(newError);
   }
})
</script>
