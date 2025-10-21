<template>
    <div>
        <v-card>
            <v-card-title>
                <v-row align="center" justify="space-between">
                    <v-col>
                        <div class="d-flex align-center">
                            <v-icon class="me-2">mdi-cart-variant</v-icon>
                            <v-breadcrumbs :items="breadcrumps"></v-breadcrumbs>
                        </div>
                    </v-col>
                    <v-col cols="auto">
                        <v-btn href="/ordens" color="primary" prepend-icon="mdi-arrow-left-top-bold">
                            Voltar
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-title>
                <v-row>
                    <v-col :cols="9">
                        Total: {{ amount }}
                    </v-col>
                    <v-col>
                        <v-btn @click="openModal" color="primary" prepend-icon="mdi-cart-plus">
                            add Produto
                        </v-btn>
                    </v-col>
                    <v-col>
                        <v-btn @click="submitForm" color="success">
                            Fechar pedido
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-title>
                <v-data-table-server :headers="headers" :items="itens" :items-length="itens.length" item-value="id">
                    <template #item.item="{ item }">
                        {{ `#${item.item}` }}
                    </template>
                    <template #item.produto="{ item }">
                        {{ item.produto.nome }}
                    </template>
                    <template #item.data_vencimento="{ item }">
                        {{ formatDate(item.data_vencimento) }}
                    </template>
                    <template #item.fornecedor="{ item }">
                        {{ item.fornecedor.nome }}
                    </template>
                    <template #item.categoria="{ item }">
                        {{ item.produto.categoria.nome }}
                    </template>
                    <template #item.createdAt="{ item }">
                        {{ formatDate(item.createdAt) }}
                    </template>
                    <template #item.updatedAt="{ item }">
                        {{ formatDate(item.updatedAt) }}
                    </template>
                    <template #item.quantidade="{ item }">
                        <v-number-input v-model="item.quantidade" control-variant="split"
                            @update:model-value="(value) => updateinput(value, itens)"></v-number-input>
                    </template>
                    <template #item.actions="{ item }">
                        <v-btn icon="mdi-delete" size="small" variant="text" color="error"
                            @click="removeItem(item.item)" />
                    </template>

                    <template #no-data>
                        <div class="text-center py-4">
                            <v-icon size="64" color="grey">mdi-cart-plus</v-icon>
                            <p class="text-h6 mt-2">Nenhum Item incluindo</p>
                        </div>
                    </template>
                    <template #bottom>
                    </template>
                </v-data-table-server>
            </v-card-title>
            <v-divider class="mb-5"></v-divider>
        </v-card>
        <v-dialog v-model="openProduto" max-width="900">
            <AddProdutoModal @action-add="onActionAdd" />
        </v-dialog>

    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue"
import useToastCustom from "@/composables/toastCustom";
import { useRouter } from "vue-router";
import { useOrdem } from "@/composables/ordem";
import AddProdutoModal from "@/components/estoque/addProdutoModal.vue";
import type { Estoques } from "@/types/estoque-types";
import { format } from "date-fns";
const openProduto = ref(false)
const router = useRouter();
const toast = new useToastCustom()
const itens = ref<(Estoques & { item: number, quantidade: number })[]>([])
const amount = ref('R$ 0,00')

const breadcrumps = [
    { title: 'Ordem', href: '/ordens' },
]

const onActionAdd = (data: Estoques) => {
    const currentIndex = itens.value.findIndex((current) => {
        return current.id == data.id
    })
    if (currentIndex != -1) {
        const aux = itens.value[currentIndex];
        console.log(data.id)
        itens.value = itens.value.filter((current) => current.id !== data.id);
        itens.value.unshift({
            ...data,
            ...{
                item: Number(aux?.item),
                quantidade: Number(aux?.quantidade) + 1
            }
        })
    } else {
        itens.value.unshift({
            ...data,
            ...{ item: (itens.value.length + 1), quantidade: 1 }
        })
    }

    amount.value = formatCurrency(itens.value.reduce(
        (t, { quantidade, preco_custo }) => t + (quantidade * Number(preco_custo)),
        0,))

};


const removeItem = (item: number) => {
    itens.value = itens.value.filter((current) => current.item !== item);
};


const {
    loading,
    errorOrdem,
    createOrdem,
} = useOrdem()


const openModal = () => {
    openProduto.value = true
}

const headers = ref([
    { title: "Item", key: "item", align: "start" },
    { title: "Produto", key: "produto", align: "start" },
    { title: "Fornecedor", key: "fornecedor", align: "start" },
    { title: "Categoria", key: "categoria", align: "start" },
    { title: "Quantidade", key: "quantidade", align: "center" },
    { title: "Ações", key: "actions", align: "center", sortable: false },
] as const)

const formatCurrency = (valor: number) => {
    const formatador = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
    return formatador.format(valor);
}

const formatDate = (date: string) => {
    return format(new Date(date), 'dd/MM/yyyy')
}

const updateinput = (value: number, itens: (Estoques & { item: number, quantidade: number })[]) => {
    if (itens) {
        amount.value = formatCurrency(itens.reduce(
            (t, { quantidade, preco_custo }) => t + (quantidade * Number(preco_custo)),
            0,))
    }
}

const submitForm = async () => {
    const result = await createOrdem({
        itens: itens.value.map(item => {
            return {
                estoque_id: item.id,
                quantidade: item.quantidade,
            }
        })
    })

    toast.success(result.message);
    router.push(`/ordens`)
}

watch(itens, (itens) => {
    if (itens) {
        amount.value = formatCurrency(itens.reduce(
            (t, { quantidade, preco_custo }) => t + (quantidade * Number(preco_custo)),
            0,))
    }
})

watch(errorOrdem, (newError) => {
    if (newError) {
        toast.error(newError);
    }
})

//equivalente ao useeffect no react
onMounted(() => {

})
</script>
