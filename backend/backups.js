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
    fs.mkdirSync(pastaBackup, { recursive: true });
}



function limparBackupsAntigos() {

    const arquivos = fs.readdirSync(pastaBackup)
        .filter(arquivo => arquivo.endsWith(".sql"))
        .map(arquivo => ({
            nome: arquivo,
            tempo: fs.statSync(
                path.join(pastaBackup, arquivo)
            ).mtime
        }))
        .sort((a, b) => b.tempo - a.tempo);


    const limite = 30;


    arquivos
        .slice(limite)
        .forEach(arquivo => {

            fs.unlinkSync(
                path.join(
                    pastaBackup,
                    arquivo.nome
                )
            );

            console.log(
                "🗑️ Backup antigo removido:",
                arquivo.nome
            );

        });

}




function criarBackup() {


    if (!process.env.DATABASE_URL) {

        console.error(
            "❌ DATABASE_URL não encontrada no .env"
        );

        return;

    }



    const data = new Date()
        .toISOString()
        .replace(/:/g, "-")
        .split(".")[0];



    const arquivo = path.join(
        pastaBackup,
        `evg-backup-${data}.sql`
    );



    const comando = 
        `pg_dump "${process.env.DATABASE_URL}" > "${arquivo}"`;



    console.log("Criando backup...");
    console.log(arquivo);



    exec(comando, (erro) => {


        if (erro) {

            console.error(
                "❌ Erro ao criar backup:"
            );

            console.error(
                erro.message
            );

            return;

        }



        console.log(
            "✅ Backup criado com sucesso!"
        );


        limparBackupsAntigos();


    });


}




// executa ao iniciar
criarBackup();



// backup automático a cada 24 horas
setInterval(() => {

    criarBackup();

}, 24 * 60 * 60 * 1000);