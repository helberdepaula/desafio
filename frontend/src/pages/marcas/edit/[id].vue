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
import { useRoute, useRouter } from 'vue-router';
import { onMounted, watch } from 'vue';
import { schemaValidade } from '../schemaValidade';
import { useMarcas } from '@/composables/marcas';
import type { UpdateCategoriaDto } from '@/types/categorias-types';

const breadcrumps = [
    { title: 'Marcas', href: '/marcas' },
    { title: 'Cadastrar', href: 'marcas' }
];

const { updateMarca, errorMarca, find, marca } = useMarcas()
const toast = new useToastCustom();
const router = useRouter();
const route = useRoute()
const { id } = route.params as { id: number }
const { handleSubmit, handleReset, setFieldValue } = useForm<UpdateCategoriaDto>({
    validationSchema: schemaValidade,
});

const nome = useField('nome');

const submitForm = handleSubmit(async (data: UpdateCategoriaDto) => {
    const result = await updateMarca(id, data)
    toast.success(result.message);
    router.push(`/marcas`)
});


watch(marca, (data) => {
    if (data)
        setFieldValue('nome', data.nome)
})

watch(errorMarca, (newError) => {
    if (newError) {
        toast.error(newError);
    }
})

onMounted(() => {
    find(id)
})
</script>
