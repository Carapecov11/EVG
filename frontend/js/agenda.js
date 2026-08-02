const API = "https://evg-api-3u5m.onrender.com";
const token = localStorage.getItem("token");

const listaEventos = document.getElementById("listaEventos");

async function solicitarPermissao() {

    if (!("Notification" in window)) {
        return;
    }

    if (Notification.permission === "default") {
        await Notification.requestPermission();
    }

}

solicitarPermissao();

function enviarNotificacao(evento) {

    if (Notification.permission !== "granted") return;

    new Notification("📅 EVG Agenda", {

        body:
`${evento.titulo}

📍 ${evento.local}

Começa agora!`,

        icon: "images/logo.png"

    });

}

function formatarData(data) {

    const dataObj = new Date(data);

    return dataObj.toLocaleDateString("pt-BR");

}

async function carregarEventos() {

    try {

        const resposta = await fetch(`${API}/agenda`, {

            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        const dados = await resposta.json();

        listaEventos.innerHTML = "";

        if (!dados.sucesso) {

            listaEventos.innerHTML = `
                <div class="evento">
                    <h3>Nenhum evento encontrado.</h3>
                </div>
            `;

            return;

        }

        dados.eventos.forEach(evento => {

            listaEventos.innerHTML += `

                <div class="evento">

                    <h3>${evento.titulo}</h3>

                    <p>📅 ${formatarData(evento.data)}</p>

                    <p>🕒 ${evento.hora || "-"}</p>

                    <p>📍 ${evento.local || "-"}</p>

                    <p>${evento.descricao || ""}</p>

                    <div class="botoes">

                        <button
                            class="btn-whatsapp"
                            onclick="enviarWhatsapp('${evento.titulo}', '${evento.data}', '${evento.hora || "-"}', '${evento.local || "-"}', '${evento.descricao || ""}')">

                            WhatsApp

                        </button>

                        <button
                            class="btn-editar"
                            onclick="editarEvento(${evento.id})">

                            Editar

                        </button>

                        <button
                            class="btn-excluir"
                            onclick="excluirEvento(${evento.id})">

                            Excluir

                        </button>

                    </div>

                </div>

            `;

        });

        verificarEventos(dados.eventos);

    }

    catch (erro) {

        console.error("Erro ao carregar eventos:", erro);

    }

}

function verificarEventos(eventos) {

    setInterval(() => {

        const agora = new Date();

        const dataHoje = agora.toISOString().split("T")[0];

        const horaAgora =
            agora.getHours().toString().padStart(2, "0")
            + ":"
            + agora.getMinutes().toString().padStart(2, "0");

        eventos.forEach(evento => {

            if (
                evento.data === dataHoje &&
                evento.hora === horaAgora &&
                !evento.notificado
            ) {

                enviarNotificacao(evento);

                evento.notificado = true;

            }

        });

    }, 60000);

}

async function abrirFormulario() {

    const titulo = prompt("Título:");

    if (!titulo) return;


    const descricao = prompt("Descrição:");


    const data = await escolherData();


    if (!data) return;


    const hora = prompt("Hora:");

    const local = prompt("Local:");



    const resposta = await fetch(`${API}/agenda/cadastrar`, {

        method: "POST",

        headers: {

            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`

        },

        body: JSON.stringify({

            titulo,
            descricao,
            data,
            hora,
            local

        })

    });


    const resultado = await resposta.json();


    alert(resultado.mensagem);


    carregarEventos();

}

async function excluirEvento(id) {

    if (!confirm("Deseja excluir este evento?")) return;

    const resposta = await fetch(`${API}/agenda/deletar/${id}`, {

        method: "DELETE",

        headers: {
            Authorization: `Bearer ${token}`
        }

    });

    const resultado = await resposta.json();

    alert(resultado.mensagem);

    carregarEventos();

}

async function editarEvento(id) {

    const titulo = prompt("Novo título:");

    if (!titulo) return;

    const descricao = prompt("Descrição:");

    const data = prompt("Data:");

    const hora = prompt("Hora:");

    const local = prompt("Local:");

    const resposta = await fetch(`${API}/agenda/atualizar/${id}`, {

        method: "PUT",

        headers: {

            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`

        },

        body: JSON.stringify({

            titulo,
            descricao,
            data,
            hora,
            local

        })

    });

    const resultado = await resposta.json();

    alert(resultado.mensagem);

    carregarEventos();

}

function enviarWhatsapp(titulo, data, hora, local, descricao) {

    const mensagem = `
📅 *${titulo}*

📆 Data: ${formatarData(data)}
🕒 Hora: ${hora}
📍 Local: ${local}

${descricao}
    `;

    const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;

    window.open(url, "_blank");

}
function escolherData() {

    return new Promise((resolve) => {

        const input = document.createElement("input");

        input.type = "date";

        input.style.position = "fixed";
        input.style.opacity = "0";

        document.body.appendChild(input);


        input.onchange = () => {

            resolve(input.value);

            input.remove();

        };


        if (input.showPicker) {

            input.showPicker();

        } else {

            input.click();

        }

    });

}

function voltar() {

    window.location.href = "principal.html";

}

carregarEventos();