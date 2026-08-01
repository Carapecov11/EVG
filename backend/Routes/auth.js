const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../database");

const router = express.Router();
console.log(">>>>>>>> AUTH ROUTES CARREGADO <<<<<<<<");


// ===============================
// CADASTRO
// ===============================

router.post("/cadastro", async (req, res) => {

    const { nome, senha, tribo } = req.body;

    if (!nome || !senha || !tribo) {

        return res.status(400).json({
            sucesso: false,
            mensagem: "Preencha todos os campos."
        });

    }

    db.get(
        "SELECT * FROM usuarios WHERE nome = ?",
        [nome],
        async (err, usuario) => {

            if (err) {

                return res.status(500).json({
                    sucesso: false,
                    mensagem: err.message
                });

            }

            if (usuario) {

                return res.status(400).json({
                    sucesso: false,
                    mensagem: "Usuário já existe."
                });

            }

            const senhaHash = await bcrypt.hash(senha, 10);

            db.run(

                "INSERT INTO usuarios (nome, senha, tribo, foto) VALUES (?, ?, ?, ?)",

                [
                    nome,
                    senhaHash,
                    tribo,
                    null
                ],

                function (err) {

                    if (err) {

                        return res.status(500).json({
                            sucesso: false,
                            mensagem: err.message
                        });

                    }

                    res.json({

                        sucesso: true,
                        mensagem: "Usuário cadastrado com sucesso."

                    });

                }

            );

        }

    );

});


// ===============================
// LOGIN
// ===============================

router.post("/login", async (req, res) => {

    try {

        console.log("LOGIN RECEBIDO:", req.body);

        const { nome, senha, tribo } = req.body;

        db.get(
            "SELECT * FROM usuarios WHERE nome = ? AND tribo = ?",
            [nome, tribo],
            async (err, usuario) => {

                try {

                    if (err) {
                        console.log("ERRO SQLITE:", err);

                        return res.status(500).json({
                            sucesso: false,
                            mensagem: err.message
                        });
                    }

                    console.log("USUARIO:", usuario);

                    if (!usuario) {

                        return res.status(401).json({
                            sucesso: false,
                            mensagem: "Usuário não encontrado."
                        });

                    }

                    console.log("Comparando senha...");

                    const senhaValida = await bcrypt.compare(
                        senha,
                        usuario.senha
                    );

                    console.log("Senha válida:", senhaValida);

                    if (!senhaValida) {

                        return res.status(401).json({
                            sucesso: false,
                            mensagem: "Senha incorreta."
                        });

                    }

                    console.log("Enviando resposta...");

                    return res.json({

                        sucesso: true,

                        mensagem: "Login realizado.",

                        usuario: {

                            id: usuario.id,
                            nome: usuario.nome,
                            tribo: usuario.tribo,
                            foto: usuario.foto

                        }

                    });

                } catch (e) {

                    console.log("ERRO DENTRO DO DB.GET");
                    console.error(e);

                    return res.status(500).json({
                        sucesso: false,
                        mensagem: e.message
                    });

                }

            }
        );

    } catch (e) {

        console.log("ERRO GERAL LOGIN");
        console.error(e);

        return res.status(500).json({
            sucesso: false,
            mensagem: e.message
        });

    }

});

// ===============================
// ATUALIZAR DADOS
// ===============================

router.put("/atualizar", async (req, res) => {

    const { id, nome, senha, tribo, foto } = req.body;

    if (!id) {

        return res.status(400).json({
            mensagem: "Usuário não informado."
        });

    }

    try {

        let senhaHash = null;

        if (senha && senha.trim() !== "") {

            senhaHash = await bcrypt.hash(senha, 10);

        }

        const sql = senhaHash

            ? `UPDATE usuarios
               SET nome = ?, senha = ?, tribo = ?, foto = ?
               WHERE id = ?`

            : `UPDATE usuarios
               SET nome = ?, tribo = ?, foto = ?
               WHERE id = ?`;

        const parametros = senhaHash

            ? [nome, senhaHash, tribo, foto, id]

            : [nome, tribo, foto, id];

        db.run(sql, parametros, function (err) {

            if (err) {

                return res.status(500).json({
                    mensagem: err.message
                });

            }

            res.json({
                mensagem: "Dados atualizados com sucesso!"
            });

        });

    } catch (erro) {

        res.status(500).json({
            mensagem: erro.message
        });

    }

});

// ===============================
// TESTE
// ===============================

router.get("/teste", (req, res) => {

    res.send("AUTH FUNCIONANDO");

});

// ===============================
// DELETAR CONTA
// ===============================

router.delete("/deletar/:id", (req, res) => {

    const { id } = req.params;


    db.run(
        "DELETE FROM usuarios WHERE id = ?",
        [id],
        function(err) {

            if (err) {

                return res.status(500).json({
                    mensagem: err.message
                });

            }


            if (this.changes === 0) {

                return res.status(404).json({
                    mensagem: "Usuário não encontrado."
                });

            }


            res.json({
                mensagem: "Conta excluída com sucesso."
            });

        }
    );

});
module.exports = router;