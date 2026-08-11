javascript
// ========================================
// CONFIGURAÇÕES
// ========================================

// Capacitor pode existir somente dentro do aplicativo Android.
// No navegador normal, ele não existe.
const capacitorDisponivel =
    typeof window !== "undefined" &&
    typeof window.Capacitor !== "undefined";

// Plugins nativos, quando disponíveis.
const Filesystem =
    capacitorDisponivel &&
    window.Capacitor.Plugins
        ? window.Capacitor.Plugins.Filesystem
        : null;

const Share =
    capacitorDisponivel &&
    window.Capacitor.Plugins
        ? window.Capacitor.Plugins.Share
        : null;

const API = "https://evg-api-3u5m.onrender.com";

let triboSelecionada = "";
let jovens = [];

let idiomaAtual =
    localStorage.getItem("idioma") || "pt";

// ========================================
// ELEMENTOS
// ========================================

const cards =
    document.querySelectorAll(".tribo-card");

const lista =
    document.getElementById("listaJovens");

const pesquisa =
    document.getElementById("pesquisa");

const total =
    document.getElementById("totalJovens");

const titulo =
    document.getElementById("tituloTribo");

const selecionarTodos =
    document.getElementById("selecionarTodos");

const desmarcarTodos =
    document.getElementById("desmarcarTodos");

const quantidade =
    document.getElementById("quantidadeSelecionados");

// ========================================
// TRADUÇÃO
// ========================================

function t(chave) {

    if (
        typeof idiomas !== "undefined" &&
        idiomas[idiomaAtual] &&
        idiomas[idiomaAtual][chave]
    ) {
        return idiomas[idiomaAtual][chave];
    }

    return chave;
}

// ========================================
// SELEÇÃO DA TRIBO
// ========================================

cards.forEach(card => {

    card.addEventListener("click", () => {

        cards.forEach(c =>
            c.classList.remove("ativo")
        );

        card.classList.add("ativo");

        triboSelecionada =
            card.dataset.tribo;

        titulo.textContent =
            card.querySelector("span").textContent;

        carregarJovens();

    });

});

// ========================================
// CARREGAR JOVENS
// ========================================

async function carregarJovens() {

    lista.innerHTML =
        `<p>${t("carregando")}</p>`;

    try {

        const resposta =
            await fetch(`${API}/jovens`);

        if (!resposta.ok) {
            throw new Error(
                "Erro ao buscar jovens."
            );
        }

        const todos =
            await resposta.json();

        jovens = todos.filter(j =>
            (j.tribo || "")
                .toLowerCase() ===
            triboSelecionada.toLowerCase()
        );

        atualizarTotal();

        renderizar(jovens);

    } catch (erro) {

        console.error("Erro:", erro);

        lista.innerHTML = `
            <p>
                Erro ao carregar os jovens.
            </p>
        `;

    }

}

// ========================================
// TOTAL
// ========================================

function atualizarTotal() {

    total.textContent =
        `${t("totalJovens")}: ${jovens.length}`;

}

// ========================================
// RENDERIZAR LISTA
// ========================================

function renderizar(listaJovens) {

    lista.innerHTML = "";

    if (!listaJovens.length) {

        lista.innerHTML = `
            <p>
                ${t("nenhumJovemEncontrado")}
            </p>
        `;

        atualizarContador();

        return;
    }

    listaJovens.forEach(jovem => {

        lista.innerHTML += `

            <div class="jovem">

                <input
                    type="checkbox"
                    class="checkJovem"
                    id="jovem-${jovem.id}"
                    value="${jovem.id}">

                <label
                    for="jovem-${jovem.id}">
                    ${jovem.nome}
                </label>

            </div>

        `;

    });

    document
        .querySelectorAll(".checkJovem")
        .forEach(check => {

            check.addEventListener(
                "change",
                atualizarContador
            );

        });

    atualizarContador();

}

// ========================================
// PESQUISA
// ========================================

pesquisa.addEventListener(
    "input",
    () => {

        const texto =
            pesquisa.value
                .trim()
                .toLowerCase();

        const filtrados =
            jovens.filter(j =>
                j.nome
                    .toLowerCase()
                    .includes(texto)
            );

        renderizar(filtrados);

    }
);

// ========================================
// CONTADOR
// ========================================

function atualizarContador() {

    quantidade.textContent =
        document.querySelectorAll(
            ".checkJovem:checked"
        ).length;

}

// ========================================
// SELECIONAR TODOS
// ========================================

selecionarTodos.addEventListener(
    "click",
    () => {

        document
            .querySelectorAll(".checkJovem")
            .forEach(check => {

                check.checked = true;

            });

        atualizarContador();

    }
);

// ========================================
// DESMARCAR TODOS
// ========================================

desmarcarTodos.addEventListener(
    "click",
    () => {

        document
            .querySelectorAll(".checkJovem")
            .forEach(check => {

                check.checked = false;

            });

        atualizarContador();

    }
);

// ========================================
// OBTER JOVENS SELECIONADOS
// ========================================

function obterSelecionados() {

    return jovens.filter(jovem => {

        const check =
            document.querySelector(
                `.checkJovem[value="${jovem.id}"]`
            );

        return check && check.checked;

    });

}

// ========================================
// FORMATAR TELEFONE
// ========================================

function formatarTelefone(numero) {

    if (!numero) return "-";

    numero =
        numero
            .toString()
            .replace(/\D/g, "");

    if (numero.length === 11) {

        return numero.replace(
            /(\d{2})(\d{5})(\d{4})/,
            "($1) $2-$3"
        );

    }

    if (numero.length === 10) {

        return numero.replace(
            /(\d{2})(\d{4})(\d{4})/,
            "($1) $2-$3"
        );

    }

    return numero;

}

// ========================================
// BLOB → BASE64
// ========================================

function blobToBase64(blob) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();

            reader.onloadend = () => {

                resolve(
                    reader.result
                        .split(",")[1]
                );

            };

            reader.onerror = reject;

            reader.readAsDataURL(blob);

        }
    );

}

// ========================================
// GERAR PDF
// ========================================

async function gerarPDF(selecionados) {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF({

        orientation: "landscape",
        unit: "mm",
        format: "a4"

    });

    const dataAtual =
        new Date()
            .toLocaleDateString("pt-BR");

    // =====================================
    // CABEÇALHO
    // =====================================

    doc.setFillColor(
        0,
        45,
        114
    );

    doc.rect(
        0,
        0,
        297,
        42,
        "F"
    );

    doc.setFillColor(
        220,
        35,
        45
    );

    doc.rect(
        0,
        42,
        297,
        5,
        "F"
    );

    doc.setTextColor(255);

    doc.setFont(
        "helvetica",
        "bold"
    );

    doc.setFontSize(24);

    doc.text(
        "FORÇA JOVEM UNIVERSAL",
        148.5,
        18,
        {
            align: "center"
        }
    );

    doc.setFontSize(15);

    doc.text(
        "Relatório da Tribo",
        148.5,
        30,
        {
            align: "center"
        }
    );

    // =====================================
    // INFORMAÇÕES
    // =====================================

    doc.setTextColor(0);

    doc.setFontSize(12);

    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.text(
        `Data: ${dataAtual}`,
        15,
        60
    );

    doc.text(
        `Tribo: ${triboSelecionada.toUpperCase()}`,
        15,
        68
    );

    doc.text(
        `Total de Jovens: ${selecionados.length}`,
        15,
        76
    );

    doc.setDrawColor(
        0,
        45,
        114
    );

    doc.line(
        15,
        83,
        282,
        83
    );

    // =====================================
    // TABELA
    // =====================================

    doc.autoTable({

        startY: 90,

        margin: {
            left: 15,
            right: 15
        },

        head: [[
            t("nome"),
            t("idade"),
            t("telefone"),
            t("status")
        ]],

        body:
            selecionados.map(jovem => [

                jovem.nome || "-",

                jovem.idade || "-",

                formatarTelefone(
                    jovem.telefone
                ),

                jovem.status || "-"

            ]),

        theme: "grid",

        styles: {

            font: "helvetica",

            fontSize: 9,

            cellPadding: 2,

            overflow: "linebreak",

            valign: "middle",

            halign: "center"

        },

        headStyles: {

            fillColor: [
                0,
                45,
                114
            ],

            textColor: 255,

            fontStyle: "bold",

            halign: "center"

        },

        alternateRowStyles: {

            fillColor: [
                245,
                245,
                245
            ]

        },

        columnStyles: {

            0: {

                cellWidth: 95,

                halign: "left"

            },

            1: {

                cellWidth: 25

            },

            2: {

                cellWidth: 55

            },

            3: {

                cellWidth: 55

            }

        }

    });

    // =====================================
    // RODAPÉ
    // =====================================

    const paginas =
        doc.internal.getNumberOfPages();

    for (
        let i = 1;
        i <= paginas;
        i++
    ) {

        doc.setPage(i);

        doc.setDrawColor(
            220,
            35,
            45
        );

        doc.line(
            15,
            190,
            282,
            190
        );

        doc.setFont(
            "helvetica",
            "normal"
        );

        doc.setFontSize(10);

        doc.setTextColor(120);

        doc.text(
            "Sistema EVG - Força Jovem Universal",
            15,
            197
        );

        doc.text(
            `Página ${i} de ${paginas}`,
            282,
            197,
            {
                align: "right"
            }
        );

    }

    // =====================================
    // RETORNAR PDF
    // =====================================

    return doc.output("blob");

}

// ========================================
// BAIXAR PDF
// ========================================

async function baixarPDF(
    blob,
    nomeArquivo
) {

    // =====================================
    // CAPACITOR / ANDROID
    // =====================================

    if (Filesystem) {

        try {

            const base64 =
                await blobToBase64(blob);

            await Filesystem.writeFile({

                path: nomeArquivo,

                data: base64,

                directory: "DOCUMENTS"

            });

            alert(
                "PDF salvo com sucesso!"
            );

            return;

        } catch (erro) {

            console.error(
                "Erro ao salvar PDF no Android:",
                erro
            );

            // Continua para o fallback
        }

    }

    // =====================================
    // NAVEGADOR
    // =====================================

    try {

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;

        link.download = nomeArquivo;

        document.body.appendChild(link);

        link.click();

        link.remove();

        URL.revokeObjectURL(url);

    } catch (erro) {

        console.error(
            "Erro ao baixar PDF:",
            erro
        );

        alert(
            "Erro ao salvar o PDF."
        );

    }

}

// ========================================
// COMPARTILHAR PDF
// ========================================

async function compartilharPDF(
    blob,
    nomeArquivo
) {

    // =====================================
    // CAPACITOR / ANDROID
    // =====================================

    if (
        Filesystem &&
        Share
    ) {

        try {

            const base64 =
                await blobToBase64(blob);

            await Filesystem.writeFile({

                path: nomeArquivo,

                data: base64,

                directory: "CACHE"

            });

            const resultado =
                await Filesystem.getUri({

                    path: nomeArquivo,

                    directory: "CACHE"

                });

            await Share.share({

                title: "Relatório EVG",

                text: "Relatório da Tribo",

                url: resultado.uri

            });

            return;

        } catch (erro) {

            console.error(
                "Erro ao compartilhar pelo Android:",
                erro
            );

        }

    }

    // =====================================
    // NAVEGADOR
    // =====================================

    try {

        const arquivo =
            new File(
                [blob],
                nomeArquivo,
                {
                    type: "application/pdf"
                }
            );

        if (
            navigator.share &&
            navigator.canShare &&
            navigator.canShare({
                files: [arquivo]
            })
        ) {

            await navigator.share({

                title: "Relatório EVG",

                text: "Relatório da Tribo",

                files: [arquivo]

            });

            return;

        }

    } catch (erro) {

        console.warn(
            "Compartilhamento do navegador indisponível:",
            erro
        );

    }

    // =====================================
    // FALLBACK
    // =====================================

    await baixarPDF(
        blob,
        nomeArquivo
    );

}

// ========================================
// BOTÃO GERAR PDF
// ========================================

document
    .getElementById("gerarPDF")
    .addEventListener(
        "click",
        async () => {

            const selecionados =
                obterSelecionados();

            if (!selecionados.length) {

                alert(
                    t("selecionarPeloMenosUm")
                );

                return;

            }

            try {

                const blob =
                    await gerarPDF(
                        selecionados
                    );

                const nomeArquivo =
                    `Relatorio_${triboSelecionada}_${Date.now()}.pdf`;

                await baixarPDF(
                    blob,
                    nomeArquivo
                );

            } catch (erro) {

                console.error(erro);

                alert(
                    "Erro ao gerar o PDF."
                );

            }

        }
    );

// ========================================
// BOTÃO WHATSAPP
// ========================================

document
    .getElementById("compartilhar")
    .addEventListener(
        "click",
        async () => {

            const selecionados =
                obterSelecionados();

            if (!selecionados.length) {

                alert(
                    t("selecionarPeloMenosUm")
                );

                return;

            }

            try {

                const blob =
                    await gerarPDF(
                        selecionados
                    );

                const nomeArquivo =
                    `Relatorio_${triboSelecionada}_${Date.now()}.pdf`;

                await compartilharPDF(
                    blob,
                    nomeArquivo
                );

            } catch (erro) {

                console.error(erro);

                alert(
                    "Erro ao gerar o PDF."
                );

            }

        }
    );

// ========================================
// INICIALIZAÇÃO
// ========================================

atualizarContador();

atualizarTotal();

console.log(
    "Relatório EVG carregado com sucesso."
);