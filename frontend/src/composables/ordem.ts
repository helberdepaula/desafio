import { ApiErrorHandler } from "@/service/error-handler-exceptions";
import { ordemService } from "@/service/ordem.service";
import { unidadeService } from "@/service/unidades-service";
import type { CreateOrdem, Ordem, SearchOrdem } from "@/types/ordem-type";

import { ref, computed } from "vue";

export function useOrdem() {
  const ordens = ref<Ordem[]>([]);
  const orden = ref<Ordem>();
  const loading = ref(false);
  const errorOrdem = ref<string | null>(null);
  const totalItems = ref(0);
  const currentPage = ref(1);
  const itemsPerPage = ref(10);

  const totalPages = computed(() =>
    Math.ceil(totalItems.value / itemsPerPage.value)
  );
  const hasData = computed(() => ordens.value.length > 0);
  const isEmpty = computed(() => !hasData.value && !loading.value);

  const clearError = () => {
    errorOrdem.value = null;
  };

  const setLoading = (value: boolean) => {
    loading.value = value;
    if (value) clearError();
  };

  const handleError = (err: any) => {
    const error = ApiErrorHandler.handle(err);
    errorOrdem.value = error.message;
  };

  const fetchOrdem = async (params?: SearchOrdem) => {
    try {
      setLoading(true);
      const response = await ordemService.findAll(params);
      ordens.value = response.data;
      totalItems.value = response.meta.total;
      currentPage.value = response.meta.page;
      itemsPerPage.value = response.meta.limit;
    } catch (err) {
      handleError(err);
      ordens.value = [];
    } finally {
      setLoading(false);
    }
  };

  const createOrdem = async (data: CreateOrdem) => {
    try {
      setLoading(true);
      const response = await ordemService.create(data);
      return response;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearData = () => {
    clearError();
  };

  return {
    ordens,
    loading,
    errorOrdem,
    hasData,
    totalItems,
    currentPage,
    itemsPerPage,
    totalPages,
    isEmpty,
    fetchOrdem,
    clearData,
    clearError,
    createOrdem
  };
}
