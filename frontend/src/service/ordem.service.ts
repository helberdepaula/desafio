import type {
  CreateOrdem,
  Ordem,
  OrdemResponse,
  OrdemResult,
  SearchOrdem,
} from "@/types/ordem-type";
import { apiService } from "./requet-service";

class OrdemService {

  async findAll(params?: SearchOrdem): Promise<OrdemResult> {
    return apiService.get<OrdemResult>("/pedidos", { params });
  }

  async findId(id: number): Promise<Ordem> {
    return apiService.get<Ordem>(`/pedidos/${id}`);
  }

  async create(data: CreateOrdem): Promise<OrdemResponse> {
    return apiService.post<OrdemResponse>("/pedidos", data);
  }

  async cancelarItem(id: number): Promise<OrdemResponse> {
    return apiService.delete<OrdemResponse>(`/pedidos/item/${id}`);
  }

  async cancelar(id: number): Promise<OrdemResponse> {
    return apiService.delete<OrdemResponse>(`/pedidos/${id}`);
  }
  
}

export const ordemService = new OrdemService();
