<template>
    <div>
        <v-card>
            <form @submit.prevent="submitForm">
                <v-row align="center" justify="space-between">
                    <v-col cols="3">
                        <v-mask-input v-model="cnpj.value.value" :error-messages="cnpj.errorMessage.value"
                            :mask="cnpjMask" label="CNPJ" />
                    </v-col>
                    <v-col>
                        <v-text-field v-model="nome.value.value" :error-messages="nome.errorMessage.value"
                            append-outer-icon="mdi-magnify" label="Nome"></v-text-field>
                    </v-col>
                </v-row>
                <v-row align="center" justify="space-between">
                    <v-col cols="2">
                        <v-mask-input v-model="cep.value.value" :error-messages="cep.errorMessage.value" :mask="cepMask"
                            label="CEP">
                            <template #append-inner>
                                <v-btn icon size="small" variant="text" @click="searchCep(String(cep.value.value))"
                                    :loading="loading" :disabled="false">
                                    <v-icon>mdi-magnify</v-icon>
                                </v-btn>
                            </template>
                        </v-mask-input>
                    </v-col>
                    <v-col cols="2">
                        <v-select v-model="estado_id.value.value" :error-messages="estado_id.errorMessage.value"
                            :items="estadoResponse" label="UF" item-title="nome" item-value="id"
                            @update:modelValue="value => onChangeEstado(value as number)"></v-select>
                    </v-col>
                    <v-col cols="2">
                        <v-select v-model="municipio_id.value.value" :error-messages="municipio_id.errorMessage.value"
                            label="Municípios" item-title="nome" item-value="id" :items="municipioResponse"></v-select>
                    </v-col>
                    <v-col>
                        <v-text-field v-model="logradouro.value.value" :error-messages="logradouro.errorMessage.value"
                            label="Logradouro">

                        </v-text-field>
                    </v-col>
                </v-row>

                <v-row align="center" justify="space-between">
                    <v-col cols="2">
                        <v-text-field v-model="bairro.value.value" :error-messages="bairro.errorMessage.value"
                            label="Bairro">
                        </v-text-field>
                    </v-col>
                    <v-col cols="2">
                        <v-text-field v-model="numero.value.value" :error-messages="numero.errorMessage.value"
                            label="Numero">
                        </v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field v-model="complemento.value.value" :error-messages="complemento.errorMessage.value"
                            label="Complemento">
                        </v-text-field>
                    </v-col>

                </v-row>

                <v-btn class="me-4" type="submit">
                    <v-icon icon="mdi-content-save-check" />
                    submit
                </v-btn>

                <v-btn @click="handleReset">
                    <v-icon icon="mdi-reload" />
                    Limpar
                </v-btn>

                <v-btn href="/fornecedores">
                    <v-icon icon="mdi-window-close" />
                    Cancelar
                </v-btn>
            </form>
        </v-card>
    </div>
</template>

<script lang="ts" setup>
import 'vue-sonner/style.css'
import { useField, useForm } from 'vee-validate';
import { ref, onMounted, watch, type Ref, markRaw } from "vue";
import { useViaCEP } from '@/composables/viaCep';
import { useEstados } from '@/composables/estados';
import { useMunicipios } from '@/composables/municipio';
import { useFornecedores } from '@/composables/fornecedores';
import type { CreateFornecedorDto } from '@/types/fornecedores-type';
import { useRouter } from 'vue-router';
import useToastCustom from '@/composables/toastCustom';
import { schemaValidade } from './schemaValidade';
const toast = new useToastCustom()
const router = useRouter()

const { viaCepResponse, fetchViaCep, loading } = useViaCEP();
const { fechEstado, estadoResponse } = useEstados();
const { fetchMunicipio, municipioResponse } = useMunicipios()
const { createFornecedor, errorForn } = useFornecedores()


const cnpjMask = {
    mask: '##.###.###/####-##',
    tokens: {
        '#': { pattern: /[0-9]/ }
    }
};
const cepMask = {
    mask: '##.###-###',
    tokens: {
        '#': { pattern: /[0-9]/ }
    }
};

const { handleSubmit, handleReset, setFieldValue } = useForm<CreateFornecedorDto>({
    validationSchema: schemaValidade,
});

const nome = useField('nome');
const cnpj = useField('cnpj');
const cep = useField('cep');
const logradouro = useField('logradouro');
const bairro = useField('bairro');
const complemento = useField('complemento');
const numero = useField('numero');
const municipio_id = useField('municipio_id');
const estado_id = useField('estado_id');

const searchCep = async (cep: string) => {
    await fetchViaCep(cep)
}

const onChangeEstado = async (estado_id: number) => {
    await fetchMunicipio(estado_id)
}

const submitForm = handleSubmit(async (data: CreateFornecedorDto) => {
    const result = await createFornecedor(data)
    toast.success(result.message);
    router.push(`/fornecedores/edit/${result.data.id}`)
});

watch(errorForn, (newError) => {
    if (newError) {
        toast.error(newError);
    }
})

watch(viaCepResponse, async (newValue) => {
    if (newValue) {
        const estadoresult = estadoResponse.value.find((item) => item.nome == newValue.estado);
        if (estadoresult) {
            setFieldValue('estado_id', estadoresult.id)
            const result = await fetchMunicipio(estadoresult.id)
            if (result) {
                const municipio = result.find(item => item.id == Number(newValue.ibge))
                if (municipio) {
                    setFieldValue('municipio_id', municipio.id)
                }
            }
        }

        setFieldValue('logradouro', newValue.logradouro)
        setFieldValue('bairro', newValue.bairro)
    }
});

onMounted(() => {
    fechEstado()
});
</script>
