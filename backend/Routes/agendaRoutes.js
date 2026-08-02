const express = require("express");
const db = require("../database");

const router = express.Router();


// ===============================
// LISTAR EVENTOS
// ===============================

router.get("/", async (req, res) => {

    try {

        const resultado = await db.query(
            "SELECT * FROM agenda ORDER BY data ASC, hora ASC"
        );

        res.json({
            sucesso: true,
            eventos: resultado.rows
        });

    } catch (err) {

        res.status(500).json({
            sucesso: false,
            mensagem: err.message
        });

    }

});


// ===============================
// CADASTRAR EVENTO
// ===============================

router.post("/cadastrar", async (req, res) => {

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


    try {

        const resultado = await db.query(

            `
            INSERT INTO agenda
            (titulo, descricao, data, hora, local)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
            `,

            [
                titulo,
                descricao,
                data,
                hora,
                local
            ]

        );


        res.json({

            sucesso: true,
            mensagem: "Evento cadastrado com sucesso.",
            id: resultado.rows[0].id

        });


    } catch(err) {

        res.status(500).json({
            sucesso:false,
            mensagem:err.message
        });

    }

});


// ===============================
// ATUALIZAR EVENTO
// ===============================

router.put("/atualizar/:id", async (req, res) => {

    const { id } = req.params;

    const {
        titulo,
        descricao,
        data,
        hora,
        local
    } = req.body;


    try {

        await db.query(

            `
            UPDATE agenda
            SET
                titulo = $1,
                descricao = $2,
                data = $3,
                hora = $4,
                local = $5
            WHERE id = $6
            `,

            [
                titulo,
                descricao,
                data,
                hora,
                local,
                id
            ]

        );


        res.json({

            sucesso:true,
            mensagem:"Evento atualizado com sucesso."

        });


    } catch(err){

        res.status(500).json({
            sucesso:false,
            mensagem:err.message
        });

    }

});


// ===============================
// DELETAR EVENTO
// ===============================

router.delete("/deletar/:id", async (req,res)=>{

    const { id } = req.params;


    try {

        const resultado = await db.query(

            "DELETE FROM agenda WHERE id = $1",

            [id]

        );


        if(resultado.rowCount === 0){

            return res.status(404).json({

                sucesso:false,
                mensagem:"Evento não encontrado."

            });

        }


        res.json({

            sucesso:true,
            mensagem:"Evento excluído com sucesso."

        });


    } catch(err){

        res.status(500).json({

            sucesso:false,
            mensagem:err.message

        });

    }

});


// ===============================
// TESTE
// ===============================

router.get("/teste",(req,res)=>{

    res.send("AGENDA FUNCIONANDO");

});

module.exports = router;