<template>
    <v-card>
        <v-card-title>
            <v-row align="center" justify="space-between">
                <v-col>
                    <div class="d-flex align-center">
                        <v-icon class="me-2">mdi-inbox-arrow-down</v-icon>
                        <v-breadcrumbs :items="breadcrumps"></v-breadcrumbs>
                    </div>
                </v-col>
                <v-col cols="auto">
                    <v-btn href="/estoques/new" color="primary" prepend-icon="mdi-plus-circle-outline">
                        Registrar Entrada
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-title>
        <v-divider class="mb-5"></v-divider>
        <v-card-text>
            <v-row class="mb-4">
                <v-col cols="12" md="2">
                    <v-text-field input-class="input-controll" v-model="searchSKU" prepend-inner-icon="mdi-magnify"
                        label="Buscar por lote..." hide-details @input="debouncedSearch" />
                </v-col>
                <v-col cols="12" md="3">
                    <v-text-field input-class="input-controll" v-model="searchProduto" prepend-inner-icon="mdi-magnify"
                        label="Buscar por nome do produto..." hide-details @input="debouncedSearch" />
                </v-col>
                <v-col cols="12" md="3">
                    <v-text-field input-class="input-controll" v-model="searchFernecedor"
                        prepend-inner-icon="mdi-magnify" label="Buscar por fornecedor..." hide-details
                        @input="debouncedSearch" />
                </v-col>
                <v-col cols="12" md="3">
                    <v-text-field input-class="input-controll" v-model="searchCategoria"
                        prepend-inner-icon="mdi-magnify" label="Buscar por categoria..." hide-details
                        @input="debouncedSearch" />
                </v-col>
            </v-row>

            <v-data-table-server v-model:items-per-page="itemsPerPage" :headers="headers" :items="estoques"
                :items-length="totalItems" :loading="loading" item-value="id" @update:options="loadItems">
                <template #item.produto="{ item }">
                    {{ item.produto.nome }}
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
                <template #item.createdAt="{ item }">
                    {{ formatDate(item.createdAt) }}
                </template>
                <template #item.updatedAt="{ item }">
                    {{ formatDate(item.updatedAt) }}
                </template>
                <template #item.actions="{ item }">
                    <v-btn icon="mdi-eye" size="small" variant="text" @click="view(item.id)" />
                    <v-btn icon="mdi-pencil" size="small" variant="text" @click="edit(item.id)" />
                    <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="confirm(item)" />
                </template>

                <template #no-data>
                    <div class="text-center py-4">
                        <v-icon size="64" color="grey">mdi-tag-check-outline</v-icon>
                        <p class="text-h6 mt-2">Nenhum marca encontrado</p>
                    </div>
                </template>
            </v-data-table-server>
        </v-card-text>
    </v-card>
    <!-- Confirma a exclusão antes de excluir -->
    <v-dialog v-model="deleteDialog" max-width="400">
        <v-card>
            <v-card-title>Confirmar Exclusão</v-card-title>
            <v-card-text>
                Tem certeza que deseja excluir o estoque <strong>{{ selectEstoque?.sku }}</strong>?
                Esta ação não pode ser desfeita.
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn @click="deleteDialog = false">Cancelar</v-btn>
                <v-btn color="error" @click="_delete">Excluir</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script lang="ts" setup>

import { useEstoques } from '@/composables/estoques';
import useToastCustom from '@/composables/toastCustom';
import type { Estoques } from '@/types/estoque-types';
import { format } from 'date-fns';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const searchSKU = ref("")
const searchProduto = ref("")
const searchFernecedor = ref("")
const searchCategoria = ref("")

const deleteDialog = ref(false)
const selectEstoque = ref<Estoques | null>(null)

const router = useRouter();
const toast = new useToastCustom()
const {
    errorEstoque,
    estoques,
    fetchEstoque,
    totalItems,
    itemsPerPage,
    currentPage,
    loading,
} = useEstoques()

const headers = ref([
    { title: "Vencimento", key: "data_vencimento", align: "start" },
    { title: "Lote", key: "sku", align: "start" },
    { title: "Produto", key: "produto", align: "start" },
    { title: "Fornecedor", key: "fornecedor", align: "start" },
    { title: "Categoria", key: "categoria", align: "start" },
    { title: "Quantidade", key: "quantidade", align: "end" },
    { title: "Criado em", key: "createdAt", align: "start", sortable: false },
    { title: "Atualizado em", key: "updatedAt", align: "start", sortable: false },
    { title: "Ações", key: "actions", align: "center", sortable: false },
] as const)

let searchTimeout: ReturnType<typeof setTimeout>
const debouncedSearch = () => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
        fetchData()
    }, 500)
}

const fetchData = () => {
    fetchEstoque({
        page: currentPage.value,
        limit: itemsPerPage.value,
        fornecedor: searchFernecedor.value || '',
        produto: searchProduto.value || '',
        sku: searchSKU.value || '',
        categoria: searchCategoria.value || '',
        //codigo?: string;
    })
}

const loadItems = ({ page, itemsPerPage: perPage }: { page: number, itemsPerPage: number }) => {
    itemsPerPage.value = perPage
    currentPage.value = page
    fetchData()
}

const _delete = async () => {
    if (!selectEstoque.value) return
}

watch(errorEstoque, (error) => {
    if (error)
        toast.error(error)
})

onMounted(() => {
    fetchData()
})

const breadcrumps = [
    { title: 'Estoques', href: '/estoques' },
]

const formatDate = (date: string) => {
    return format(new Date(date), 'dd/MM/yyyy')
}

const view = (id: number) => {
    console.log('Visualizar fornecedor:', id)
}

const edit = (id: number) => {
    router.push('/estoques/edit/' + id)
}

const confirm = (estoque: Estoques) => {
    selectEstoque.value = estoque
    deleteDialog.value = true
}
</script>