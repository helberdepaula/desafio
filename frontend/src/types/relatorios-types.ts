export interface ReltorioResponse {
  message: string;
}

export interface SearchRelatorio {
  limit?: number;
  page?: number;
  nome?: string;
  tipo?: string;
  status?: string;
}

export interface SearchValorBrutoMensal {
  ano: string;
  mes: string;
}

export interface SearchEntrada {
  data_end: string;
  data_ini: string;
}

export interface SearchCritico {
  sku?: string;
}

export interface RelatorioResult {
  data: Relatorio[];
  meta: Meta;
}

export interface Relatorio {
  id: number;
  nome: string;
  path?: string;
  log: any;
  status: string;
  start: string;
  end?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Meta {
  page: number;
  limit: number;
  total: number;
}
