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
                <v-col cols="12" md="3">
                    <v-select
                        v-model="tipoRelatorio"
                        :items="tiposRelatorio"
                        item-title="label"
                        item-value="value"
                        label="Tipo de relatório"
                        prepend-inner-icon="mdi-filter"
                        clearable
                        hide-details
                        @update:model-value="debouncedSearch"
                    />
                </v-col>
                <v-col cols="12" md="3">
                    <v-select
                        v-model="statusRelatorio"
                        :items="statusRelatorios"
                        item-title="label"
                        item-value="value"
                        label="Status"
                        prepend-inner-icon="mdi-magnify"
                        clearable
                        hide-details
                        @update:model-value="debouncedSearch"
                    />
                </v-col>
                <v-col cols="12" md="3">
                    <div class="d-flex align-center">
                        <v-switch
                            v-model="autoRefreshEnabled"
                            @update:model-value="handleAutoRefreshToggle"
                            color="primary"
                            hide-details
                        ></v-switch>
                        <v-tooltip text="Auto-atualizar a cada 10 segundos">
                            <template v-slot:activator="{ props }">
                                <span v-bind="props" class="ml-2 text-caption">
                                    Auto-refresh
                                    <v-icon size="small" :color="isPollingActive ? 'success' : 'grey'">
                                        {{ isPollingActive ? 'mdi-refresh' : 'mdi-refresh-off' }}
                                    </v-icon>
                                </span>
                            </template>
                        </v-tooltip>
                    </div>
                </v-col>
            </v-row>

            <v-data-table-server v-model:items-per-page="itemsPerPage" :headers="headers" :items="relatorios"
                :items-length="totalItems" :loading="loading" item-value="id" @update:options="loadItems">
                <template #item.nome="{ item }">
                    {{ formatName(item.nome) }}
                </template>
                <template #item.start="{ item }">
                    {{ formatDate(item.start) }}
                </template>
                <template #item.end="{ item }">
                    {{ formatDate(item.end) }}
                </template>
                <template #item.actions="{ item }">
                    <v-tooltip
                        v-if="item.status === 'CONCLUIDO'"
                        text="Baixar relatório"
                        location="top"
                    >
                        <template #activator="{ props }">
                            <v-btn
                                v-bind="props"
                                @click="downloadRelatorio(item)"
                                color="success"
                                size="small"
                                icon="mdi-download"
                                variant="tonal"
                                :loading="downloadingId === item.id"
                            >
                            </v-btn>
                        </template>
                    </v-tooltip>
                    <span v-else-if="item.status === 'SOLICITADO'" class="text-caption text-blue">
                        Solicitado
                    </span>
                    <span v-else-if="item.status === 'PROCESSANDO'" class="text-caption text-orange">
                        Processando...
                    </span>
                    <span v-else-if="item.status === 'ERRO'" class="text-caption text-red">
                        Erro
                    </span>
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
        <Vencimento @action-close="closeModal" @report-generated="onReportGenerated" />
    </v-dialog>
    <v-dialog v-model="modalREntrada" max-width="900">
        <EntradaEstoque @action-close="closeModal" @report-generated="onReportGenerated" />
    </v-dialog>
    <v-dialog v-model="modalRCritico" max-width="900">
        <Estoquecritico @action-close="closeModal" @report-generated="onReportGenerated" />
    </v-dialog>
    <v-dialog v-model="modalRValorBruto" max-width="900">
        <ValorTotalPeriodo @action-close="closeModal" @report-generated="onReportGenerated" />
    </v-dialog>

</template>
<script lang="ts" setup>
import EntradaEstoque from '@/components/relatorios/entradaEstoque.vue';
import Estoquecritico from '@/components/relatorios/estoquecritico.vue';
import ValorTotalPeriodo from '@/components/relatorios/valorTotalPeriodo.vue';
import Vencimento from '@/components/relatorios/vencimento.vue';
import { useRelatorio } from '@/composables/relatorios';
import { usePolling } from '@/composables/usePolling';
import useToastCustom from '@/composables/toastCustom';
import { format } from 'date-fns';
import { mergeProps, onMounted, ref, watch } from 'vue';
const search = ref("")
const tipoRelatorio = ref("")
const statusRelatorio = ref("")
const modalRVencimento = ref(false)
const modalRCritico = ref(false)
const modalRValorBruto = ref(false)
const modalREntrada = ref(false)
const downloadingId = ref<number | null>(null)
const toast = new useToastCustom()

// Auto-refresh a cada 5 segundos
const autoRefreshEnabled = ref(true)
const refreshInterval = ref(5000) 


const breadcrumps = [
    { title: 'Relatorios', href: '/relatorios' },
]

const tiposRelatorio = [
    { label: 'Próximo Vencimento', value: 'proximo_vencimento' },
    { label: 'Estoque Crítico', value: 'estoque_critico' },
    { label: 'Entrada em Estoque', value: 'estoque_entrada' },
    { label: 'Valor Bruto Mensal', value: 'valor_bruto_mensal' },
]

const statusRelatorios = [
    { label: 'Solicitado', value: 'SOLICITADO' },
    { label: 'Processando', value: 'PROCESSANDO' },
    { label: 'Concluído', value: 'CONCLUIDO' },
    { label: 'Erro', value: 'ERRO' },
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

const { isActive: isPollingActive, toggle: togglePolling, pause: pausePolling, resume: resumePolling } = usePolling(
    () => fetchData(),
    {
        interval: refreshInterval.value,
        enabled: autoRefreshEnabled.value,
        immediate: false
    }
)

const loadItems = ({ page, itemsPerPage: perPage }: { page: number, itemsPerPage: number }) => {
    itemsPerPage.value = perPage
    currentPage.value = page
    fetchData()
}


let searchTimeout: ReturnType<typeof setTimeout>
const debouncedSearch = () => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
        fetchData()
    }, 500)
}

const fetchData = () => {
    fetchRelatorio({
        page: currentPage.value,
        limit: itemsPerPage.value,
        nome: search.value || '',
        tipo: tipoRelatorio.value || '',
        status: statusRelatorio.value || ''
    })
}

const closeModal = () => {
    modalRVencimento.value = false
    modalRCritico.value = false
    modalRValorBruto.value = false
    modalREntrada.value = false
    
    // ao fechar o modal volta a funcionar o polling
    if (autoRefreshEnabled.value) {
        resumePolling()
    }
}

const openModalVencimento = () => {
    pausePolling() 
    modalRVencimento.value = true
}

const openModalCritico = () => {
    pausePolling() 
    modalRCritico.value = true
}

const openModalValorBruto = () => {
    pausePolling() 
    modalRValorBruto.value = true
}

const openModalEntrada = () => {
    pausePolling() 
    modalREntrada.value = true
}

const onReportGenerated = () => {
    fetchData()
}

const handleAutoRefreshToggle = (value: boolean | null) => {
    if (value) {
        resumePolling()
    } else {
        pausePolling()
    }
}

const formatName = (nome:string) => {
 return  tiposRelatorio.find(tipo => tipo.value === nome)?.label || "--"
}   

const formatDate = (date: string | null | undefined) => {
    if (!date) {
        return "--"
    }
    return format(new Date(date), 'dd/MM/yyyy HH:mm:ss')
}

const downloadRelatorio = async (item: any) => {
    try {
        downloadingId.value = item.id
        
        if (!item.path) {
            toast.error('Arquivo do relatório não encontrado')
            return
        }

        const filename = item.path.split(/[/\\]/).pop()
        if (!filename) {
            toast.error('Nome do arquivo não encontrado')
            return
        }

        const downloadUrl = `${import.meta.env.VITE_DOWNLOAD_URL?? 'http://localhost:3001/download/'}${filename}`
        
        const response = await fetch(downloadUrl)
        
        if (!response.ok) {
            toast.error('Erro ao baixar o arquivo')
            return
        }

        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        toast.success('Download iniciado com sucesso!')
    } catch (error) {
        console.error('Erro no download:', error)
        toast.error('Erro ao fazer download do arquivo')
    } finally {
        downloadingId.value = null
    }
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