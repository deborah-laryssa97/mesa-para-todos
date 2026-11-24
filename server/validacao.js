const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarDoador(dados = {}) {
  const nome = dados.nome;
  const email = dados.email;
  const telefone = dados.telefone;

  if (typeof nome !== "string" || nome.trim() === "") {
    return "Nome é obrigatório";
  }

  if (nome.length > 150) {
    return "Nome deve ter no máximo 150 caracteres";
  }

  if (email !== undefined && email !== null && email !== "") {
    if (typeof email !== "string" || !FORMATO_EMAIL.test(email)) {
      return "E-mail inválido";
    }

    if (email.length > 100) {
      return "E-mail deve ter no máximo 100 caracteres";
    }
  }

  if (telefone !== undefined && telefone !== null && telefone !== "") {
    if (typeof telefone !== "string") {
      return "Telefone deve ser um texto";
    }

    if (telefone.length > 20) {
      return "Telefone deve ter no máximo 20 caracteres";
    }
  }

  return null;
}

export function validarDoacao(dados = {}) {
  const idDoador = dados.id_doador;
  const tipo = dados.tipo;
  const quantidade = dados.quantidade;
  const dataDoacao = dados.data_doacao;

  if (!Number.isSafeInteger(idDoador) || idDoador < 1) {
    return "id_doador deve ser um número inteiro positivo";
  }

  if (tipo !== "cesta_alimentos" && tipo !== "kit_higiene") {
    return "Selecione cesta de alimentos ou kit de higiene";
  }

  if (!Number.isSafeInteger(quantidade) || quantidade < 1) {
    return "Quantidade deve ser um número inteiro maior que zero";
  }

  if (typeof dataDoacao !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dataDoacao)) {
    return "Data da doação deve estar no formato AAAA-MM-DD";
  }

  const observacao = dados.observacao;

  if (observacao !== undefined && observacao !== null) {
    if (typeof observacao !== "string") {
      return "Observação deve ser um texto";
    }

    if (observacao.length > 255) {
      return "Observação deve ter no máximo 255 caracteres";
    }
  }

  return null;
}
