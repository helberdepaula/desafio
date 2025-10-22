<template>
    <v-card>
        <v-card-title>
            <v-row align="center">
                <v-col>
                    <div class="d-flex align-center">
                        <v-icon class="me-2">mdi-chart-line</v-icon>
                        Relatório de Produtos com Estoque Crítico
                    </div>
                </v-col>
            </v-row>
        </v-card-title>
        <v-divider class="mb-5"></v-divider>
        <v-card-text>
            <v-row>
                <v-col cols="12">
                    <v-text-field
                        v-model="sku"
                        label="SKU (opcional)"
                        placeholder="Digite o SKU do produto"
                        outlined
                        clearable
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
const { gerarRelatorioCritico, loading } = useRelatorio()
const sku = ref('')

const emit = defineEmits<{
    (e: 'actionClose'): void;
    (e: 'reportGenerated'): void;
}>();

const submitForm = async () => {
    try {
        const params = sku.value ? { sku: sku.value } : {}
        const response = await gerarRelatorioCritico(params)
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