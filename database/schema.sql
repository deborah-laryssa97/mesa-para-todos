-- Mesa para Todos - schema.sql
-- Uso em desenvolvimento: recria o banco e apaga os dados anteriores.

SET NAMES utf8mb4;

DROP DATABASE IF EXISTS mesa_para_todos;

CREATE DATABASE mesa_para_todos
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE mesa_para_todos;

-- Endereço do doador omitido por não ser necessário ao recebimento no local.
CREATE TABLE doador (
  id_doador INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  telefone VARCHAR(20),
  email VARCHAR(100) UNIQUE,
  data_cadastro DATE NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE usuario (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  perfil ENUM('coordenador', 'voluntario') NOT NULL DEFAULT 'voluntario',
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  data_cadastro DATE NOT NULL
);

CREATE TABLE familia (
  id_familia INT AUTO_INCREMENT PRIMARY KEY,
  nome_responsavel VARCHAR(150) NOT NULL,
  endereco VARCHAR(255) NOT NULL,
  comunidade VARCHAR(100) NOT NULL,
  num_membros INT NOT NULL DEFAULT 1 CHECK (num_membros > 0),
  data_cadastro DATE NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE estoque (
  id_estoque INT AUTO_INCREMENT PRIMARY KEY,
  tipo ENUM('cesta_alimentos', 'kit_higiene') NOT NULL UNIQUE,
  quantidade INT NOT NULL DEFAULT 0 CHECK (quantidade >= 0),
  data_atualizacao TIMESTAMP NOT NULL
    DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE doacao (
  id_doacao INT AUTO_INCREMENT PRIMARY KEY,
  id_doador INT NOT NULL,
  tipo ENUM('cesta_alimentos', 'kit_higiene') NOT NULL,
  quantidade INT NOT NULL CHECK (quantidade > 0),
  data_doacao DATE NOT NULL,
  observacao TEXT,
  data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (id_doador)
    REFERENCES doador (id_doador)
    ON DELETE RESTRICT,

  FOREIGN KEY (tipo)
    REFERENCES estoque (tipo)
    ON DELETE RESTRICT
);

CREATE TABLE distribuicao (
  id_distribuicao INT AUTO_INCREMENT PRIMARY KEY,
  id_familia INT NOT NULL,
  id_usuario INT NOT NULL,
  tipo ENUM('cesta_alimentos', 'kit_higiene') NOT NULL,
  quantidade INT NOT NULL CHECK (quantidade > 0),
  data_distribuicao DATE NOT NULL,
  status ENUM('pendente', 'realizada', 'cancelada')
    NOT NULL DEFAULT 'pendente',
  observacao TEXT,

  FOREIGN KEY (id_familia)
    REFERENCES familia (id_familia)
    ON DELETE RESTRICT,

  FOREIGN KEY (id_usuario)
    REFERENCES usuario (id_usuario)
    ON DELETE RESTRICT,

  FOREIGN KEY (tipo)
    REFERENCES estoque (tipo)
    ON DELETE RESTRICT
);