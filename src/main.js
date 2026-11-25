import "./style.css";

import { lerNomeUsuario, lerToken, sair, verificarSaude } from "./api.js";

import { el } from "./ui.js";
import { telaLogin } from "./pages/login.js";
import { telaDoadores } from "./pages/doadores.js";
import { telaNovaDoacao, telaDoacoes } from "./pages/doacoes.js";
const app = document.querySelector("#app");
const statusApi = document.querySelector("#status-api");
const topo = document.querySelector(".topo");
const menu = document.querySelector('nav[aria-label="Principal"]');

const nomeUsuario = el("span", { class: "usuario" });

const botaoSair = el("button", { type: "button", class: "secundario" }, "Sair");

const areaUsuario = el("div", { class: "sessao" }, nomeUsuario, botaoSair);

menu.hidden = true;
areaUsuario.hidden = true;

topo.append(areaUsuario);

botaoSair.addEventListener("click", () => {
  sair();
  void navegar();
});

const rotas = {
  "#/doadores": telaDoadores,
  "#/doacoes/nova": telaNovaDoacao,
  "#/doacoes": telaDoacoes,
};

async function navegar() {
  const token = lerToken();

  menu.hidden = !token;
  areaUsuario.hidden = !token;
  nomeUsuario.textContent = lerNomeUsuario();

  if (!token) {
    telaLogin(app, () => {
      void navegar();
    });
    return;
  }
  const caminho = location.hash || "#/doadores";
  const tela = rotas[caminho] ?? telaDoadores;

  try {
    await tela(app);
  } catch (erro) {
    console.error(erro);
    app.textContent = "Não foi possível abrir a tela. Atualize a página.";
  }
}

async function atualizarStatus() {
  try {
    const dados = await verificarSaude();

    statusApi.textContent = `${dados.status}, banco: ${dados.banco} (${dados.hora})`;
  } catch {
    statusApi.textContent = "API fora do ar";
  }
}

window.addEventListener("hashchange", () => {
  void navegar();
});

void navegar();
void atualizarStatus();
