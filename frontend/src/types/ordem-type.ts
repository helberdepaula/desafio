export interface SearchOrdem {}

export interface OrdemResult {
  data: Ordem[];
  meta: Meta;
}

export interface Ordem {
  id: number;
  valor_total: string;
  data_venda: string;
  quantide_itens: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Meta {
  page: number;
  limit: number;
  total: number;
}

export interface CreateOrdem {
  itens: {
    estoque_id: number;
    quantidade: number;
  }[];
}

export interface OrdemResponse {
  message: string;
}
