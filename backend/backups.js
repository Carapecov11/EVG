require("dotenv").config();

const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");


const pastaBackup = path.join(
    __dirname,
    "../backups"
);


// cria pasta se não existir
if (!fs.existsSync(pastaBackup)) {
    fs.mkdirSync(pastaBackup);
}


const data = new Date()
    .toISOString()
    .replace(/:/g, "-")
    .split(".")[0];


const arquivo = path.join(
    pastaBackup,
    `evg-backup-${data}.sql`
);


const comando = `pg_dump "${process.env.DATABASE_URL}" > "${arquivo}"`;


console.log("Criando backup...");
console.log(arquivo);


exec(comando, (erro) => {

    if (erro) {

        console.error("❌ Erro ao criar backup:");
        console.error(erro.message);
        return;

    }


    console.log("✅ Backup criado com sucesso!");

});
