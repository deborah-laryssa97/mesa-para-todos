# Mesa para Todos

Sistema de Gestão de Doações para a ONG Mesa para Todos, de Recife–PE.

Projeto desenvolvido na disciplina Projeto Integrador Extensionista II, do curso de Análise e Desenvolvimento de Sistemas.

## Funcionalidades atuais

- Login de voluntário com e-mail e senha.
- Proteção das rotas de dados com token JWT.
- Permanência do login após atualizar a página e botão Sair.
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
- jsonwebtoken e bcryptjs
- Git e GitHub

## Requisitos

- Node.js 22 ou mais recente.
- Git instalado.
- Vite+ instalado, com o comando `vp` disponível.
- MySQL 8.4 instalado.
- Cliente MySQL disponível para executar os arquivos SQL.

Guia de instalação do Vite+: https://viteplus.dev/guide

## Como executar

Clone o repositório e entre na pasta:

```bash
git clone https://github.com/deborah-laryssa97/mesa-para-todos.git
cd mesa-para-todos
```

Execute os demais comandos no Terminal, dentro dessa pasta.

### 1. Instalar as dependências

```bash
vp install
```

### 2. Configurar o ambiente local

Na primeira execução, copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Gere um segredo para os tokens de login:

```bash
node --input-type=module -e 'import { randomBytes } from "node:crypto"; console.log(randomBytes(32).toString("hex"));'
```

Copie o resultado e coloque-o depois de `JWT_SECRET=` no `.env`, na mesma linha.

Ajuste também as configurações conforme a instalação local do MySQL:

```dotenv
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=mesa_para_todos
JWT_SECRET=cole_aqui_o_segredo_gerado
JWT_EXPIRES_IN=8h
```

Substitua `cole_aqui_o_segredo_gerado` pelo valor gerado no Terminal.

`DB_PASSWORD` deve conter a senha do usuário informado em `DB_USER`. No ambiente local utilizado no projeto, a senha está vazia.

`JWT_EXPIRES_IN=8h` define a validade dos tokens como oito horas.

O segredo verdadeiro fica somente no `.env`, que é ignorado pelo Git.

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

Acesse http://localhost:5173/ e entre com a conta de demonstração indicada abaixo.

Após o login, utilize o menu Doadores, Registrar doação e Doações.

O rodapé deverá mostrar `API: ok, banco: ok`, com data e hora.

Mantenha o MySQL e os dois servidores funcionando durante o uso.

## Usuário de demonstração

O arquivo `database/seed.sql` cadastra esta conta fictícia para a demonstração acadêmica:

| E-mail                 | Senha            |
| ---------------------- | ---------------- |
| voluntario@example.com | mesaparatodos123 |

O banco armazena o hash bcrypt da senha.

Após entrar, o navegador guarda o token e o nome do usuário no localStorage. O login permanece ao atualizar a página.

O botão Sair remove esses dados do navegador e volta para a tela de login.

O token tem validade de oito horas, conforme `JWT_EXPIRES_IN`. Se expirar, a API responde com erro 401. Clique em Sair e faça o login novamente.

## Rotas da API

A API funciona em http://localhost:3000 durante o desenvolvimento.

| Método | Rota                | Finalidade                                 | Exige token? |
| ------ | ------------------- | ------------------------------------------ | ------------ |
| GET    | `/api/health`       | Consultar o status da API e do banco       | Não          |
| POST   | `/api/auth/login`   | Conferir credenciais e emitir o token      | Não          |
| GET    | `/api/doadores`     | Listar doadores                            | Sim          |
| GET    | `/api/doadores/:id` | Consultar um doador                        | Sim          |
| POST   | `/api/doadores`     | Cadastrar um doador                        | Sim          |
| PUT    | `/api/doadores/:id` | Atualizar um doador                        | Sim          |
| DELETE | `/api/doadores/:id` | Excluir um doador sem doações vinculadas   | Sim          |
| GET    | `/api/itens`        | Listar os tipos de item disponíveis        | Sim          |
| GET    | `/api/doacoes`      | Listar doações                             | Sim          |
| POST   | `/api/doacoes`      | Registrar uma doação e atualizar o estoque | Sim          |

Nas rotas de doadores, substitua `:id` pelo identificador do cadastro.

Nas rotas protegidas, envie o cabeçalho `Authorization: Bearer TOKEN`, substituindo `TOKEN` pelo valor recebido no login.

Pedidos sem token válido recebem a resposta 401.

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

O `.env.example` contém as indicações de preenchimento e acompanha o repositório.

| Variável         | Finalidade                                                |
| ---------------- | --------------------------------------------------------- |
| `PORT`           | Porta da API; utilizamos 3000                             |
| `DB_HOST`        | Endereço do MySQL; utilizamos 127.0.0.1                   |
| `DB_PORT`        | Porta do MySQL; utilizamos 3306                           |
| `DB_USER`        | Usuário utilizado para acessar o MySQL                    |
| `DB_PASSWORD`    | Senha desse usuário no MySQL                              |
| `DB_NAME`        | Nome do banco: mesa_para_todos                            |
| `JWT_SECRET`     | Segredo usado pela API para assinar e verificar os tokens |
| `JWT_EXPIRES_IN` | Validade do token; utilizamos 8h                          |

Cada instalação deve gerar seu próprio `JWT_SECRET`, seguindo as instruções de configuração.

## Backup do banco (opcional)

Para criar uma cópia da estrutura e dos dados do banco, execute no Terminal:

```bash
mysqldump -u root -p mesa_para_todos > backup.sql
```

Informe a senha do MySQL quando solicitado. Se estiver vazia, pressione Enter.

O arquivo `backup.sql` será criado na pasta em que o comando foi executado.

No macOS Apple Silicon com Homebrew, caso `mysqldump` não seja encontrado, utilize `/opt/homebrew/opt/mysql@8.4/bin/mysqldump`.

Para restaurar a cópia em um banco já criado:

```bash
mysql -u root -p mesa_para_todos < backup.sql
```

A restauração substitui as tabelas incluídas na cópia. Execute-a somente quando desejar recuperar esses dados.

Os arquivos `backup*.sql` são ignorados pelo Git e devem ser mantidos localmente.
