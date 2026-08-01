document.addEventListener("DOMContentLoaded", () => {

    const splash = document.querySelector(".splash");

    if (!splash) return;


    setTimeout(() => {

        splash.classList.add("sair");


        setTimeout(() => {

            window.location.href = "login.html";

        }, 800);


    }, 2500);


});