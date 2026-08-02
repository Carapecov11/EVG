const express = require("express");
const db = require("../database");

const router = express.Router();


// ===============================
// CADASTRAR JOVEM
// ===============================

router.post("/", async (req, res) => {

    const {
        nome,
        idade,
        endereco,
        telefone,
        status,
        tribo
    } = req.body;


    try {

        const resultado = await db.query(
            `
            INSERT INTO jovens
            (nome, idade, endereco, telefone, status, tribo)
            VALUES ($1,$2,$3,$4,$5,$6)
            RETURNING id
            `,
            [
                nome,
                idade,
                endereco,
                telefone,
                status,
                tribo
            ]
        );


        res.json({

            sucesso:true,
            id: resultado.rows[0].id

        });


    } catch(err){

        console.error(err);

        res.status(500).json({
            erro:err.message
        });

    }

});




// ===============================
// LISTAR TODOS
// ===============================

router.get("/", async (req,res)=>{


    try {

        const resultado = await db.query(
            "SELECT * FROM jovens ORDER BY nome"
        );


        res.json(resultado.rows);


    }catch(err){

        console.error(err);

        res.status(500).json({
            erro:err.message
        });

    }


});




// ===============================
// LISTAR POR TRIBO
// ===============================

router.get("/:tribo", async(req,res)=>{


    try {


        const resultado = await db.query(

            "SELECT * FROM jovens WHERE tribo=$1 ORDER BY nome",

            [
                req.params.tribo
            ]

        );


        res.json(resultado.rows);



    }catch(err){

        console.error(err);

        res.status(500).json({
            erro:err.message
        });

    }


});




// ===============================
// EXCLUIR JOVEM
// ===============================

router.delete("/:id", async(req,res)=>{


    try {


        await db.query(

            "DELETE FROM jovens WHERE id=$1",

            [
                req.params.id
            ]

        );


        res.json({
            sucesso:true
        });



    }catch(err){


        console.error(err);


        res.status(500).json({
            erro:err.message
        });


    }


});


module.exports = router;