const express = require("express");
const db = require("../database");

const router = express.Router();

// ===============================
// CADASTRAR JOVEM
// ===============================

router.post("/", (req, res) => {

    const {
        nome,
        idade,
        endereco,
        telefone,
        status,
        tribo
    } = req.body;

    db.run(
        `INSERT INTO jovens
        (nome, idade, endereco, telefone, status, tribo)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [nome, idade, endereco, telefone, status, tribo],
        function (err) {

            if (err) {
                return res.status(500).json({
                    erro: err.message
                });
            }

            res.json({
                sucesso: true,
                id: this.lastID
            });

        }
    );

});

router.get("/", (req, res) => {

    db.all(
        "SELECT * FROM jovens ORDER BY nome",
        [],
        (err, rows) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    erro: err.message
                });
            }

            res.json(rows);

        }
    );

});

router.get("/:tribo", (req, res) => {

    const tribo = req.params.tribo;

    db.all(
        "SELECT * FROM jovens WHERE tribo = ? ORDER BY nome",
        [tribo],
        (err, rows) => {

            if (err) {
                console.error("ERRO GET JOVENS:", err);
                return res.status(500).json(err);
            }

            res.json(rows);

        }
    );

});
// ===============================
// EXCLUIR JOVEM
// ===============================

router.delete("/:id", (req, res) => {

    db.run(
        "DELETE FROM jovens WHERE id = ?",
        [req.params.id],
        function(err) {

            if (err) {
                return res.status(500).json({
                    erro: err.message
                });
            }

            res.json({
                sucesso: true
            });

        }
    );

});

module.exports = router;