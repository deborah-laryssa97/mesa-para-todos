import { listarDoadores, listarDoacoes, listarItens, registrarDoacao } from "../api.js";

import { el, esconderMensagem, estado, formatarData, hoje, mostrarMensagem } from "../ui.js";

export async function telaNovaDoacao(app) {
  app.innerHTML = `
    <h1>Registrar doação</h1>

    <form id="form-doacao" class="cartao">
      <label>
        Doador
        <select name="id_doador" required>
          <option value="">Selecione um doador</option>
        </select>
      </label>

      <label>
        Data da doação
        <input name="data_doacao" type="date" required />
      </label>

      <label>
        Tipo de item
        <select name="tipo" required>
          <option value="">Selecione um tipo</option>
        </select>
      </label>

      <label>
        Quantidade
        <input
          name="quantidade"
          type="number"
          min="1"
          step="1"
          value="1"
          required
        />
      </label>

      <label>
        Observação <span class="opcional">(opcional)</span>
        <textarea name="observacao" maxlength="255"></textarea>
      </label>

      <button type="submit" disabled>Registrar doação</button>

      <p id="msg-doacao" class="mensagem" role="status">
        Carregando doadores e itens...
      </p>
    </form>
  `;

  const form = app.querySelector("#form-doacao");
  const campoDoador = form.elements.id_doador;
  const campoTipo = form.elements.tipo;
  const botaoSalvar = form.querySelector('button[type="submit"]');
  const mensagem = app.querySelector("#msg-doacao");

  form.elements.data_doacao.value = hoje();
  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    if (botaoSalvar.disabled) return;

    const dados = Object.fromEntries(new FormData(form));

    botaoSalvar.disabled = true;
    esconderMensagem(mensagem);

    try {
      const nova = await registrarDoacao({
        id_doador: Number(dados.id_doador),
        tipo: dados.tipo,
        quantidade: Number(dados.quantidade),
        data_doacao: dados.data_doacao,
        observacao: dados.observacao.trim(),
      });

      form.reset();
      form.elements.data_doacao.value = hoje();

      mostrarMensagem(mensagem, `Doação nº ${nova.id_doacao} registrada com sucesso.`);
    } catch (erro) {
      mostrarMensagem(mensagem, erro.message, "erro");
    } finally {
      botaoSalvar.disabled = false;
    }
  });

  try {
    const [doadores, itens] = await Promise.all([listarDoadores(), listarItens()]);

    if (doadores.length === 0) {
      mostrarMensagem(
        mensagem,
        "Cadastre um doador na tela Doadores antes de registrar uma doação.",
        "erro",
      );
      return;
    }

    if (itens.length === 0) {
      mostrarMensagem(mensagem, "Nenhum tipo de item disponível.", "erro");
      return;
    }

    campoDoador.append(
      ...doadores.map((doador) => el("option", { value: String(doador.id_doador) }, doador.nome)),
    );

    campoTipo.append(...itens.map((item) => el("option", { value: item.tipo }, item.nome)));

    esconderMensagem(mensagem);
    botaoSalvar.disabled = false;
  } catch (erro) {
    mostrarMensagem(mensagem, erro.message, "erro");
  }
}

export async function telaDoacoes(app) {
  app.innerHTML = `
    <h1>Doações</h1>
    <p id="msg-lista-doacoes" class="mensagem" role="status" hidden></p>
    <ul id="lista-doacoes" class="lista"></ul>
  `;

  const mensagem = app.querySelector("#msg-lista-doacoes");
  const lista = app.querySelector("#lista-doacoes");

  function cartaoDoacao(doacao) {
    return el(
      "li",
      { class: "cartao" },
      el("strong", {}, `Doação nº ${doacao.id_doacao}`),
      el("span", { class: "detalhe" }, `Doador: ${doacao.nome_doador}`),
      el("span", { class: "detalhe" }, `${doacao.quantidade} × ${doacao.nome_item}`),
      el(
        "time",
        {
          class: "detalhe",
          datetime: doacao.data_doacao,
        },
        `Data: ${formatarData(doacao.data_doacao)}`,
      ),
      doacao.observacao ? el("p", {}, `Observação: ${doacao.observacao}`) : null,
    );
  }

  lista.replaceChildren(estado("Carregando doações..."));

  try {
    const doacoes = await listarDoacoes();

    if (doacoes.length === 0) {
      lista.replaceChildren(estado("Nenhuma doação registrada ainda."));
      return;
    }

    lista.replaceChildren(...doacoes.map(cartaoDoacao));
  } catch (erro) {
    lista.replaceChildren();
    mostrarMensagem(mensagem, erro.message, "erro");
  }
}
