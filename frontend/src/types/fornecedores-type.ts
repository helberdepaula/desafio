export interface SearchFornecedorDto {
  cnpj?: string;
  nome?: string;
  limit?: number;
  page?: number;
}

export interface FornecedoreResult {
  data: Fornecedor[];
  meta: Meta;
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

export interface Meta {
  page: number;
  limit: number;
  total: number;
}

export interface CreateFornecedorDto {
  cnpj: string;
  nome: string;
  municipio_id: number;
  logradouro: string;
  cep: string;
  numero: string;
  complemento: string;
  bairro: string;
}

export interface UpdateFornecedorDto {
  cnpj?: string;
  nome?: string;
  municipio_id?: number;
  logradouro?: string;
  cep?: string;
  numero?: string;
  complemento: string;
  bairro?: string;
}

export interface FornecedorCreateResponse {
  message: string
  data: Fornecedor
}

export interface FornecedorDeleteResponse {
  message: string
}

export interface FornecedorUpdateResponse {
  message: string
  data: Fornecedor
}
