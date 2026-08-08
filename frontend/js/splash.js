document.addEventListener("DOMContentLoaded", () => {

    const splash = document.querySelector(".splash");

    if (!splash) {
        window.location.href = "login.html";
        return;
    }

    setTimeout(() => {

        splash.classList.add("sair");

        setTimeout(() => {

            window.location.replace("login.html");

        }, 800);

    }, 2500);

});