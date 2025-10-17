import { ApiErrorHandler } from "@/service/error-handler-exceptions";
import { estoqueService } from "@/service/estoques-service";
import type { CreateEstoqueDto, Estoques, SearchEstoque } from "@/types/estoque-types";
import { ref, computed } from "vue";

export function useEstoques() {
  const estoques = ref<Estoques[]>([]);
  const estoque = ref<Estoques | null>(null);
  const loading = ref(false);
  const errorEstoque = ref<string | null>(null);
  const totalItems = ref(0);
  const currentPage = ref(1);
  const itemsPerPage = ref(10);

  const totalPages = computed(() =>
    Math.ceil(totalItems.value / itemsPerPage.value)
  );
  const hasData = computed(() => estoques.value.length > 0);
  const isEmpty = computed(() => !hasData.value && !loading.value);

  const clearError = () => {
    errorEstoque.value = null;
  };

  const setLoading = (value: boolean) => {
    loading.value = value;
    if (value) clearError();
  };

  const handleError = (err: any) => {
    const error = ApiErrorHandler.handle(err);
    errorEstoque.value = error.message;
  };

  const find = async (id: number) => {
    try {
      setLoading(true);
      const response = await estoqueService.findId(id);
      estoque.value = response;
    } catch (err) {
      handleError(err);
      estoque.value = null;
    } finally {
      setLoading(false);
    }
  };

  const fetchEstoque = async (params?: SearchEstoque) => {
    try {
      setLoading(true);
      const response = await estoqueService.findAll(params);
      estoques.value = response.data;
      totalItems.value = response.meta.total;
      currentPage.value = response.meta.page;
      itemsPerPage.value = response.meta.limit;
    } catch (err) {
      handleError(err);
      estoques.value = [];
    } finally {
      setLoading(false);
    }
  };

  const createEstoque = async (data: CreateEstoqueDto) => {
    try {
      setLoading(true);
      const response = await estoqueService.create(data);

      if (response.data) {
        estoques.value.unshift(response.data);
        totalItems.value += 1;
      }

      return response;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearData = () => {
    estoques.value = [];
    estoque.value = null;
    totalItems.value = 0;
    currentPage.value = 1;
    clearError();
  };

  return {
    estoques,
    estoque,
    loading,
    errorEstoque,
    totalItems,
    currentPage,
    itemsPerPage,
    totalPages,
    hasData,
    isEmpty,
    find,
    fetchEstoque,
    createEstoque,
    clearData,
    clearError,
  };
}
