<template>
    <form @submit.prevent="handleSubmit">
        <v-row>
            <v-col cols="3">
                <v-btn type="button" @click="addField" prepend-icon="mdi-plus-circle-outline">
                    Add novo contato
                </v-btn>
            </v-col>
            <v-col cols="3">
                <v-btn type="submit" color="primary" :loading="loading" :disabled="!hasValidContatos">
                    Salvar contatos
                </v-btn>
            </v-col>
        </v-row>

        <div v-for="field in formFields" :key="field.id" class="form-field-group">
            <v-row>
                <v-col cols="1">
                    <v-mask-input v-model="field.codigo" :rules="[rules.required]" :mask="codeMask"
                        :readonly="(field.existingId || 0) > 0" label="Código" />
                </v-col>
                <v-col cols="1">
                    <v-mask-input v-model="field.ddd" :rules="[rules.required, rules.ddd]" :mask="dddMask" label="DDD"
                        :readonly="(field.existingId || 0) > 0" />
                </v-col>
                <v-col cols="3">
                    <v-mask-input v-model="field.numero" :rules="[rules.required, rules.telefone]"
                        :readonly="(field.existingId || 0) > 0" :mask="phoneNumberMask" label="Número" />
                </v-col>
                <v-col cols="1">
                    <v-btn type="button" @click="removeField(field.id, (field.existingId || 0))" class="mt-1"
                        color="error" icon size="small" :disabled="formFields.length === 1">
                        <v-icon icon="mdi-trash-can-outline"></v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <v-divider class="mb-5"></v-divider>
        </div>
    </form>
</template>

<script lang="ts" setup>
import { useFornecedores } from '@/composables/fornecedores';
import useToastCustom from '@/composables/toastCustom';
import type { CreateContatoDto } from '@/types/fornecedores-type';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

interface ContatoFormField {
    id: number;
    codigo: string;
    ddd: string;
    numero: string;
    isExisting?: boolean;
    existingId?: number;
}

const route = useRoute();
const router = useRouter();
const toast = new useToastCustom();
const { id } = route.params as { id: string };
const { createContatoFornecedor, contatosFornecedo, getContatoFornecedor, loading, removerContato } = useFornecedores()

const codeMask = {
    mask: '+##',
    tokens: {
        '#': { pattern: /[0-9]/ }
    }
};

const dddMask = {
    mask: '(##)',
    tokens: {
        '#': { pattern: /[0-9]/ }
    }
};

const phoneNumberMask = {
    mask: '# ####-####',
    tokens: {
        '#': { pattern: /[0-9]/ }
    }
};

const formFields = ref<ContatoFormField[]>([
    { id: 1, codigo: '', ddd: '', numero: '' }
]);

const rules = {
    required: (value: string) => !!value || 'Campo obrigatório',
    ddd: (value: string) => {
        if (!value) return 'DDD é obrigatório';
        if (value.trim().length < 2) return 'DDD deve ter 2 dígitos';
        return true;
    },
    telefone: (value: string) => {
        if (!value) return 'Número é obrigatório';
        if (value.length < 8 || value.length > 9) return 'Número deve ter entre 8 e 9 dígitos';
        return true;
    }
};

let nextId = 2;

const addField = () => {
    formFields.value.push({
        id: nextId++,
        codigo: '',
        ddd: '',
        numero: ''
    });
};

const removeField = async(idToRemove: number, existingId: number) => {

    if (formFields.value.length > 1) {
        formFields.value = formFields.value.filter(field => field.id !== idToRemove);
        if (existingId) {
            await removerContato(Number(existingId))
        }

    }
};

const hasValidContatos = computed(() => {
    return formFields.value.some(field =>
        field.codigo.trim() !== '' &&
        field.ddd.trim() !== '' &&
        field.numero.trim() !== ''
    );
});

const validateForm = () => {
    for (const field of formFields.value) {
        if (field.codigo || field.ddd || field.numero) {
            if (!field.codigo || !field.ddd || !field.numero) {
                toast.error('Todos os campos do contato devem ser preenchidos');
                return false;
            }
            if (field.ddd.trim().length < 2) {
                toast.error('DDD deve ter exatamente 2 dígitos');
                return false;
            }
            if (field.numero.length < 8 || field.numero.length > 9) {
                toast.error('Número deve ter entre 8 e 9 dígitos');
                return false;
            }
        }
    }
    return true;
};

const handleSubmit = async () => {
    if (!validateForm()) return;

    const validContatos = formFields.value.filter(field =>
        field.codigo.trim() && field.ddd.trim() && field.numero.trim()
    );

    if (validContatos.length === 0) {
        toast.error('Adicione pelo menos um contato válido');
        return;
    }

    const contatosData: CreateContatoDto[] = validContatos.map(field => ({
        codigo: field.codigo.trim(),
        ddd: field.ddd.trim(),
        numero: field.numero.trim()
    }));

    try {
        await createContatoFornecedor(Number(id), contatosData);
        toast.success('Contatos salvos com sucesso!');
        await getContatoFornecedor(Number(id));
    } catch (error) {
        toast.error('Erro ao salvar contatos');
        console.error('Erro:', error);
    }
};

const loadExistingContatos = () => {
    if (contatosFornecedo.value && contatosFornecedo.value.length > 0) {
        formFields.value = contatosFornecedo.value.map((contato, index) => ({
            id: index + 1,
            codigo: `+${contato.codigo}`,
            ddd: contato.ddd,
            numero: contato.numero,
            isExisting: true,
            existingId: contato.id
        }));
        nextId = contatosFornecedo.value.length + 1;
    }
};

watch(contatosFornecedo, (data) => {
    if (data && data.length > 0) {
        loadExistingContatos();
    }
}, { deep: true });

onMounted(async () => {
    await getContatoFornecedor(Number(id));
});
</script>

