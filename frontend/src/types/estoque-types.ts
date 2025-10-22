export interface SearchEstoque {
  fornecedor?: string;
  produto?: string;
  sku?: string;
  categoria?: string;
  codigo?: string;
  limit?: number;
  page?: number;
}

export interface EstoquesResult {
  data: Estoques[];
  meta: Meta;
}

export interface Estoques {
  id: number;
  corredor: string;
  prateleira: string;
  secao: string;
  sku: string;
  quantidade: number;
  preco_custo: string;
  data_vencimento: string;
  createdAt: string;
  updatedAt: string;
  fornecedor: Fornecedor;
  produto: Produto;
}

export interface Fornecedor {
  id: number;
  cnpj: string;
  nome: string;
  status: string;
  endereco_id: number;
  createdAt: string;
  updatedAt: string;
}

export interface Root {
  produto: Produto
}

export interface Produto {
  id: number
  codigo: string
  nome: string
  descricao: any
  createdAt: string
  updatedAt: string
  categoria: Categoria
  marca: Marca
  unidade: Unidade
}

export interface Categoria {
  id: number
  nome: string
  createdAt: string
  updatedAt: string
}

export interface Marca {
  id: number
  nome: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface Unidade {
  id: number
  nome: string
  createdAt: string
  updatedAt: string
}

export interface Meta {
  page: number;
  limit: number;
  total: number;
}

export interface CreateEstoqueDto {
  produto_id: number;
  fornecedor_id: number;
  corredor: string;
  prateleira: string;
  secao: string;
  sku: string;
  quantidade: string;
  preco_custo: string;
  preco_venda: string;
  data_vencimento: string;
}

export interface UpdateEstoqueDto extends Partial<CreateEstoqueDto> {}


export interface EstoquesResponse {
  message: string;
  data: Estoques;
}