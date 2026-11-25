-- Mesa para Todos - dados iniciais do estoque
-- Cadastra os tipos sem alterar quantidades já existentes.

SET NAMES utf8mb4;

USE mesa_para_todos;

INSERT IGNORE INTO estoque (tipo)
VALUES
  ('cesta_alimentos'),
  ('kit_higiene');
-- Usuário fictício de demonstração
-- E-mail: voluntario@example.com
-- Senha de teste: mesaparatodos123

INSERT IGNORE INTO usuario (
  nome,
  email,
  senha_hash,
  perfil,
  ativo,
  data_cadastro
)
VALUES (
  'Voluntário Demo',
  'voluntario@example.com',
  '$2b$10$RCDAF.QtwQSFiccIxWhj5eMAmv8uS8YUmn646k9.8wQqLZhHXcw6.',
  'voluntario',
  TRUE,
  CURRENT_DATE()
);