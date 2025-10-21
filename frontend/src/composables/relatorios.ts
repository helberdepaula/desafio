import { ApiErrorHandler } from "@/service/error-handler-exceptions";
import { relatoriosService } from "@/service/relatorios-service";

import type { Relatorio, SearchRelatorio } from "@/types/relatorios-types";
import { ref, computed } from "vue";

export function useRelatorio() {
  const relatorios = ref<Relatorio[]>([]);
  const relatorio = ref<Relatorio | null>(null);
  const loading = ref(false);
  const errorRelatorio = ref<string | null>(null);
  const totalItems = ref(0);
  const currentPage = ref(1);
  const itemsPerPage = ref(10);

  const totalPages = computed(() =>
    Math.ceil(totalItems.value / itemsPerPage.value)
  );
  const hasData = computed(() => relatorios.value.length > 0);
  const isEmpty = computed(() => !hasData.value && !loading.value);

  const clearError = () => {
    errorRelatorio.value = null;
  };

  const setLoading = (value: boolean) => {
    loading.value = value;
    if (value) clearError();
  };

  const handleError = (err: any) => {
    const error = ApiErrorHandler.handle(err);
    errorRelatorio.value = error.message;
  };

  const fetchRelatorio = async (params?: SearchRelatorio) => {
    try {
      setLoading(true);
      const response = await relatoriosService.findAll(params);
      relatorios.value = response.data;
      totalItems.value = response.meta.total;
      currentPage.value = response.meta.page;
      itemsPerPage.value = response.meta.limit;
    } catch (err) {
      handleError(err);
      relatorios.value = [];
    } finally {
      setLoading(false);
    }
  };

  const clearData = () => {
    relatorios.value = [];
    relatorio.value = null;
    totalItems.value = 0;
    currentPage.value = 1;
    clearError();
  };

  return {
    relatorios,
    relatorio,
    loading,
    errorRelatorio,
    totalItems,
    currentPage,
    itemsPerPage,
    totalPages,
    hasData,
    isEmpty,
    fetchRelatorio,
    clearData,
    clearError,
  };
}
