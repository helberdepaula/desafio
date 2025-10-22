import { ApiErrorHandler } from "@/service/error-handler-exceptions";
import { produtosService } from "@/service/produtos-service";
import type {
  CreateProdutoDto,
  Produto,
  SearchProdutoDto,
  UpdateProdutoDto,
} from "@/types/produtos-type";
import { ref, computed } from "vue";

export function useProdutos() {
  const produtos = ref<Produto[]>([]);
  const produto = ref<Produto | null>(null);
  const loading = ref(false);
  const errorProduto = ref<string | null>(null);
  const totalItems = ref(0);
  const currentPage = ref(1);
  const itemsPerPage = ref(10);

  const totalPages = computed(() =>
    Math.ceil(totalItems.value / itemsPerPage.value)
  );
  const hasData = computed(() => produtos.value.length > 0);
  const isEmpty = computed(() => !hasData.value && !loading.value);

  const clearError = () => {
    errorProduto.value = null;
  };

  const setLoading = (value: boolean) => {
    loading.value = value;
    if (value) clearError();
  };

  const handleError = (err: any) => {
    const error = ApiErrorHandler.handle(err);
    errorProduto.value = error.message;
  };

  const findSelectProduto = async (params?: SearchProdutoDto) => {
    try {
      setLoading(true);
      const response = await produtosService.findSelect(params);
      produtos.value = response;
    } catch (err) {
      handleError(err);
      produtos.value = [];
    } finally {
      setLoading(false);
    }
  };

  const find = async (id: number) => {
    try {
      setLoading(true);
      const response = await produtosService.findId(id);
      produto.value = response;
    } catch (err) {
      handleError(err);
      produtos.value = [];
    } finally {
      setLoading(false);
    }
  };

  const fetchProduto = async (params?: SearchProdutoDto) => {
    try {
      setLoading(true);
      const response = await produtosService.findAll(params);
      produtos.value = response.data;
      totalItems.value = response.meta.total;
      currentPage.value = response.meta.page;
      itemsPerPage.value = response.meta.limit;
    } catch (err) {
      handleError(err);
      produtos.value = [];
    } finally {
      setLoading(false);
    }
  };

  const createProduto = async (data: CreateProdutoDto) => {
    try {
      setLoading(true);
      const response = await produtosService.create(data);

      if (response.data) {
        produtos.value.unshift(response.data);
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

  const updateProduto = async (id: number, data: UpdateProdutoDto) => {
    try {
      setLoading(true);
      const response = await produtosService.update(id, data);

      const index = produtos.value.findIndex((f) => f.id === id);
      if (index !== -1) {
        const updatedFornecedor = await produtosService.findId(id);
        produtos.value[index] = updatedFornecedor;
      }

      if (produto.value?.id === id) {
        produto.value = await produtosService.findId(id);
      }

      return response;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removerProduto = async (id: number) => {
    try {
      setLoading(true);
      const response = await produtosService.delete(id);
      const index = produtos.value.findIndex((f) => f.id === id);
      if (index !== -1) {
        delete produtos.value[index];
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
    produto.value = null;
    totalItems.value = 0;
    currentPage.value = 1;
    clearError();
  };

  return {
    produtos,
    produto,
    loading,
    errorProduto,
    totalItems,
    currentPage,
    itemsPerPage,
    totalPages,
    hasData,
    isEmpty,
    find,
    findSelectProduto,
    fetchProduto,
    createProduto,
    updateProduto,
    removerProduto,
    clearData,
    clearError,
  };
}
