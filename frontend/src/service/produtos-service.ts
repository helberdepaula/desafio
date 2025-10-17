import type {
  CreateProdutoDto,
  Produto,
  ProdutoResponse,
  ProdutoResult,
  ProdutoSelect,
  SearchProdutoDto,
  UpdateProdutoDto,
} from "@/types/produtos-type";
import { apiService } from "./requet-service";

class ProdutosService {
  
  async findSelect(params?: SearchProdutoDto): Promise<Produto[]> {
    return apiService.get<Produto[]>(`/produtos/list-json`, { params });
  }

  async findAll(params?: SearchProdutoDto): Promise<ProdutoResult> {
    return apiService.get<ProdutoResult>("/produtos", { params });
  }

  async findId(id: number): Promise<Produto> {
    return apiService.get<Produto>(`/produtos/${id}`);
  }

  async create(data: CreateProdutoDto): Promise<ProdutoResponse> {
    return apiService.post<ProdutoResponse>("/produtos", data);
  }

  async update(id: number, data: UpdateProdutoDto): Promise<ProdutoResponse> {
    return apiService.patch<ProdutoResponse>(`/produtos/${id}`, data);
  }

  async delete(id: number): Promise<ProdutoResponse> {
    return apiService.delete<ProdutoResponse>(`/produtos/${id}`);
  }
}

export const produtosService = new ProdutosService();
