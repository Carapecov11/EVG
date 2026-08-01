const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

const pastaBanco = path.join(__dirname, "banco");

// cria a pasta se não existir
if (!fs.existsSync(pastaBanco)) {
    fs.mkdirSync(pastaBanco);
}

const caminhoBanco = path.join(pastaBanco, "evg.db");

const db = new sqlite3.Database(caminhoBanco, (err) => {
    if (err) {
        console.error("Erro ao conectar banco:", err.message);
    } else {
        console.log("Banco conectado!");
    }
});

db.serialize(() => {


    // ===============================
    // TABELA USUÁRIOS
    // ===============================

    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT UNIQUE,
            senha TEXT,
            tribo TEXT,
            foto TEXT
        )
    `);



    // Adiciona coluna foto se banco antigo

    db.all("PRAGMA table_info(usuarios)", (err, columns) => {

        if (err) {

            console.log(err);
            return;

        }


        const temFoto = columns.some(
            col => col.name === "foto"
        );


        if (!temFoto) {

            db.run(
                "ALTER TABLE usuarios ADD COLUMN foto TEXT",
                (err) => {

                    if (err) {

                        console.log(
                            "Erro ao adicionar foto:",
                            err
                        );

                    } else {

                        console.log(
                            "Coluna foto adicionada!"
                        );

                    }

                }
            );

        }

    });



    // ===============================
    // TABELA JOVENS
    // ===============================

    db.run(`
        CREATE TABLE IF NOT EXISTS jovens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            idade INTEGER,
            endereco TEXT,
            telefone TEXT,
            status TEXT DEFAULT 'Ativo',
            tribo TEXT,
            dataCadastro DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);



    // ===============================
    // TABELA AGENDA
    // ===============================

});


module.exports = db;