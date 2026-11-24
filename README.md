# Mesa para Todos

Sistema de Gestão de Doações para a ONG Mesa para Todos, de Recife–PE.

Projeto desenvolvido na disciplina Projeto Integrador Extensionista II, do curso de Análise e Desenvolvimento de Sistemas.

## Funcionalidades atuais

- Cadastro, listagem, edição e exclusão de doadores.
- Registro de doações com atualização automática do estoque.
- Listagem das doações com doador, item, quantidade, data e observação.
- Consulta ao status da API e da conexão com o banco de dados.

Cada doação registra um tipo de item: cesta de alimentos ou kit de higiene, com sua quantidade.

Doadores com doações registradas não podem ser excluídos, preservando o histórico.

## Tecnologias

- HTML, CSS e JavaScript
- Vite+
- Node.js
- Express
- dotenv
- MySQL 8.4
- mysql2
- Git e GitHub

## Requisitos

- Git instalado.
- Vite+ instalado, com o comando `vp` disponível.
- MySQL 8.4 instalado.
- Cliente MySQL disponível para executar os arquivos SQL.

Guia de instalação do Vite+: https://viteplus.dev/guide

## Como executar

Execute os comandos no Terminal, dentro da pasta do projeto.

### 1. Instalar as dependências

```bash
vp install
```

### 2. Configurar o ambiente local

Na primeira execução, copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Ajuste o `.env` conforme a instalação local do MySQL:

```dotenv
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=mesa_para_todos
```

`DB_PASSWORD` deve conter a senha do usuário informado em `DB_USER`. No ambiente local utilizado no projeto, a senha está vazia.

### 3. Iniciar o MySQL

No macOS com MySQL 8.4 instalado pelo Homebrew:

```bash
brew services run mysql@8.4
```

Em outras instalações, inicie o serviço MySQL pela ferramenta correspondente.

### 4. Preparar o banco na primeira execução

O arquivo `database/schema.sql` recria o banco e apaga os dados anteriores. Execute-o somente na preparação inicial ou quando desejar reiniciar o banco de testes.

Com o cliente `mysql` disponível no Terminal:

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

Informe a senha do MySQL quando solicitado. Se estiver vazia, pressione Enter.

No macOS Apple Silicon com Homebrew, caso `mysql` não seja encontrado, substitua esse comando por `/opt/homebrew/opt/mysql@8.4/bin/mysql`.

O `seed.sql` cadastra os tipos cesta de alimentos e kit de higiene, sem alterar quantidades já existentes.

### 5. Iniciar a API

```bash
vp run api
```

### 6. Iniciar a página

Em outra aba do Terminal, na mesma pasta:

```bash
vp dev
```

Acesse http://localhost:5173/ e utilize o menu Doadores, Registrar doação e Doações.

O rodapé deverá mostrar `API: ok, banco: ok`, com data e hora.

Mantenha o MySQL e os dois servidores funcionando durante o uso.

## Rotas da API

A API funciona em http://localhost:3000 durante o desenvolvimento.

| Método | Rota                | Finalidade                                 |
| ------ | ------------------- | ------------------------------------------ |
| GET    | `/api/health`       | Consultar o status da API e do banco       |
| GET    | `/api/doadores`     | Listar doadores                            |
| GET    | `/api/doadores/:id` | Consultar um doador                        |
| POST   | `/api/doadores`     | Cadastrar um doador                        |
| PUT    | `/api/doadores/:id` | Atualizar um doador                        |
| DELETE | `/api/doadores/:id` | Excluir um doador sem doações vinculadas   |
| GET    | `/api/itens`        | Listar os tipos de item disponíveis        |
| GET    | `/api/doacoes`      | Listar doações                             |
| POST   | `/api/doacoes`      | Registrar uma doação e atualizar o estoque |

Nas rotas de doadores, substitua `:id` pelo identificador do cadastro.

A rota `/api/health` retorna os campos `status`, `banco`, `app` e `hora`.

Durante o desenvolvimento, a página utiliza o proxy `/api` configurado no Vite+ para acessar o servidor Express.

## Verificações

Verificar o código e a formatação:

```bash
vp check
```

Gerar a versão de produção na pasta `dist`:

```bash
vp build
```

## Configuração local

O `.env` contém as configurações locais e é ignorado pelo Git.

O `.env.example` contém valores de exemplo e acompanha o repositório.
