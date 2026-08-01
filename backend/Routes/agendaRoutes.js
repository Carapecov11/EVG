const express = require("express");
const db = require("../database");

const router = express.Router();


// ===============================
// LISTAR EVENTOS
// ===============================

router.get("/", (req, res) => {

    db.all(

        "SELECT * FROM agenda ORDER BY data ASC, hora ASC",

        [],

        (err, eventos) => {

            if (err) {

                return res.status(500).json({
                    sucesso: false,
                    mensagem: err.message
                });

            }

            res.json({
                sucesso: true,
                eventos
            });

        }

    );

});


// ===============================
// CADASTRAR EVENTO
// ===============================

router.post("/cadastrar", (req, res) => {

    const {
        titulo,
        descricao,
        data,
        hora,
        local
    } = req.body;

    if (!titulo || !data) {

        return res.status(400).json({
            sucesso: false,
            mensagem: "Título e data são obrigatórios."
        });

    }

    db.run(

        `INSERT INTO agenda
        (titulo, descricao, data, hora, local)
        VALUES (?, ?, ?, ?, ?)`,

        [
            titulo,
            descricao,
            data,
            hora,
            local
        ],

        function(err){

            if(err){

                return res.status(500).json({
                    sucesso:false,
                    mensagem:err.message
                });

            }

            res.json({

                sucesso:true,
                mensagem:"Evento cadastrado com sucesso.",
                id:this.lastID

            });

        }

    );

});


// ===============================
// ATUALIZAR EVENTO
// ===============================

router.put("/atualizar/:id", (req, res) => {

    const { id } = req.params;

    const {
        titulo,
        descricao,
        data,
        hora,
        local
    } = req.body;

    db.run(

        `UPDATE agenda
        SET
            titulo = ?,
            descricao = ?,
            data = ?,
            hora = ?,
            local = ?
        WHERE id = ?`,

        [
            titulo,
            descricao,
            data,
            hora,
            local,
            id
        ],

        function(err){

            if(err){

                return res.status(500).json({
                    sucesso:false,
                    mensagem:err.message
                });

            }

            res.json({

                sucesso:true,
                mensagem:"Evento atualizado com sucesso."

            });

        }

    );

});


// ===============================
// DELETAR EVENTO
// ===============================

router.delete("/deletar/:id", (req, res) => {

    const { id } = req.params;

    db.run(

        "DELETE FROM agenda WHERE id = ?",

        [id],

        function(err){

            if(err){

                return res.status(500).json({
                    sucesso:false,
                    mensagem:err.message
                });

            }

            if(this.changes === 0){

                return res.status(404).json({
                    sucesso:false,
                    mensagem:"Evento não encontrado."
                });

            }

            res.json({

                sucesso:true,
                mensagem:"Evento excluído com sucesso."

            });

        }

    );

});


// ===============================
// TESTE
// ===============================

router.get("/teste", (req, res) => {

    res.send("AGENDA FUNCIONANDO");

});

module.exports = router;