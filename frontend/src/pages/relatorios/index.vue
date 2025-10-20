<template>
    <v-card>
        <v-card-title>
            <v-row align="center" justify="space-between">
                <v-col>
                    <div class="d-flex align-center">
                        <v-icon class="me-2">mdi-package-variant</v-icon>
                        <v-breadcrumbs :items="breadcrumps"></v-breadcrumbs>
                    </div>
                </v-col>
                <v-col cols="auto">

                </v-col>
            </v-row>
        </v-card-title>
        <v-divider class="mb-5"></v-divider>
        <v-card-text>
            <v-row class="mb-4">
                <v-col cols="12" md="4">
                    <v-text-field input-class="input-controll" v-model="search" prepend-inner-icon="mdi-magnify"
                        label="Buscar nome..." hide-details  />
                </v-col>
            </v-row>

            <v-data-table-server v-model:items-per-page="itemsPerPage" :headers="headers" :items="produtos"
                :items-length="totalItems" :loading="loading" item-value="id" @update:options="loadItems">
     
                <template #item.actions="{ item }">
                   
                </template>

                <template #no-data>
                    <div class="text-center py-4">
                        <v-icon size="64" color="grey">mdi-tag-check-outline</v-icon>
                        <p class="text-h6 mt-2">Nenhum relatorios encontrado</p>
                    </div>
                </template>
            </v-data-table-server>
        </v-card-text>
    </v-card>

</template>
<script lang="ts" setup>
import { useProdutos } from '@/composables/produtos';
import useToastCustom from '@/composables/toastCustom';
import type { Produto } from '@/types/produtos-type';
import { format } from 'date-fns';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
const search = ref("")
const deleteDialog = ref(false)
const selectProduto = ref<Produto | null>(null)

const breadcrumps = [
    { title: 'Produtos', href: '/produtos' },
]

const router = useRouter();
const toast = new useToastCustom()
const {
    errorProduto,
    produtos,
    fetchProduto,
    totalItems,
    itemsPerPage,
    currentPage,
    loading,
    removerProduto
} = useProdutos()

const headers = ref([
    { title: "Nome", key: "nome", align: "start" },
    { title: "Criado em", key: "createdAt", align: "start", sortable: false },
    { title: "Atualizado em", key: "updatedAt", align: "start", sortable: false },
    { title: "Ações", key: "actions", align: "center", sortable: false },
] as const)

const loadItems = ({ page, itemsPerPage: perPage }: { page: number, itemsPerPage: number }) => {
    itemsPerPage.value = perPage
    currentPage.value = page
   
}



</script>