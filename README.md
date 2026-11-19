# Mesa para Todos

Sistema de Gestão de Doações para a ONG Mesa para Todos, de Recife–PE.

Projeto desenvolvido na disciplina Projeto Integrador Extensionista II, do curso de Análise e Desenvolvimento de Sistemas.

## Atividade 1

Esta etapa cria a estrutura inicial do sistema: uma página que consulta a API e exibe seu status, com data e hora.

## Tecnologias

- HTML, CSS e JavaScript
- Vite+
- Node.js
- Express
- dotenv
- Git e GitHub

## Requisitos

- Git instalado
- Vite+ instalado, com o comando `vp` disponível

Instalação do Vite+: https://viteplus.dev/guide

## Como executar

Abra o Terminal na pasta do projeto.

1. Instale as dependências:

   ```bash
   vp install
   ```

2. Na primeira execução, crie o arquivo de configuração local:

   ```bash
   cp .env.example .env
   ```

   O arquivo deve conter `PORT=3000`.

3. Inicie a API:

   ```bash
   vp run api
   ```

4. Abra outro Terminal na mesma pasta e inicie a página:

   ```bash
   vp dev
   ```

5. Acesse http://localhost:5173/

A página deverá mostrar “Status da API: ok”, seguido de data e hora.

Mantenha os dois terminais funcionando durante o uso.

## Rota da API

`GET /api/health`

Disponível diretamente em http://localhost:3000/api/health enquanto a API estiver funcionando.

A resposta contém `status`, `app` e `hora`.

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
