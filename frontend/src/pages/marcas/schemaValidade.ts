export const schemaValidade = {
  produto_id(value: string) {
    if (value) return true;
    return "Campo produto é obrigatório";
  },
  fornecedor_id(value: string) {
    if (value) return true;
    return "Campo fornecedor é obrigatório";
  },
  corredo(value: string) {
    if (value) return true;
    return "Campo corredo é obrigatório";
  },
  prateleira(value: string) {
    if (value) return true;
    return "Campo prateleira é obrigatório";
  },
  sku(value: string) {
    if (value) return true;
    return "Campo lote é obrigatório";
  },
  quantidade(value: string) {
    if (value) return true;
    return "Campo quantidade é obrigatório";
  },
  preco_custo(value: string) {
    if (value) return true;
    return "Campo preco de custo é obrigatório";
  },
  data_vencimento(value: string) {
    if (value) return true;
    return "Campo data de vencimento é obrigatório";
  },
};
