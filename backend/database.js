const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes("render.com")
        ? { rejectUnauthorized: false }
        : false
});

pool.connect()
    .then(() => console.log("✅ PostgreSQL conectado!"))
    .catch(err => console.error("❌ Erro ao conectar PostgreSQL:", err));


async function criarTabelas() {

    try {

        await pool.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(100) UNIQUE NOT NULL,
                senha TEXT NOT NULL,
                tribo VARCHAR(100) NOT NULL,
                foto TEXT
            );
        `);


        await pool.query(`
            CREATE TABLE IF NOT EXISTS jovens (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(150) NOT NULL,
                idade INTEGER,
                endereco TEXT,
                telefone TEXT,
                status VARCHAR(20) DEFAULT 'Ativo',
                tribo VARCHAR(100),
                dataCadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);


        await pool.query(`
            CREATE TABLE IF NOT EXISTS agenda (
                id SERIAL PRIMARY KEY,
                titulo VARCHAR(150) NOT NULL,
                descricao TEXT,
                data DATE NOT NULL,
                hora TIME,
                local VARCHAR(150)
            );
        `);


        console.log("✅ Tabelas criadas/verificadas!");


    } catch (err) {

        console.error("❌ Erro ao criar tabelas:", err);

    }

}


criarTabelas();


module.exports = pool;