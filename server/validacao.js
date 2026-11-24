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
