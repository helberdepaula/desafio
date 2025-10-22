<template>
    <v-card>
        <v-card-title>
            <v-row align="center">
                <v-col>
                    <div class="d-flex align-center">
                        <v-icon class="me-2">mdi-chart-line</v-icon>
                        Relatório de Entrada de Produtos por Período
                    </div>
                </v-col>
            </v-row>
        </v-card-title>
        <v-divider class="mb-5"></v-divider>
        <v-card-text>
            <v-row>
                <v-col cols="6">
                    <v-text-field
                        v-model="dataIni"
                        label="Data Inicial"
                        type="date"
                        outlined
                        required
                    ></v-text-field>
                </v-col>
                <v-col cols="6">
                    <v-text-field
                        v-model="dataEnd"
                        label="Data Final"
                        type="date"
                        outlined
                        required
                    ></v-text-field>
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text="Close" variant="plain" @click="emit('actionClose')" :disabled="loading"></v-btn>
            <v-btn color="primary" text="Gerar Relatório" variant="tonal" @click="submitForm" :loading="loading"></v-btn>
        </v-card-actions>

    </v-card>
</template>
<script lang="ts" setup>
import { useRelatorio } from '@/composables/relatorios';
import useToastCustom from '@/composables/toastCustom';
import { defineEmits, ref } from 'vue';

const toast = new useToastCustom()
const { gerarRelatorioEntradaEstoque, loading } = useRelatorio()
const dataIni = ref('')
const dataEnd = ref('')

const emit = defineEmits<{
    (e: 'actionClose'): void;
    (e: 'reportGenerated'): void;
}>();

const submitForm = async () => {
    if (!dataIni.value || !dataEnd.value) {
        toast.error('Por favor, preencha as datas inicial e final')
        return
    }
    
    try {
        const response = await gerarRelatorioEntradaEstoque({
            data_ini: dataIni.value,
            data_end: dataEnd.value
        })
        if (response) {
            toast.success('Relatório solicitado com sucesso!')
            emit('reportGenerated')
            emit('actionClose')
        }
    } catch (error) {
        toast.error('Erro ao solicitar relatório')
    }
}

</script>