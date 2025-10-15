<template>
    <form @submit.prevent="handleSubmit">
        <v-row>
            <v-col cols="3">
                <v-btn type="button" @click="addField" prepend-icon="mdi-plus-circle-outline">
                    Add novo contato
                </v-btn>
            </v-col>
        </v-row>

        <div v-for="field in formFields" :key="field.id" class="form-field-group">
            <v-row>
                <v-col cols="3">
                    <v-mask-input :model="field.id" :mask="phoneNumberMask" label="+55 (00) 0 0000-0000"></v-mask-input>
                </v-col>
                <v-col class="">
                    <v-btn type="button" @click="removeField(field.id)" class="mt-5" color="gost">
                        <v-icon color="#ff4d86" icon="mdi-trash-can-outline"></v-icon>
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
import type { FormField } from '@/types/add-input-type';
import type { CreateContatoDto } from '@/types/fornecedores-type';
import { useForm } from 'vee-validate';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const toast = new useToastCustom();
const { id } = route.params as { id: string };
const { createContatoFornecedor, contatosFornecedo, getContatoFornecedor } = useFornecedores()


const phoneNumberMask = {
    mask: '+55 (##) # ####-####',
    tokens: {
        '#': { pattern: /[0-9]/ }
    }
}

const formFields = ref<FormField[]>([
    { id: 1, value: '' }
]);

let nextId = 2;
const addField = () => {
    formFields.value.push({
        id: nextId++,
        value: ''
    });
};

const removeField = (idToRemove: number) => {
    formFields.value = formFields.value.filter(field => field.id !== idToRemove);
};

const handleSubmit = () => {
    console.log('Form Data:', formFields.value);
};

watch(contatosFornecedo, (data) => {
  /*  data.map(item => {
        formFields.value.unshift({
            id: nextId++,
            value: `${item.codigo} (${item.ddd}) ${item.codigo} `
        });
    })*/
})

onMounted(() => {
    getContatoFornecedor(Number(id))
})
</script>


<style scoped>
.form-field-group {
    margin-bottom: 10px;
}

input {
    margin-right: 5px;
}
</style>