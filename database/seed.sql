-- Mesa para Todos - dados iniciais do estoque
-- Cadastra os tipos sem alterar quantidades já existentes.

SET NAMES utf8mb4;

USE mesa_para_todos;

INSERT IGNORE INTO estoque (tipo)
VALUES
  ('cesta_alimentos'),
  ('kit_higiene');