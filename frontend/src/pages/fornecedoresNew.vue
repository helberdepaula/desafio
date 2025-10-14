<template>
    <div>
        <v-card>
            <v-card-title>
                <v-row align="center" justify="space-between">
                    <v-col>
                        <div class="d-flex align-center">
                            <v-icon class="me-2">mdi-truck</v-icon>
                            <v-breadcrumbs :items="breadcrumps"></v-breadcrumbs>
                        </div>
                    </v-col>
                </v-row>
            </v-card-title>

            <v-card-text>
                <!-- A prop @submit.prevent do v-form é preferível para evitar o recarregamento -->
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
                            <v-mask-input v-model="cep.value.value" :error-messages="cep.errorMessage.value"
                                :mask="cepMask" label="CEP">
                                <template #append-inner>
                                    <v-btn icon size="small" variant="text" @click="searchCep(String(cep.value.value))"
                                        :loading="loading" :disabled="false">
                                        <v-icon>mdi-magnify</v-icon>
                                    </v-btn>
                                </template>
                            </v-mask-input>
                        </v-col>
                        <v-col cols="2">
                            <v-select v-model="estado.value.value" :error-messages="estado.errorMessage.value"
                                :items="estadoResponse" label="UF" item-title="nome" item-value="id"
                                @update:modelValue="value => onChangeEstado(value as number)"></v-select>
                        </v-col>
                        <v-col cols="2">
                            <v-select v-model="municipio.value.value" :error-messages="municipio.errorMessage.value"
                                label="Municípios" item-title="nome" item-value="id"
                                :items="municipioResponse"></v-select>
                        </v-col>
                        <v-col>
                            <v-text-field v-model="logradouro.value.value"
                                :error-messages="logradouro.errorMessage.value" label="Logradouro">

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
                            <v-text-field v-model="complemento.value.value"
                                :error-messages="complemento.errorMessage.value" label="Complemento">
                            </v-text-field>
                        </v-col>

                    </v-row>




                    <v-btn class="me-4" type="submit">
                        submit
                    </v-btn>

                    <v-btn @click="handleReset">
                        clear
                    </v-btn>
                </form>
            </v-card-text>
        </v-card>
    </div>
</template>

<script lang="ts" setup>
import { useField, useForm } from 'vee-validate';
import { ref, onMounted, watch, type Ref } from "vue";
import { useViaCEP } from '@/composables/viaCep';
import { useEstados } from '@/composables/estados';
import { useMunicipios } from '@/composables/municipio';


// Sua lógica de breadcrumbs
const breadcrumps = [
    { title: 'Fornecedores', href: '/fornecedores' },
    { title: 'Cadastrar', href: 'fornecedores' }
];

const { viaCepResponse, fetchViaCep, loading } = useViaCEP();
const { fechEstado, estadoResponse } = useEstados();
const { fetchMunicipio, municipioResponse } = useMunicipios()


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



// Lógica de validação
const { handleSubmit, handleReset, setFieldValue } = useForm({
    validationSchema: {
        cnpj(value: string) {
            if (!value) {
                return 'O campo CNPJ é obrigatório';
            }
            if (!validarCNPJ(value)) {
                return 'CNPJ inválido';
            }
            return true; // Retorna true para validação bem-sucedida
        },
        nome(value: string) {
            if (value?.length >= 1) return true;
            return 'Campo nome é obrigatório';
        },
    },
});

const nome = useField('nome');
const cnpj = useField('cnpj');
const cep = useField('cep');
const logradouro = useField('logradouro');
const bairro = useField('bairro');
const complemento = useField('complemento');
const numero = useField('numero');
const municipio = useField('municipio');
const estado = useField('estado');

const searchCep = async (cep: string) => {
    await fetchViaCep(cep)
}

const onChangeEstado = async (estado_id: number) => {
    await fetchMunicipio(estado_id)
}

const submitForm = handleSubmit(async (values) => {
    console.log('Formulário submetido com sucesso!', values);
});

const validarCNPJ = (cnpj: string) => {
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj === '' || cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
        return false;
    }
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
        if (pos < 2) pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) return false;
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
        if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(1))) return false;
    return true;
};


watch(viaCepResponse, async (newValue) => {
    if (newValue) {
        const estadoresult = estadoResponse.value.find((item) => item.nome == newValue.estado);
        if (estadoresult) {
            setFieldValue('estado', estadoresult.id)
            const result = await fetchMunicipio(estadoresult.id)
            if (result) {
                const municipio = result.find(item => item.id == Number(newValue.ibge))
                if (municipio) {
                    setFieldValue('municipio', municipio.id)
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
