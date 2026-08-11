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

        console.log("========== UPLOAD INICIADO ==========");

        if (!req.file) {

            console.log("❌ Nenhum arquivo recebido.");

            return res.status(400).json({
                mensagem: "Nenhuma imagem enviada."
            });

        }

        console.log("📁 Arquivo recebido:", {
            nome: req.file.originalname,
            tipo: req.file.mimetype,
            tamanho: req.file.size
        });

        const extensao = path.extname(
            req.file.originalname
        );

        const nomeArquivo =
            `perfis/${uuid()}${extensao}`;

        console.log("📤 Enviando para Supabase:");
        console.log("Bucket: perfis");
        console.log("Arquivo:", nomeArquivo);

        const { data: uploadData, error } = await supabase
            .storage
            .from("perfis")
            .upload(
                nomeArquivo,
                req.file.buffer,
                {
                    contentType: req.file.mimetype,
                    upsert: false
                }
            );

        if (error) {

            console.error("❌ ERRO DO SUPABASE:");
            console.error(error);
            console.error("Mensagem:", error.message);
            console.error("Nome:", error.name);
            console.error("Status:", error.statusCode);

            return res.status(500).json({
                mensagem: "Erro ao enviar imagem.",
                erro: error.message
            });

        }

        console.log("✅ Upload realizado:", uploadData);

        const { data } = supabase
            .storage
            .from("perfis")
            .getPublicUrl(nomeArquivo);

        console.log("🌐 URL gerada:", data.publicUrl);

        return res.json({

            mensagem: "Upload realizado!",

            foto: data.publicUrl

        });

    } catch (erro) {

        console.error("🔥 ERRO GERAL NO UPLOAD:");
        console.error(erro);

        return res.status(500).json({
            mensagem: "Erro no upload.",
            erro: erro.message
        });

    }

});

module.exports = router;