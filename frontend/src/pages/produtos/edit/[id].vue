<template>
    <v-card>
        <v-card-title>
            <v-row align="center" justify="space-between">
                <v-col>
                    <div class="d-flex align-center">
                        <v-icon class="me-2">mdi-package-variant</v-icon>
                        <v-breadcrumbs :items="breadcrumps"></v-breadcrumbs>
                    </div>
                </v-col>
                <v-col cols="auto">
                    <v-btn href="/produtos" color="primary" prepend-icon="mdi-arrow-left-top-bold">
                        Voltar
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-title>
        <v-divider class="mb-5"></v-divider>
        <v-card>
            <form @submit.prevent="submitForm">
                <v-row>
                    <v-col cols="2">
                        <v-text-field v-model="codigo.value.value" :error-messages="codigo.errorMessage.value"
                            append-outer-icon="mdi-magnify" label="Código"></v-text-field>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col>
                        <v-text-field v-model="nome.value.value" :error-messages="nome.errorMessage.value"
                            append-outer-icon="mdi-magnify" label="Nome"></v-text-field>
                    </v-col>
                </v-row>
                <v-row align="center">
                    <v-col cols="2">
                        <v-select v-model="marca_id.value.value" :error-messages="marca_id.errorMessage.value"
                            :items="marcas" label="Marcas" item-title="nome" item-value="id"></v-select>
                    </v-col>
                    <v-col cols="2">
                        <v-select v-model="categoria_id.value.value" :error-messages="categoria_id.errorMessage.value"
                            :items="categorias" label="Categorias" item-title="nome" item-value="id"></v-select>
                    </v-col>
                    <v-col cols="2">
                        <v-select v-model="unidade_id.value.value" :error-messages="unidade_id.errorMessage.value"
                            :items="unidades" label="Unidades" item-title="nome" item-value="id"></v-select>
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

                <v-btn href="/produtos">
                    <v-icon icon="mdi-window-close" />
                    Cancelar
                </v-btn>
            </form>
        </v-card>
    </v-card>
</template>

<script lang="ts" setup>
import { useField, useForm } from 'vee-validate';
import { schemaValidade } from './../schemaValidade';
import useToastCustom from '@/composables/toastCustom';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, watch } from 'vue';
import type { UpdateProdutoDto } from '@/types/produtos-type';
import { useProdutos } from '@/composables/produtos';
import { useMarcas } from '@/composables/marcas';
import { useCategoria } from '@/composables/categorias';
import { useUnidades } from '@/composables/unidades';

const breadcrumps = [
    { title: 'Produtos', href: '/produtos' },
    { title: 'Cadastrar', href: 'produtos' }
];

const { findSelectMarca, marcas } = useMarcas()
const { categorias, findSelectCategoria } = useCategoria()
const { unidades, findSelectUnidade } = useUnidades();

const { updateProduto, errorProduto, find, produto } = useProdutos()
const toast = new useToastCustom();
const router = useRouter();
const route = useRoute()
const { id } = route.params as { id: number }
const { handleSubmit, handleReset, setFieldValue } = useForm<UpdateProdutoDto>({
    validationSchema: schemaValidade,
});

const codigo = useField('codigo');
const nome = useField('nome');
const marca_id = useField('marca_id');
const categoria_id = useField('categoria_id');
const unidade_id = useField('unidade_id');

const submitForm = handleSubmit(async (data: UpdateProdutoDto) => {
    const result = await updateProduto(id, data)
    toast.success(result.message);
    router.push(`/produtos`)
});

watch(produto, (data) => {
    if (data) {
        setFieldValue('codigo', data.codigo)
        setFieldValue('nome', data.nome)
        setFieldValue('marca_id', data.marca.id)
        setFieldValue('categoria_id', data.categoria.id)
        setFieldValue('unidade_id', data.unidade.id)
    }
})

watch(errorProduto, (newError) => {
    if (newError) {
        toast.error(newError);
    }
})

onMounted(() => {
    find(id)
    findSelectCategoria()
    findSelectMarca()
    findSelectUnidade();
})
</script>
