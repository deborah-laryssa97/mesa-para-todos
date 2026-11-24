import { Router } from "express";
import db from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  const [itens] = await db.execute(`
    SELECT
      tipo,
      CASE tipo
        WHEN 'cesta_alimentos' THEN 'Cesta de alimentos'
        WHEN 'kit_higiene' THEN 'Kit de higiene'
      END AS nome
    FROM estoque
    ORDER BY tipo
  `);

  res.json(itens);
});

export default router;
