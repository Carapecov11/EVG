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

            const loginUrl = new URL("login.html", window.location.href);

            window.location.replace(loginUrl.href);

        }, 800);

    }, 2500);

});