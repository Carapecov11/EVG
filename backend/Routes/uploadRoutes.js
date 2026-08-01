const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const pastaUploads = path.join(__dirname, "../uploads/perfis");

// Cria a pasta automaticamente se ela não existir
if (!fs.existsSync(pastaUploads)) {
    fs.mkdirSync(pastaUploads, { recursive: true });
}

const storage = multer.diskStorage({

    destination(req, file, cb) {
        cb(null, pastaUploads);
    },

    filename(req, file, cb) {

        const nome = Date.now() + path.extname(file.originalname);

        cb(null, nome);

    }

});

const upload = multer({ storage });

router.post("/", upload.single("foto"), (req, res) => {

    if (!req.file) {
        return res.status(400).json({
            mensagem: "Nenhuma imagem enviada."
        });
    }

    res.json({
        mensagem: "Upload realizado!",
        foto: req.file.filename
    });

});

module.exports = router;