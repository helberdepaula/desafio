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
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text="Close" variant="plain" @click="emit('actionClose')"></v-btn>
            <v-btn color="primary" text="Gerar Relatório" variant="tonal" @click="submitForm"></v-btn>
        </v-card-actions>

    </v-card>
</template>
<script lang="ts" setup>
import useToastCustom from '@/composables/toastCustom';
import { defineEmits } from 'vue';
const toast = new useToastCustom()

const emit = defineEmits<{
    (e: 'actionClose'): void;
}>();

const submitForm = () => {

}

</script>