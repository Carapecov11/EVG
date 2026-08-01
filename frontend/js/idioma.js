function aplicarIdioma() {

    const idiomaAtual = localStorage.getItem("idioma") || "pt";
    const traducao = idiomas[idiomaAtual];

    if (!traducao) return;

    // Atualiza idioma do HTML
    document.documentElement.lang = idiomaAtual;

    // Atualiza título da página
    if (traducao.tituloLogin) {
        document.title = traducao.tituloLogin;
    }

    // Textos
    document.querySelectorAll("[data-lang]").forEach(elemento => {

        const chave = elemento.getAttribute("data-lang");

        if (traducao[chave]) {
            elemento.textContent = traducao[chave];
        }

    });
    // Placeholders
    document.querySelectorAll("[data-placeholder]").forEach(elemento => {
        const chave = elemento.getAttribute("data-placeholder");
        
        if (traducao[chave]) {
            elemento.placeholder = traducao[chave];
        }
        
    });

    if (typeof atualizarTituloTribo === "function") {
        atualizarTituloTribo();
    }
    
}
document.addEventListener("DOMContentLoaded", aplicarIdioma);