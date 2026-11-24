import "./style.css";
import { verificarSaude } from "./api.js";
import { telaDoadores } from "./pages/doadores.js";

const app = document.querySelector("#app");
const statusApi = document.querySelector("#status-api");

const rotas = {
  "#/doadores": telaDoadores,
};

async function navegar() {
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
