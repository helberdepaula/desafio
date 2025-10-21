<template>
    <v-card>
        <v-card-title>
            <v-row align="center" justify="space-between">
                <v-col>
                    <div class="d-flex align-center">
                        <v-icon class="me-2">mdi-chart-line</v-icon>
                        <v-breadcrumbs :items="breadcrumps"></v-breadcrumbs>
                    </div>
                </v-col>
                <v-col cols="auto">

                </v-col>
            </v-row>
        </v-card-title>

        <v-card-title>
            <v-row>
                <v-col>
                    <v-btn @click="openModalVencimento" color="primary">
                        Próximos do Vencimento
                    </v-btn>
                </v-col>
                <v-col>
                    <v-btn @click="openModalCritico" color="primary">
                        Estoque Crítico
                    </v-btn>
                </v-col>
                <v-col>
                    <v-btn @click="openModalValorBruto" color="primary">
                        Entrada em Estoque
                    </v-btn>
                </v-col>
                <v-col>
                    <v-btn @click="openModalEntrada" color="primary">
                        Valor Bruto Mensal
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-title>

        <v-divider class="mb-5"></v-divider>
        <v-card-text>
            <v-row class="mb-4">
                <v-col cols="12" md="4">
                    <v-text-field input-class="input-controll" v-model="search" prepend-inner-icon="mdi-magnify"
                        label="Buscar nome..." hide-details />
                </v-col>
            </v-row>

            <v-data-table-server v-model:items-per-page="itemsPerPage" :headers="headers" :items="relatorios"
                :items-length="totalItems" :loading="loading" item-value="id" @update:options="loadItems">
                <template #item.start="{ item }">
                    {{ formatDate(item.start) }}
                </template>
                <template #item.end="{ item }">
                    {{ formatDate(item.end) }}
                </template>
                <template #item.actions="{ item }">

                </template>

                <template #no-data>
                    <div class="text-center py-4">
                        <v-icon size="64" color="grey">mdi-tag-check-outline</v-icon>
                        <p class="text-h6 mt-2">Nenhum relatorios encontrado</p>
                    </div>
                </template>
            </v-data-table-server>
        </v-card-text>
    </v-card>

    <v-dialog v-model="modalRVencimento" max-width="900">
        <vencimento @action-close="closeModal" />
    </v-dialog>
    <v-dialog v-model="modalREntrada" max-width="900">
        <EntradaEstoque @action-close="closeModal" />
    </v-dialog>
    <v-dialog v-model="modalRCritico" max-width="900">
        <Estoquecritico @action-close="closeModal" />
    </v-dialog>
    <v-dialog v-model="modalRValorBruto" max-width="900">
        <valor-total-periodo @action-close="closeModal" />
    </v-dialog>

</template>
<script lang="ts" setup>
import EntradaEstoque from '@/components/relatorios/entradaEstoque.vue';
import Estoquecritico from '@/components/relatorios/estoquecritico.vue';
import { useRelatorio } from '@/composables/relatorios';
import useToastCustom from '@/composables/toastCustom';
import { format } from 'date-fns';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
const search = ref("")
const modalRVencimento = ref(false)
const modalRCritico = ref(false)
const modalRValorBruto = ref(false)
const modalREntrada = ref(false)
const router = useRouter();
const toast = new useToastCustom()


const breadcrumps = [
    { title: 'Relatorios', href: '/relatorios' },
]
const headers = ref([
    { title: "Nome", key: "nome", align: "start" },
    { title: "Status", key: "status", align: "start", sortable: false },
    { title: "Solicitado ", key: "start", align: "start", sortable: false },
    { title: "Processado ", key: "end", align: "start", sortable: false },
    { title: "Log", key: "log", align: "start", sortable: false },
    { title: "Ações", key: "actions", align: "center", sortable: false },
] as const)


const {
    errorRelatorio,
    relatorios,
    fetchRelatorio,
    totalItems,
    itemsPerPage,
    currentPage,
    loading,
} = useRelatorio()

const loadItems = ({ page, itemsPerPage: perPage }: { page: number, itemsPerPage: number }) => {
    itemsPerPage.value = perPage
    currentPage.value = page
    fetchData()
}


const fetchData = () => {
    fetchRelatorio({
        page: currentPage.value,
        limit: itemsPerPage.value,
        nome: search.value || ''
    })
}

const closeModal = () => {
    modalRVencimento.value = false
    modalRCritico.value = false
    modalRValorBruto.value = false
    modalREntrada.value = false
}

const openModalVencimento = () => {
    modalRVencimento.value = true
}

const openModalCritico = () => {
    modalRCritico.value = true
}

const openModalValorBruto = () => {
    modalRValorBruto.value = true
}

const openModalEntrada = () => {
    modalREntrada.value = true
}

const formatDate = (date: string | null | undefined) => {
    if (!date) {
        return "--"
    }
    return format(new Date(date), 'dd/MM/yyyy HH:mm:ss')
}

watch(errorRelatorio, (newError) => {
    if (newError) {
        toast.error(newError);
    }
})

onMounted(() => {
    fetchData()
})



</script>