import type {
  CreateEstoqueDto,
  Estoques,
  EstoquesResponse,
  EstoquesResult,
  SearchEstoque,
} from "@/types/estoque-types";
import { apiService } from "./requet-service";

class MarcasService {
  async findAll(params?: SearchEstoque): Promise<EstoquesResult> {
    return apiService.get<EstoquesResult>("/estoques", { params });
  }

  async findId(id: number): Promise<Estoques> {
    return apiService.get<Estoques>(`/estoques/${id}`);
  }

  async create(data: CreateEstoqueDto): Promise<EstoquesResponse> {
    return apiService.post<EstoquesResponse>("/estoques", data);
  }
}

export const estoqueService = new MarcasService();
