export const schemaValidade = {
  codigo(value: string) {
    if (value) return true;
    return "Campo codigo é obrigatório";
  },
  nome(value: string) {
    if (value) return true;
    return "Campo nome é obrigatório";
  },
  marca_id(value: string) {
    if (value) return true;
    return "Campo marca é obrigatório";
  },
  categoria_id(value: string) {
    if (value) return true;
    return "Campo categoria é obrigatório";
  },
  unidade_id(value: string) {
    if (value) return true;
    return "Campo unidade é obrigatório";
  },
}