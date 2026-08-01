const API = "https://evg-api-3u5m.onrender.com";

const fotoInput = document.getElementById("fotoInput");
const fotoPerfil = document.getElementById("fotoPerfil");
const btnSalvar = document.getElementById("btnSalvar");

let fotoAtual = "";

// ======================
// Recupera o usuário logado
// ======================

const usuarioSalvo = localStorage.getItem("usuario");

if (!usuarioSalvo || usuarioSalvo === "undefined") {

    alert("Faça login novamente.");

    window.location.href = "login.html";

    throw new Error("Usuário não encontrado.");

}

const usuario = JSON.parse(usuarioSalvo);

// Preenche os campos
document.getElementById("nome").value = usuario.nome || "";
document.getElementById("tribo").value = usuario.tribo || "";

if (usuario.foto) {

    fotoAtual = usuario.foto;
    fotoPerfil.src = `${API}/uploads/perfis/${fotoAtual}`;

}

// ======================
// Upload da Foto
// ======================

fotoInput.addEventListener("change", async function () {

    const arquivo = this.files[0];

    if (!arquivo) return;

    const formData = new FormData();

    formData.append("foto", arquivo);

    try {

        const resposta = await fetch(`${API}/upload`, {

            method: "POST",
            body: formData

        });

        const resultado = await resposta.json();

        // Guarda o nome da foto
        fotoAtual = resultado.foto;

        // Atualiza a imagem
        fotoPerfil.src = `${API}/uploads/perfis/${fotoAtual}`;

        alert("Foto alterada com sucesso!");

    } catch (erro) {

        console.error(erro);

        alert("Erro ao enviar foto.");

    }

});

btnSalvar.addEventListener("click", salvar);

async function salvar() {

    const nome = document.getElementById("nome").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const tribo = document.getElementById("tribo").value;

    if (!nome) {
        alert("Digite o nome.");
        return;
    }

    if (!tribo) {
        alert("Selecione uma tribo.");
        return;
    }

    try {

        const resposta = await fetch(`${API}/auth/atualizar`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                id: usuario.id,
                nome,
                senha,
                tribo,
                foto: fotoAtual

            })

        });

        const dados = await resposta.json();

        if (!resposta.ok) {

            alert(dados.mensagem);
            return;

        }

        usuario.nome = nome;
        usuario.tribo = tribo;
        usuario.foto = fotoAtual;

        localStorage.setItem(
            "usuario",
            JSON.stringify(usuario)
        );

        alert(dados.mensagem);

    } catch (erro) {

        console.error(erro);

        alert("Erro ao salvar as alterações.");

    }

}
async function deletarConta() {

    const confirmar = confirm(
        "Tem certeza que deseja excluir sua conta?\nEssa ação não pode ser desfeita."
    );


    if (!confirmar) {
        return;
    }


    try {

        const resposta = await fetch(`${API}/auth/deletar/${usuario.id}`, {

            method: "DELETE"

        });


        const dados = await resposta.json();


        if (!resposta.ok) {

            alert(dados.mensagem);
            return;

        }


        localStorage.removeItem("usuario");


        alert("Conta excluída com sucesso!");


        window.location.href = "login.html";


    } catch (erro) {

        console.error(erro);

        alert("Erro ao excluir conta.");

    }

}

// ======================
// Idioma
// ======================

const seletorIdioma = document.getElementById("idioma");


if (seletorIdioma) {


    seletorIdioma.value = localStorage.getItem("idioma") || "pt";


    seletorIdioma.addEventListener("change", function () {


        localStorage.setItem(
            "idioma",
            seletorIdioma.value
        );


        // recarrega a página para aplicar tradução
        window.location.reload();


    });


}

aplicarIdioma();