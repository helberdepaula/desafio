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
                    <v-btn href="/estoques" color="primary" prepend-icon="mdi-arrow-left-top-bold">
                        Voltar
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-title>
        <v-divider class="mb-5"></v-divider>
        <v-card>
            <form @submit.prevent="submitForm">
                <v-row align="center">
                    <v-col cols="2">
                        <v-select v-model="fornecedor_id.value.value" :error-messages="fornecedor_id.errorMessage.value"
                            :items="fornecedores" label="Fornecedores" item-title="nome" item-value="id"></v-select>
                    </v-col>
                    <v-col cols="2">
                        <v-select v-model="produto_id.value.value" :error-messages="produto_id.errorMessage.value"
                            :items="produtos" label="Produtos" item-title="nome" item-value="id"></v-select>
                    </v-col>
                </v-row>
                <v-divider class="mb-5"></v-divider>
                <v-row align="center">
                    <v-col cols="2">
                        <v-text-field v-model="sku.value.value" :error-messages="sku.errorMessage.value"
                            append-outer-icon="mdi-magnify" label="Lote"></v-text-field>
                    </v-col>
                    <v-col cols="2">
                        <v-mask-input v-model="data_vencimento.value.value"
                            :error-messages="data_vencimento.errorMessage.value" :mask="vencimentoMask"
                            label="Data Vencimento" />
                    </v-col>
                    <v-col cols="2">
                        <v-number-input v-model="quantidade.value.value as number" control-variant="split"
                            :error-messages="quantidade.errorMessage.value" append-outer-icon="mdi-magnify"
                            label="Quantidade"></v-number-input>
                    </v-col>
                    <v-col cols="2">
                        <vuetify-money v-model="preco_custo.value.value" label="Preço de custom" :options="config"
                            :error-messages="preco_custo.errorMessage.value" bg-color="grey-darken-3" />
                    </v-col>
                </v-row>
                <v-row align="center">
                    <v-col cols="2">
                        <v-text-field v-model="secao.value.value" :error-messages="secao.errorMessage.value"
                            append-outer-icon="mdi-magnify" label="Seção"></v-text-field>
                    </v-col>
                    <v-col cols="2">
                        <v-text-field v-model="corredor.value.value" :error-messages="corredor.errorMessage.value"
                            append-outer-icon="mdi-magnify" label="Corredor"></v-text-field>
                    </v-col>
                    <v-col cols="2">
                        <v-text-field v-model="prateleira.value.value" :error-messages="prateleira.errorMessage.value"
                            append-outer-icon="mdi-magnify" label="Prateleira"></v-text-field>
                    </v-col>
                </v-row>
                <v-divider class="mb-5"></v-divider>
                <v-btn class="me-4" type="submit">
                    <v-icon icon="mdi-content-save-check" />
                    submit
                </v-btn>

                <v-btn @click="handleReset">
                    <v-icon icon="mdi-reload" />
                    Limpar
                </v-btn>

                <v-btn href="/estoques">
                    <v-icon icon="mdi-window-close" />
                    Cancelar
                </v-btn>
            </form>
        </v-card>
    </v-card>
</template>

<script lang="ts" setup>
import { useField, useForm } from 'vee-validate';
import useToastCustom from '@/composables/toastCustom';
import { useRouter } from 'vue-router';
import { onMounted, reactive, ref, watch } from 'vue';
import { schemaValidade } from './schemaValidade';
import { useEstoques } from '@/composables/estoques';
import type { CreateEstoqueDto } from '@/types/estoque-types';
import { useProdutos } from '@/composables/produtos';
import { useFornecedores } from '@/composables/fornecedores';


const vencimentoMask = {
    mask: '##/##/####',
    tokens: {
        '#': { pattern: /[0-9]/ }
    }
};

const config = reactive({
    value: '',
    decimal: ',',
    thousands: '.',
    prefix: '',
    suffix: '',
    precision: 2,
    masked: false
})

const breadcrumps = [
    { title: 'Estoque', href: '/estoque' },
    { title: 'Cadastrar', href: 'estoque' }
];

const { createEstoque, errorEstoque } = useEstoques();
const { findSelectProduto, produtos } = useProdutos();
const { findSelectFonecedor, fornecedores } = useFornecedores();

const toast = new useToastCustom();
const router = useRouter();
const { handleSubmit, handleReset } = useForm<CreateEstoqueDto>({
    validationSchema: schemaValidade,
});

const produto_id = useField('produto_id');
const fornecedor_id = useField('fornecedor_id');
const corredor = useField('corredor');
const prateleira = useField('prateleira');
const sku = useField('sku');
const secao = useField('secao');
const quantidade = useField('quantidade','required|numeric');
const preco_custo = useField('preco_custo');
const data_vencimento = useField('data_vencimento');


const submitForm = handleSubmit(async (data: CreateEstoqueDto) => {
    const result = await createEstoque(data)
    toast.success(result.message);
    router.push(`/estoques`)
});

watch(errorEstoque, (newError) => {
    if (newError) {
        toast.error(newError);
    }
})

onMounted(() => {
    findSelectFonecedor()
    findSelectProduto()
})
</script>

<style scoped>
.custom-money-input {
    padding: 0 16px;
    height: 56px;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.38);
    background: '#29292';

}

.custom-money-input:focus {
    padding: 0 16px;
    height: 56px;
    border-radius: 1px;
    border: 1px solid rgba(0, 0, 0, 0.38);
    transition: border-color 0.2s ease-in-out;
}
</style>
