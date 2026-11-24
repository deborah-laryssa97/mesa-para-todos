import { Router } from "express";
import db from "../db.js";
import { validarDoador } from "../validacao.js";

const router = Router();

router.get("/", async (req, res) => {
  const [doadores] = await db.execute(`
    SELECT id_doador, nome, email, telefone, data_cadastro
    FROM doador
    ORDER BY nome
  `);

  res.json(doadores);
});

router.post("/", async (req, res) => {
  const erro = validarDoador(req.body);

  if (erro) {
    return res.status(400).json({ erro });
  }

  const nome = req.body.nome.trim();
  const email = req.body.email || null;
  const telefone = req.body.telefone || null;

  try {
    const [resultado] = await db.execute(
      `INSERT INTO doador (nome, email, telefone, data_cadastro)
       VALUES (?, ?, ?, CURRENT_DATE())`,
      [nome, email, telefone],
    );

    res.status(201).json({
      id_doador: resultado.insertId,
      nome,
      email,
      telefone,
    });
  } catch (erro) {
    if (erro.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ erro: "E-mail já cadastrado" });
    }

    throw erro;
  }
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id < 1) {
    return res.status(400).json({ erro: "ID inválido" });
  }

  const [linhas] = await db.execute(
    `SELECT id_doador, nome, email, telefone, data_cadastro
     FROM doador
     WHERE id_doador = ?`,
    [id],
  );

  if (linhas.length === 0) {
    return res.status(404).json({ erro: "Doador não encontrado" });
  }

  res.json(linhas[0]);
});

router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id < 1) {
    return res.status(400).json({ erro: "ID inválido" });
  }

  const erro = validarDoador(req.body);

  if (erro) {
    return res.status(400).json({ erro });
  }

  const nome = req.body.nome.trim();
  const email = req.body.email || null;
  const telefone = req.body.telefone || null;

  try {
    const [resultado] = await db.execute(
      `UPDATE doador
       SET nome = ?, email = ?, telefone = ?
       WHERE id_doador = ?`,
      [nome, email, telefone, id],
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Doador não encontrado" });
    }

    res.json({
      id_doador: id,
      nome,
      email,
      telefone,
    });
  } catch (erro) {
    if (erro.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ erro: "E-mail já cadastrado" });
    }

    throw erro;
  }
});

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id < 1) {
    return res.status(400).json({ erro: "ID inválido" });
  }

  try {
    const [resultado] = await db.execute("DELETE FROM doador WHERE id_doador = ?", [id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Doador não encontrado" });
    }

    res.status(204).end();
  } catch (erro) {
    if (erro.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        erro: "Doador possui doações registradas e não pode ser excluído",
      });
    }

    throw erro;
  }
});

export default router;
