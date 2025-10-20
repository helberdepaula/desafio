import { isAfter } from "date-fns";
export const schemaValidade = {
  fornecedor_id(value: string) {
    if (value) return true;
    return "Campo fornecedor é obrigatório";
  },
  produto_id(value: string) {
    if (value) return true;
    return "Campo produto é obrigatório";
  },
  sku(value: string) {
    if (value) return true;
    return "Campo lote é obrigatório";
  },
  quantidade(value: string) {
    if (Number(value) <= 0) {
      return "A quantidade é obrigatória e dever ser maior que 1 ";
    }
    return true;
  },
  data_vencimento(value: string) {
    if (!value) return "Campo data de vencimento é obrigatório";

    if (value.length >= 8) {
      const dataFormatting = value
        .replace(/\D/g, "")
        .replace(/^(\d{2})(\d{2})(\d{4})$/, "$3-$2-$1");

      const dataFutura = new Date(dataFormatting);
      const dataAtual = new Date();

      const _isAfter = isAfter(dataFutura, dataAtual);
      if (!_isAfter) {
        return "O produto está com a validade vencida";
      }
    }

    return true;
  },
  preco_custo(value: string) {
    if (value) return true;
    return "Campo preco de custom é obrigatório";
  },
  secao(value: string) {
    if (value) return true;
    return "Campo seção é obrigatório";
  },
  corredor(value: string) {
    if (value) return true;
    return "Campo corredo é obrigatório";
  },
  prateleira(value: string) {
    if (value) return true;
    return "Campo prateleira é obrigatório";
  },
};
