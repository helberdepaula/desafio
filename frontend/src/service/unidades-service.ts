import { apiService } from "./requet-service";
import type { Unidade } from "@/types/uniades.type";

class UnidadesService {
  async findSelect(): Promise<Unidade[]> {
    return apiService.get<Unidade[]>(`/unidades`);
  }
}

export const unidadeService = new UnidadesService();
