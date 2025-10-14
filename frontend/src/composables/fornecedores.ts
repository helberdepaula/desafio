import { fornecedorService } from "@/service/fornecerdores-service";
import type {
  CreateFornecedorDto,
  Fornecedor,
  SearchFornecedorDto,
  UpdateFornecedorDto,
} from "@/types/fornecedores-type";
import { ref, computed } from "vue";

export function useFornecedores() {
  const fornecedores = ref<Fornecedor[]>([]);
  const fornecedor = ref<Fornecedor | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const totalItems = ref(0);
  const currentPage = ref(1);
  const itemsPerPage = ref(10);

  const totalPages = computed(() =>
    Math.ceil(totalItems.value / itemsPerPage.value)
  );
  const hasData = computed(() => fornecedores.value.length > 0);
  const isEmpty = computed(() => !hasData.value && !loading.value);

  const clearError = () => {
    error.value = null;
  };

  const setLoading = (value: boolean) => {
    loading.value = value;
    if (value) clearError();
  };

  const handleError = (err: any) => {
    console.error("Erro no fornecedores service:", err);
    error.value =
      err.response?.data?.message || err.message || "Erro desconhecido";
  };

  const fetchFornecedores = async (params?: SearchFornecedorDto) => {
    try {
      setLoading(true);
      const response = await fornecedorService.findAll(params);
      fornecedores.value = response.data;
      totalItems.value = response.meta.total;
      currentPage.value = response.meta.page;
      itemsPerPage.value = response.meta.limit;
    } catch (err) {
      handleError(err);
      fornecedores.value = [];
    } finally {
      setLoading(false);
    }
  };

  const createFornecedor = async (data: CreateFornecedorDto) => {
    try {
      setLoading(true);
      const response = await fornecedorService.create(data);

      if (response.data) {
        fornecedores.value.unshift(response.data);
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

  const updateFornecedor = async (id: number, data: UpdateFornecedorDto) => {
    try {
      setLoading(true);
      const response = await fornecedorService.update(id, data);

      const index = fornecedores.value.findIndex((f) => f.id === id);
      if (index !== -1) {
        const updatedFornecedor = await fornecedorService.findId(id);
        fornecedores.value[index] = updatedFornecedor;
      }

      if (fornecedor.value?.id === id) {
        fornecedor.value = await fornecedorService.findId(id);
      }

      return response;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFornecedor = async (id: number) => {
    try {
      setLoading(true);
      const response = await fornecedorService.delete(id);
      const index = fornecedores.value.findIndex((f) => f.id === id);
      if (index !== -1) {
        delete fornecedores.value[index];
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
    fornecedores.value = [];
    fornecedor.value = null;
    totalItems.value = 0;
    currentPage.value = 1;
    clearError();
  };

  return {
    fornecedores,
    fornecedor,
    loading,
    error,
    totalItems,
    currentPage,
    itemsPerPage,
    totalPages,
    hasData,
    isEmpty,
    fetchFornecedores,
    createFornecedor,
    updateFornecedor,
    removeFornecedor,
    clearData,
    clearError,
  };
}
