import type {
  RelatorioResult,
  ReltorioResponse,
  SearchCritico,
  SearchEntrada,
  SearchRelatorio,
  SearchValorBrutoMensal,
} from "@/types/relatorios-types";
import { apiService } from "./requet-service";

class RelatoriosService {
  async findAll(params?: SearchRelatorio): Promise<RelatorioResult> {
    return apiService.get<RelatorioResult>("/relatorios", { params });
  }

  async relatorioVencimento(): Promise<ReltorioResponse> {
    return apiService.get<ReltorioResponse>(`/relatorios/vencimento`);
  }

  async relatorioCritico(params: SearchCritico): Promise<ReltorioResponse> {
    return apiService.get<ReltorioResponse>(`/relatorios/critico`, {
      params,
    });
  }

  async realatorioEntradaEstoque(
    params: SearchEntrada
  ): Promise<ReltorioResponse> {
    return apiService.get<ReltorioResponse>(`/relatorios/entrada`, {
      params,
    });
  }

  async relatorioValorBrutoMensal(
    params: SearchValorBrutoMensal
  ): Promise<ReltorioResponse> {
    return apiService.get<ReltorioResponse>(`/relatorios/valor-bruto`, {
      params,
    });
  }
}

export const relatoriosService = new RelatoriosService();
