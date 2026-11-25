import bcrypt from "bcryptjs";

const senha = process.argv[2];

if (!senha) {
  console.log("Uso: node server/gerar-hash.js SENHA_DE_TESTE");
  process.exit(1);
}

const hash = await bcrypt.hash(senha, 10);

console.log(hash);
