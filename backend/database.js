const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./backend/banco/evg.db", (err) => {

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