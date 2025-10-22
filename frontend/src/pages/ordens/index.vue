<template>
    <div>
        <v-card>
            <v-card-title>
                <v-row align="center" justify="space-between">
                    <v-col>
                        <div class="d-flex align-center">
                            <v-icon class="me-2">mdi-cart-variant</v-icon>
                            <v-breadcrumbs :items="breadcrumps"></v-breadcrumbs>
                        </div>
                    </v-col>
                    <v-col cols="auto">
                        <v-btn href="/ordens/new" color="primary" prepend-icon="mdi-plus-circle-outline">
                            Gerar uma nova Ordem
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-divider class="mb-5"></v-divider>
            <v-card-text>
                <v-row class="mb-4">
                    <v-col cols="12" md="4">
                        <v-text-field input-class="input-controll" v-model="search" prepend-inner-icon="mdi-magnify"
                            label="Buscar ordens..." hide-details @input="debouncedSearch" />
                    </v-col>
                </v-row>

                <v-data-table-server v-model:items-per-page="itemsPerPage" :headers="headers" :items="ordens"
                    :items-length="totalItems" :loading="loading" item-value="id" @update:options="loadItems">
                    <template #item.id="{ item }">
                        {{ item.id.toString().padStart(6, '0') }}
                    </template>
                    <template #item.valor_total="{ item }">
                        {{ formatCurrency(Number(item.valor_total)) }}
                    </template>
                    <template #item.data_venda="{ item }">
                        {{ formatDate(item.data_venda) }}
                    </template>
                    <template #item.createdAt="{ item }">
                        {{ formatDate(item.created_at) }}
                    </template>
                    <template #item.updatedAt="{ item }">
                        {{ formatDate(item.created_at) }}
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
                    Tem certeza que deseja excluir o marca ?
                    Esta ação não pode ser desfeita.
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn @click="deleteDialog = false">Cancelar</v-btn>
                    <v-btn color="error" @click="deleteOrdem">Excluir</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue"
import { format } from "date-fns";
import useToastCustom from "@/composables/toastCustom";
import { useRouter } from "vue-router";
import { useOrdem } from "@/composables/ordem";
import type { Ordem } from "@/types/ordem-type";
const router = useRouter();
const toast = new useToastCustom()

const breadcrumps = [
    { title: 'Ordem', href: '/ordens' },
]

const {
    ordens,
    loading,
    errorOrdem,
    totalItems,
    currentPage,
    itemsPerPage,
    fetchOrdem,
} = useOrdem()

// Estado local
const search = ref("")
const deleteDialog = ref(false)
const selectOrdem = ref<Ordem | null>(null)

// Headers da tabela
const headers = ref([
    { title: "Codigo", key: "id", align: "start" },
    { title: "Data da Venda", key: "data_venda", align: "start" },
    { title: "Quantidade Item", key: "quantide_itens", align: "end" },
    { title: "Valor total", key: "valor_total", align: "end" },
    { title: "Criado em", key: "createdAt", align: "start", sortable: false },
    { title: "Atualizado em", key: "updatedAt", align: "start", sortable: false },
    //{ title: "Ações", key: "actions", align: "center", sortable: false },
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

const fetchData = async () => {
    await fetchOrdem({
        page: currentPage.value,
        limit: itemsPerPage.value,
        nome: search.value || undefined,
    })
}

const formatCurrency = (valor: number) => {
    const formatador = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
    return formatador.format(valor);
}

const formatDate = (date: string) => {
    return format(new Date(date), 'dd/MM/yyyy')
}

const viewFornecedor = (id: number) => {
    console.log('Visualizar fornecedor:', id)
}

const editFornecedor = (id: number) => {
    router.push('/marcas/edit/' + id)
}

const confirmDelete = (fornecedor: Ordem) => {
    selectOrdem.value = fornecedor
    deleteDialog.value = true
}

const deleteOrdem = async () => {
    if (!selectOrdem.value) return

    try {
        // await removerMarca(selectOrdem.value.id)
        deleteDialog.value = false
        selectOrdem.value = null
    } catch (error) {
        console.error('Erro ao excluir fornecedor:', error)
    }
}

watch(errorOrdem, (newError) => {
    if (newError) {
        toast.error(newError);
    }
})
//equivalente ao useeffect no react
onMounted(() => {
    fetchData()
})
</script>
