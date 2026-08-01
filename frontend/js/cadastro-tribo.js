const API = "https://SEU-SERVIDOR.com";

const params = new URLSearchParams(window.location.search);
const tribo = params.get("tribo");

// ==============================
// Nome da tribo
// ==============================

function atualizarTituloTribo() {

    const idioma = localStorage.getItem("idioma") || "pt";

    const nomes = {
        gade: idiomas[idioma].triboGade,
        juda: idiomas[idioma].triboJuda,
        simeao: idiomas[idioma].triboSimeao,
        benjamin: idiomas[idioma].triboBenjamin,
        obreiros: idiomas[idioma].triboObreiros,
        coordenadores: idiomas[idioma].triboCoordenadores
    };
}

// ==============================
// Carregar jovens
// ==============================

async function carregarJovens() {

    const resposta = await fetch(`${API}/jovens/${tribo}`);
    const jovens = await resposta.json();

    const tabela = document.getElementById("listaJovens");
    tabela.innerHTML = "";

    jovens.forEach(jovem => {

    tabela.innerHTML += `
        <tr>
            <td>${jovem.nome}</td>
            <td>${jovem.idade} anos</td>
            <td>${jovem.telefone || "-"}</td>
            <td>${jovem.endereco || "-"}</td>
            <td>${jovem.status}</td>

            <td>
                <button class="btn-whatsapp"
                    onclick="abrirWhatsApp('${jovem.telefone}')">
                    💬
                </button>

                <button class="btn-excluir"
                    onclick="excluirJovem(${jovem.id})">
                    🗑️
                </button>
            </td>
        </tr>
    `;

});

}

document.getElementById("formCadastro")
.addEventListener("submit", async function(e){

    e.preventDefault();

    const dados = {

        nome: document.getElementById("nome").value,

        idade: document.getElementById("idade").value,

        endereco: document.getElementById("endereco").value,

        telefone: document.getElementById("telefone").value,

        status: document.getElementById("status").value,

        tribo: tribo

    };

    const resposta = await fetch(`${API}/jovens`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(dados)

    });

    const resultado = await resposta.json();

    if(resultado.sucesso){

        this.reset();

        carregarJovens();

    }else{

        alert("Erro ao cadastrar.");

    }

});

function abrirWhatsApp(telefone) {

    if (!telefone) {
        alert("Este jovem não possui telefone cadastrado.");
        return;
    }

    const numero = telefone.replace(/\D/g, "");

    window.open(`https://wa.me/55${numero}`, "_blank");

}
async function excluirJovem(id) {

    if (!confirm("Deseja realmente excluir este jovem?")) {
        return;
    }

    const resposta = await fetch(`${API}/jovens/${id}`, {

        method: "DELETE"

    });

    const resultado = await resposta.json();

    if (resultado.sucesso) {

        carregarJovens();

    } else {

        alert("Erro ao excluir.");

    }

}

function filtrarJovens() {

    const pesquisa = document
        .getElementById("pesquisaJovem")
        .value
        .toLowerCase();

    const linhas = document.querySelectorAll("#listaJovens tr");

    linhas.forEach(linha => {

        const texto = linha.textContent.toLowerCase();

        linha.style.display =
            texto.includes(pesquisa) ? "" : "none";

    });

}
document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("pesquisaJovem")
        .addEventListener("input", filtrarJovens);

    carregarJovens();
    atualizarTituloTribo();

});

function atualizarTituloTribo() {

    const idiomaAtual = localStorage.getItem("idioma") || "pt";
    const lang = idiomas[idiomaAtual];

    const tribo = new URLSearchParams(window.location.search).get("tribo");

    const nomes = {
        gade: lang.triboGade,
        juda: lang.triboJuda,
        simeao: lang.triboSimeao,
        benjamin: lang.triboBenjamin,

        obreiros: lang.triboObreiros,
        coordenadores: lang.triboCoordenadores
    };

    document.getElementById("tituloTribo").textContent =
        nomes[tribo] || lang.tituloTribo;
}

carregarJovens();
atualizarTituloTribo();