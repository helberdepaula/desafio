import { ApiResponseOptions } from '@nestjs/swagger';

export const getListRelatorio: ApiResponseOptions = {
  description: 'Lista de Relatororios gerados',
  content: {
    'application/json': {
      example: {
        data: [
          {
            id: 1,
            nome: 'nodeste',
          },
        ],
      },
    },
  },
};


export const createrRelatorio: ApiResponseOptions = {
  description: 'Usuário criado com sucesso',
  content: {
    'application/json': {
      example: {
        message: 'Usuário criado com sucesso',
      },
    },
  },
};