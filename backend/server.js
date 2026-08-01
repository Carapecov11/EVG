require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

require("./database");

const app = express();

// ===============================
// Middlewares
// ===============================

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
});

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// ===============================
// Rotas
// ===============================

const authRoutes = require("./Routes/auth");
const uploadRoutes = require("./Routes/uploadRoutes");
const agendaRoutes = require("./Routes/agendaRoutes");
const jovensRoutes = require("./Routes/jovens");

app.use("/auth", authRoutes);
app.use("/upload", uploadRoutes);
app.use("/agenda", agendaRoutes);
app.use("/jovens", jovensRoutes);

// ===============================
// Uploads
// ===============================

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===============================
// Frontend
// ===============================

app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

// ===============================
// Inicialização
// ===============================

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});