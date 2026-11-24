import { Router } from "express";
import db from "../db.js";
import { validarDoacao } from "../validacao.js";

const router = Router();

router.get("/", async (req, res) => {
  const [doacoes] = await db.execute(`
    SELECT
      d.id_doacao,
      d.id_doador,
      dr.nome AS nome_doador,
      d.tipo,
      CASE d.tipo
        WHEN 'cesta_alimentos' THEN 'Cesta de alimentos'
        WHEN 'kit_higiene' THEN 'Kit de higiene'
      END AS nome_item,
      d.quantidade,
      d.data_doacao,
      d.observacao
    FROM doacao d
    JOIN doador dr ON dr.id_doador = d.id_doador
    ORDER BY d.data_doacao DESC, d.id_doacao DESC
  `);

  res.json(doacoes);
});

router.post("/", async (req, res) => {
  const erro = validarDoacao(req.body);

  if (erro) {
    return res.status(400).json({ erro });
  }

  const { id_doador, tipo, quantidade, data_doacao } = req.body;
  const observacao = req.body.observacao || null;

  const conexao = await db.getConnection();

  try {
    await conexao.beginTransaction();

    const [estoque] = await conexao.execute(
      "UPDATE estoque SET quantidade = quantidade + ? WHERE tipo = ?",
      [quantidade, tipo],
    );

    if (estoque.affectedRows === 0) {
      await conexao.rollback();
      return res.status(400).json({
        erro: "Tipo de item não cadastrado no estoque",
      });
    }

    const [resultado] = await conexao.execute(
      `INSERT INTO doacao
       (id_doador, tipo, quantidade, data_doacao, observacao)
       VALUES (?, ?, ?, ?, ?)`,
      [id_doador, tipo, quantidade, data_doacao, observacao],
    );

    await conexao.commit();

    res.status(201).json({
      id_doacao: resultado.insertId,
      id_doador,
      tipo,
      quantidade,
      data_doacao,
      observacao,
    });
  } catch (erro) {
    await conexao.rollback();

    if (erro.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ erro: "Doador não encontrado" });
    }

    if (erro.code === "ER_TRUNCATED_WRONG_VALUE") {
      return res.status(400).json({ erro: "Data da doação inválida" });
    }

    if (erro.code === "ER_WARN_DATA_OUT_OF_RANGE") {
      return res.status(400).json({
        erro: "Valor numérico fora do limite permitido",
      });
    }

    throw erro;
  } finally {
    conexao.release();
  }
});

export default router;
