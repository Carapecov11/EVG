const express = require("express");
const multer = require("multer");
const path = require("path");
const { v4: uuid } = require("uuid");

const supabase = require("../supabase");

const router = express.Router();


const upload = multer({
    storage: multer.memoryStorage()
});


router.post("/", upload.single("foto"), async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({
                mensagem: "Nenhuma imagem enviada."
            });

        }


        const extensao = path.extname(
            req.file.originalname
        );


        const nomeArquivo =
            `perfis/${uuid()}${extensao}`;


        const { error } = await supabase
            .storage
            .from("perfis")
            .upload(
                nomeArquivo,
                req.file.buffer,
                {
                    contentType: req.file.mimetype
                }
            );


        if (error) {

            console.error(error);

            return res.status(500).json({
                mensagem: "Erro ao enviar imagem."
            });

        }


        const { data } = supabase
            .storage
            .from("perfis")
            .getPublicUrl(nomeArquivo);

        console.log("🔥 URL GERADA PELO SUPABASE:", data.publicUrl);


        res.json({

            mensagem: "Upload realizado!",

            foto: data.publicUrl

        });


    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            mensagem: "Erro no upload."
        });

    }

});


module.exports = router;