import { ApiProperty, ApiResponseOptions } from '@nestjs/swagger';

export const getListEstoque: ApiResponseOptions = {
  description: 'lista de produto no estoque retornada com sucesso',
  content: {
    'application/json': {
      example: {
        data: [
          {
            id: 1,
            nome: 'admin',
            email: 'admin@mail.com',
            pwd: 'hash',
            recoveryCode: null,
            perfil: 'ADMIN',
            createdAt: '2025-10-07T18:56:05.411Z',
            updatedAt: '2025-10-07T18:56:05.411Z',
          },
        ],
        meta: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 20,
        },
      },
    },
  },
};

const DetailObjet = {
  corredor: 'A1',
  prateleira: 'P25',
  secao: '20B',
  quantidade: 20,
  sku: 'JDF',
  preco_custo: '250.50',
  data_vencimento: '3562-02-11',
  user: {
    id: 1,
  },
  produto: {
    id: 3,
    codigo: 'KGB',
    nome: 'Frinha de trigo grossa',
    descricao: null,
    createdAt: '2025-10-13T16:49:54.010Z',
    updatedAt: '2025-10-13T16:49:54.010Z',
    categoria: {
      id: 1,
      nome: 'Yper',
      createdAt: '2025-10-13T16:30:53.237Z',
      updatedAt: '2025-10-13T16:30:53.237Z',
    },
    marca: {
      id: 1,
      nome: 'Mortandela de chernobyl ',
      status: 'ACTIVE',
      createdAt: '2025-10-13T16:02:44.178Z',
      updatedAt: '2025-10-13T16:02:44.178Z',
    },
    unidade: {
      id: 1,
      nome: 'Grama',
      createdAt: '2025-10-13T16:32:41.206Z',
      updatedAt: '2025-10-13T16:32:41.206Z',
    },
  },
  fornecedor: {
    id: 10,
    cnpj: '34831649000122',
    nome: 'Pedro Castilho Dantra',
    status: 'ACTIVE',
    endereco_id: 11,
    createdAt: '2025-10-14T18:02:05.634Z',
    updatedAt: '2025-10-14T18:02:05.634Z',
    endereco: {
      id: 11,
      municipio_id: 5200050,
      logradouro: 'rua era uma vez',
      cep: '74000000',
      numero: 'S/N',
      complemento: 'Apartamento x y z ',
      bairro: 'JD america ',
      createdAt: '2025-10-14T18:02:05.634Z',
      updatedAt: '2025-10-14T18:02:05.634Z',
      municipio: {
        id: 5200050,
        nome: 'Abadia de Goiás',
        createdAt: '2025-10-13T15:46:52.699Z',
        updatedAt: '2025-10-13T15:46:52.699Z',
        estado: {
          id: 52,
          nome: 'Goiás',
          uf: 'GO',
          createdAt: '2025-10-13T15:33:46.648Z',
          updatedAt: '2025-10-13T15:33:46.648Z',
        },
      },
    },
  },
};

export const getProdutoDetail: ApiResponseOptions = {
  description: 'Registro de um usuário',
  content: {
    'application/json': {
      example: DetailObjet,
    },
  },
};

export const createrProdutoResponse: ApiResponseOptions = {
  description: 'Entrada no estoque registrada com sucesso',
  content: {
    'application/json': {
      example: {
        message: 'Entrada no estoque registrada com sucesso',
        data: DetailObjet,
      },
    },
  },
};
