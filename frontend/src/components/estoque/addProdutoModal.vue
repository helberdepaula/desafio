<template>
    <v-card>
        <v-card-title>
            <v-row align="center">
                <v-col>
                    <div class="d-flex align-center">
                        <v-icon class="me-2">mdi-inbox-arrow-down</v-icon>
                        Estoques
                    </div>
                </v-col>
                <v-col cols="4">
                    <v-text-field input-class="input-controll" v-model="searchProduto" prepend-inner-icon="mdi-magnify"
                        label="Nome do produto" hide-details @input="debouncedSearch" />
                </v-col>
            </v-row>
        </v-card-title>
        <v-data-table-server v-model:items-per-page="itemsPerPage" :headers="headers" :items="estoques"
            :items-length="totalItems" :loading="loading" item-value="id" @update:options="loadItems">
            <template #item.produto="{ item }">
                {{ item.produto.nome }}
            </template>
            <template #item.quantidade="{ item }">
                {{ item.quantidade > 0 ? item.quantidade : 'Indisponível' }}
            </template>
            <template #item.data_vencimento="{ item }">
                {{ formatDate(item.data_vencimento) }}
            </template>
            <template #item.fornecedor="{ item }">
                {{ item.fornecedor.nome }}
            </template>
            <template #item.categoria="{ item }">
                {{ item.produto.categoria.nome }}
            </template>

            <template #item.actions="{ item }">
                <v-btn :disabled="item.quantidade <= 0" icon="mdi-plus-circle" size="small" variant="text"
                    @click="emit('actionAdd', item)" />
            </template>

            <template #no-data>
                <div class="text-center py-4">
                    <v-icon size="64" color="grey">mdi-tag-check-outline</v-icon>
                    <p class="text-h6 mt-2">Nenhum marca encontrado</p>
                </div>
            </template>

        </v-data-table-server>

    </v-card>
</template>
<script lang="ts" setup>
import { useEstoques } from '@/composables/estoques';
import useToastCustom from '@/composables/toastCustom';
import type { Estoques } from '@/types/estoque-types';
import { format } from 'date-fns';
import { ref, watch, defineEmits } from 'vue';
const searchProduto = ref("")
const toast = new useToastCustom()

const emit = defineEmits<{
    (e: 'actionAdd', data: Estoques): void;
}>();


const { errorEstoque, estoques, totalItems, loading, currentPage, itemsPerPage, fetchEstoque } = useEstoques()
const headers = ref([
    { title: "Lote", key: "sku", align: "start" },
    { title: "Produto", key: "produto", align: "start" },
    { title: "Fornecedor", key: "fornecedor", align: "start" },
    { title: "Categoria", key: "categoria", align: "start" },
    { title: "Quantidade em estoque", key: "quantidade", align: "end" },
    { title: "Ações", key: "actions", align: "center", sortable: false },
] as const)


const fetchDataEstoque = () => {
    fetchEstoque({
        page: currentPage.value,
        limit: itemsPerPage.value,
        produto: searchProduto.value || ''
    })
}

const loadItems = ({ page, itemsPerPage: perPage }: { page: number, itemsPerPage: number }) => {
    itemsPerPage.value = perPage
    currentPage.value = page
    fetchDataEstoque()
}

let searchTimeout: ReturnType<typeof setTimeout>
const debouncedSearch = () => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
        fetchDataEstoque()
    }, 500)
}


const formatDate = (date: string) => {
    return format(new Date(date), 'dd/MM/yyyy')
}

watch(errorEstoque, (newError) => {
    if (newError) {
        toast.error(newError);
    }
})
</script>