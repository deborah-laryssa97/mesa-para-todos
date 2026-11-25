const CHAVE_TOKEN = "mesa_para_todos_token";
const CHAVE_NOME = "mesa_para_todos_usuario";

export function lerToken() {
  return localStorage.getItem(CHAVE_TOKEN);
}

export function lerNomeUsuario() {
  return localStorage.getItem(CHAVE_NOME) ?? "";
}

export function sair() {
  localStorage.removeItem(CHAVE_TOKEN);
  localStorage.removeItem(CHAVE_NOME);
}

async function requisicao(caminho, opcoes = {}) {
  let resposta;
  const token = lerToken();

  if (token) {
    opcoes.headers = {
      ...opcoes.headers,
      Authorization: `Bearer ${token}`,
    };
  }

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

export async function entrar(email, senha) {
  const dados = await requisicao("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, senha }),
  });

  localStorage.setItem(CHAVE_TOKEN, dados.token);
  localStorage.setItem(CHAVE_NOME, dados.usuario.nome);

  return dados.usuario;
}
