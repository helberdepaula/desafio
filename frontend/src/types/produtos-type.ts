export interface SearchProdutoDto {
  limit?: number;
  page?: number;
  nome?: string;
}

export interface ProdutoResult {
  data: Produto[];
  meta: Meta;
}

export interface Produto {
  id: number;
  codigo: string;
  nome: string;
  categoria_id: number;
  unidade_id: number;
  marca_id: number;
  user_id: number;
  user: {
    id: number;
  };
  marca: {
    id: number;
    nome: string;
  };
  categoria: {
    id: number;
    nome: string;
  };
  unidade: {
    id: number;
    nome: string;
  };
  descricao: any;
  createdAt: string;
  updatedAt: string;
}

export interface Meta {
  page: number;
  limit: number;
  total: number;
}

export interface ProdutoResponse {
  message: string;
  data: Produto;
}

export interface ProdutoSelect {
  id: string;
  nome: string;
}

export interface CreateProdutoDto {
  codigo: string;
  nome: string;
  categoria_id: number;
  unidade_id: number;
  marca_id: number;
}

export interface UpdateProdutoDto extends Partial<CreateProdutoDto> {}
