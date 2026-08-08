document.addEventListener("DOMContentLoaded", () => {

    console.log("SPLASH INICIADA");

    const splash = document.querySelector(".splash");

    if (!splash) {
        console.log("SPLASH NÃO ENCONTRADA");
        return;
    }

    console.log("SPLASH ENCONTRADA");

    setTimeout(() => {

        console.log("INICIANDO SAÍDA");

        splash.classList.add("sair");

        setTimeout(() => {

            console.log("INDO PARA LOGIN");

            window.location.href = "login.html";

        }, 800);

    }, 2500);

});