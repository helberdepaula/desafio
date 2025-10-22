<template>
    <v-card>
        <v-card-title>
            <v-row align="center">
                <v-col>
                    <div class="d-flex align-center">
                        <v-icon class="me-2">mdi-chart-line</v-icon>
                        Relatório de Lucro Bruto Total por Mês
                    </div>
                </v-col>
            </v-row>
        </v-card-title>
        <v-divider class="mb-5"></v-divider>
        <v-card-text>
            <v-row>
                <v-col cols="6">
                    <v-text-field
                        v-model="ano"
                        label="Ano"
                        type="number"
                        placeholder="2024"
                        outlined
                        required
                        :min="2020"
                        :max="2030"
                    ></v-text-field>
                </v-col>
                <v-col cols="6">
                    <v-select
                        v-model="mes"
                        label="Mês"
                        :items="meses"
                        item-title="label"
                        item-value="value"
                        outlined
                        required
                    ></v-select>
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
const { gerarRelatorioValorBrutoMensal, loading } = useRelatorio()
const ano = ref(new Date().getFullYear().toString())
const mes = ref((new Date().getMonth() + 1).toString().padStart(2, '0'))

const meses = [
    { label: 'Janeiro', value: '01' },
    { label: 'Fevereiro', value: '02' },
    { label: 'Março', value: '03' },
    { label: 'Abril', value: '04' },
    { label: 'Maio', value: '05' },
    { label: 'Junho', value: '06' },
    { label: 'Julho', value: '07' },
    { label: 'Agosto', value: '08' },
    { label: 'Setembro', value: '09' },
    { label: 'Outubro', value: '10' },
    { label: 'Novembro', value: '11' },
    { label: 'Dezembro', value: '12' },
]

const emit = defineEmits<{
    (e: 'actionClose'): void;
    (e: 'reportGenerated'): void;
}>();

const submitForm = async () => {
    if (!ano.value || !mes.value) {
        toast.error('Por favor, preencha o ano e o mês')
        return
    }
    
    try {
        const response = await gerarRelatorioValorBrutoMensal({
            ano: ano.value,
            mes: mes.value
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