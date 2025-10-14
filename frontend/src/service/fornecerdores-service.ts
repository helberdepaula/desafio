import type {
  CreateFornecedorDto,
  Fornecedor,
  FornecedorCreateResponse,
  FornecedorDeleteResponse,
  FornecedoreResult,
  FornecedorUpdateResponse,
  SearchFornecedorDto,
  UpdateFornecedorDto,
} from "@/types/fornecedores-type";
import { apiService } from "./requet-service";

class FornecedorService {
    
  async findAll(params?: SearchFornecedorDto): Promise<FornecedoreResult> {
    return apiService.get<FornecedoreResult>("/fornecedores", { params });
  }

  async findId(id:number): Promise<Fornecedor> {
    return apiService.get<Fornecedor>(`/fornecedores/${id}`);
  }

  async create(data: CreateFornecedorDto): Promise<FornecedorCreateResponse> {
    return apiService.post<FornecedorCreateResponse>("/fornecedores", data);
  }

  async update(
    id: number,
    data: UpdateFornecedorDto
  ): Promise<FornecedorUpdateResponse> {
    return apiService.patch<FornecedorUpdateResponse>(
      `/fornecedores/${id}`,
      data
    );
  }

  async delete(id: number): Promise<FornecedorDeleteResponse> {
    return apiService.delete<FornecedorDeleteResponse>(`/fornecedores/${id}`);
  }
}

export const fornecedorService = new FornecedorService();
