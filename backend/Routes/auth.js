const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../database");

const router = express.Router();
console.log(">>>>>>>> AUTH ROUTES CARREGADO <<<<<<<<");


// ===============================
// CADASTRO
// ===============================

router.post("/cadastro", async (req, res) => {

    try {

        const { nome, senha, tribo } = req.body;

        if (!nome || !senha || !tribo) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Preencha todos os campos."
            });
        }

        const usuario = await db.query(
            "SELECT * FROM usuarios WHERE nome = $1",
            [nome]
        );

        if (usuario.rows.length > 0) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Usuário já existe."
            });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        await db.query(
            `INSERT INTO usuarios
            (nome, senha, tribo, foto)
            VALUES ($1, $2, $3, $4)`,
            [
                nome,
                senhaHash,
                tribo,
                null
            ]
        );

        res.json({
            sucesso: true,
            mensagem: "Usuário cadastrado com sucesso."
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            sucesso: false,
            mensagem: err.message
        });

    }

});

// ===============================
// LOGIN
// ===============================

router.post("/login", async (req, res) => {

    try {

        const { nome, senha, tribo } = req.body;

        const resultado = await db.query(
            `SELECT *
             FROM usuarios
             WHERE nome = $1
             AND tribo = $2`,
            [nome, tribo]
        );

        if (resultado.rows.length === 0) {

            return res.status(401).json({
                sucesso: false,
                mensagem: "Usuário não encontrado."
            });

        }

        const usuario = resultado.rows[0];

        const senhaValida =
            await bcrypt.compare(
                senha,
                usuario.senha
            );

        if (!senhaValida) {

            return res.status(401).json({
                sucesso: false,
                mensagem: "Senha incorreta."
            });

        }

        res.json({

            sucesso: true,

            mensagem: "Login realizado.",

            usuario: {

                id: usuario.id,
                nome: usuario.nome,
                tribo: usuario.tribo,
                foto: usuario.foto

            }

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            sucesso: false,
            mensagem: err.message
        });

    }

});

// ===============================
// ATUALIZAR DADOS
// ===============================

router.put("/atualizar", async (req, res) => {

    try {

        const { id, nome, senha, tribo, foto } = req.body;

        if (!id) {
            return res.status(400).json({
                mensagem: "Usuário não informado."
            });
        }

        if (senha && senha.trim() !== "") {

            const senhaHash = await bcrypt.hash(senha, 10);

            await db.query(
                `UPDATE usuarios
                 SET nome=$1,
                     senha=$2,
                     tribo=$3,
                     foto=$4
                 WHERE id=$5`,
                [
                    nome,
                    senhaHash,
                    tribo,
                    foto,
                    id
                ]
            );

        } else {

            await db.query(
                `UPDATE usuarios
                 SET nome=$1,
                     tribo=$2,
                     foto=$3
                 WHERE id=$4`,
                [
                    nome,
                    tribo,
                    foto,
                    id
                ]
            );

        }

        res.json({
            mensagem: "Dados atualizados com sucesso!"
        });

    } catch (err) {

        res.status(500).json({
            mensagem: err.message
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

router.delete("/deletar/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const resultado = await db.query(
            "DELETE FROM usuarios WHERE id = $1",
            [id]
        );

        if (resultado.rowCount === 0) {

            return res.status(404).json({
                mensagem: "Usuário não encontrado."
            });

        }

        res.json({
            mensagem: "Conta excluída com sucesso."
        });

    } catch (err) {

        res.status(500).json({
            mensagem: err.message
        });

    }

});
module.exports = router;