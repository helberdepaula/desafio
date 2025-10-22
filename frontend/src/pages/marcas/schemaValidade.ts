export const schemaValidade = {
  nome(value: string) {
    if (value) return true;
    return "Campo nome é obrigatório";
  },
};
