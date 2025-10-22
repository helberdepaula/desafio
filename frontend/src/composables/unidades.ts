import { ApiErrorHandler } from "@/service/error-handler-exceptions";
import { unidadeService } from "@/service/unidades-service";
import type { Unidade } from "@/types/uniades.type";

import { ref, computed } from "vue";

export function useUnidades() {
  const unidades = ref<Unidade[]>([]);
  const loading = ref(false);
  const errorUnidade = ref<string | null>(null);

  const hasData = computed(() => unidades.value.length > 0);
  const isEmpty = computed(() => !hasData.value && !loading.value);

  const clearError = () => {
    errorUnidade.value = null;
  };

  const setLoading = (value: boolean) => {
    loading.value = value;
    if (value) clearError();
  };

  const handleError = (err: any) => {
    const error = ApiErrorHandler.handle(err);
    errorUnidade.value = error.message;
  };

  const findSelectUnidade = async () => {
    try {
      setLoading(true);
      const response = await unidadeService.findSelect();
      unidades.value = response;
    } catch (err) {
      handleError(err);
      unidades.value = [];
    } finally {
      setLoading(false);
    }
  };

  const clearData = () => {
    clearError();
  };

  return {
    unidades,
    loading,
    errorUnidade,
    hasData,
    isEmpty,
    findSelectUnidade,
    clearData,
    clearError,
  };
}
