// ======================================
// PERMISSÕES EVG
// ======================================

function getTriboUsuario() {

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) {

        return "";

    }

    return (usuario.tribo || "").toLowerCase();

}

function isObreiro() {

    return getTriboUsuario() === "obreiro";

}

function isCoordenador() {

    return getTriboUsuario() === "coordenador";

}

function podeAcessarRelatorios() {

    return isObreiro() || isCoordenador();

}