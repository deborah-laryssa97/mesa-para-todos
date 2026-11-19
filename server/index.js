import "dotenv/config";
import express from "express";
import db from "./db.js";

const app = express();
app.use(express.json());

app.get("/api/health", async (req, res) => {
  let banco = "ok";

  try {
    await db.query("SELECT 1");
  } catch (erro) {
    banco = "sem conexão";
    console.error("Falha na conexão com o banco:", erro.code);
  }

  res.json({
    status: "ok",
    banco,
    app: "Mesa para Todos",
    hora: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
