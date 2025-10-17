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
                    <v-btn href="/produtos/new" color="primary" prepend-icon="mdi-plus-circle-outline">
                        Novo Produto
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-title>
        <v-divider class="mb-5"></v-divider>
        <v-card-text>
            <v-row class="mb-4">
                <v-col cols="12" md="4">
                    <v-text-field input-class="input-controll" v-model="search" prepend-inner-icon="mdi-magnify"
                        label="Buscar nome..." hide-details @input="debouncedSearch" />
                </v-col>
            </v-row>

            <v-data-table-server v-model:items-per-page="itemsPerPage" :headers="headers" :items="produtos"
                :items-length="totalItems" :loading="loading" item-value="id" @update:options="loadItems">
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
                Tem certeza que deseja excluir o marca <strong>{{ selectProduto?.nome }}</strong>?
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
import { useProdutos } from '@/composables/produtos';
import useToastCustom from '@/composables/toastCustom';
import type { Produto } from '@/types/produtos-type';
import { format } from 'date-fns';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
const search = ref("")
const deleteDialog = ref(false)
const selectProduto = ref<Produto | null>(null)

const router = useRouter();
const toast = new useToastCustom()
const {
    errorProduto,
    produtos,
    fetchProduto,
    totalItems,
    itemsPerPage,
    currentPage,
    loading,
    removerProduto
} = useProdutos()

const headers = ref([
    { title: "Nome", key: "nome", align: "start" },
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

const loadItems = ({ page, itemsPerPage: perPage }: { page: number, itemsPerPage: number }) => {
    itemsPerPage.value = perPage
    currentPage.value = page
    fetchData()
}


const fetchData = () => {
    fetchProduto({
        page: currentPage.value,
        limit: itemsPerPage.value,
        nome: search.value || ''
    })
}

const _delete = async () => {
    if (!selectProduto.value) return

    try {
        await removerProduto(selectProduto.value.id)
        deleteDialog.value = false
        selectProduto.value = null
    } catch (error) {
        console.error('Erro ao excluir fornecedor:', error)
    }
}

watch(errorProduto, (error) => {
    if (error)
        toast.error(error)
})

onMounted(() => {
    fetchData()
})

const breadcrumps = [
    { title: 'Produtos', href: '/produtos' },
]

const formatDate = (date: string) => {
    return format(new Date(date), 'dd/MM/yyyy')
}

const view = (id: number) => {
    console.log('Visualizar fornecedor:', id)
}

const edit = (id: number) => {
    router.push('/produtos/edit/' + id)
}

const confirm = (fornecedor: Produto) => {
    selectProduto.value = fornecedor
    deleteDialog.value = true
}
</script>