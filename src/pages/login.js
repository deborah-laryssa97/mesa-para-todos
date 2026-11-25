import { entrar } from "../api.js";
import { esconderMensagem, mostrarMensagem } from "../ui.js";

export function telaLogin(app, aoEntrar) {
  app.innerHTML = `
    <section class="login">
      <h1>Acessar o sistema</h1>

      <form id="form-login" class="cartao">
        <label>
          E-mail
          <input
            name="email"
            type="email"
            required
            autocomplete="username"
          />
        </label>

        <label>
          Senha
          <input
            name="senha"
            type="password"
            required
            autocomplete="current-password"
          />
        </label>

        <p id="msg-login" class="mensagem" role="status" hidden></p>

        <button type="submit">Entrar</button>
      </form>
    </section>
  `;

  const form = app.querySelector("#form-login");
  const mensagem = app.querySelector("#msg-login");
  const botao = form.querySelector('button[type="submit"]');
  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    if (botao.disabled) return;

    botao.disabled = true;
    botao.textContent = "Entrando...";
    esconderMensagem(mensagem);

    try {
      await entrar(form.elements.email.value.trim(), form.elements.senha.value);

      form.reset();
      aoEntrar();
    } catch (erro) {
      mostrarMensagem(mensagem, erro.message, "erro");
      form.elements.senha.value = "";
      form.elements.senha.focus();
    } finally {
      botao.disabled = false;
      botao.textContent = "Entrar";
    }
  });
}
