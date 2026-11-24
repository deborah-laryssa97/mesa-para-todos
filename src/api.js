async function requisicao(caminho, opcoes = {}) {
  let resposta;

  try {
    resposta = await fetch(`/api${caminho}`, {
      ...opcoes,
      headers: {
        "Content-Type": "application/json",
        ...opcoes.headers,
      },
    });
  } catch {
    throw new Error("Sem conexão com o servidor. Tente novamente.");
  }

  if (resposta.status === 204) {
    return null;
  }

  const dados = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    throw new Error(dados?.erro ?? "Não foi possível concluir o pedido ao servidor.");
  }

  if (dados === null) {
    throw new Error("O servidor enviou uma resposta inválida.");
  }

  return dados;
}

export const listarDoadores = () => requisicao("/doadores");

export const criarDoador = (doador) =>
  requisicao("/doadores", {
    method: "POST",
    body: JSON.stringify(doador),
  });

export const atualizarDoador = (id, doador) =>
  requisicao(`/doadores/${id}`, {
    method: "PUT",
    body: JSON.stringify(doador),
  });

export const excluirDoador = (id) =>
  requisicao(`/doadores/${id}`, {
    method: "DELETE",
  });

export const listarItens = () => requisicao("/itens");

export const listarDoacoes = () => requisicao("/doacoes");

export const registrarDoacao = (doacao) =>
  requisicao("/doacoes", {
    method: "POST",
    body: JSON.stringify(doacao),
  });

export const verificarSaude = () => requisicao("/health");
