document.getElementById("btnVoltar").addEventListener("click", () => {
    window.location.href = "principal.html";
});
// ===============================
// TELEGRAM DO BISPO
// ===============================

const telegramBispo =
    "https://t.me/BispoMacedoOficial";

document
    .getElementById("telegramBtn")
    .addEventListener("click", () => {

        window.open(telegramBispo, "_blank");

    });

// ===============================
// BANNERS
// ===============================

const portal = [
    {
        titulo: "Noticias",
        texto: "Fique ligado nas útimas Notícias",
        imagem: "./images/noticias.jpeg",
        link: "https://www.universal.org/noticias/"
    },
    {
        titulo: "Doar",
        texto: "Faça sua doação pelo Portal Universal",
        imagem: "./images/doar.jpeg",
        link: "https://doar.universal.org/"
    },
    {
        titulo: "Podcast",
        texto: "Ouça nossas Mensagens e Progamas",
        imagem: "./images/podcast.jpeg",
        link: "https://www.universal.org/podcasts/"
    }
];

const univer = [
    {
        imagem: "./images/amoremruinas.webp",
        titulo: "Amor em Ruínas",
        texto: "Será que conhecemos o verdadeiro amor? ",
        link: "https://www.univervideo.com/pt/serie/amor-em-ruinas/"
    },
    {
        imagem: "./images/jo.jpg",
        titulo: "A Vida de Jo",
        texto: "Íntegro, reto e temente a Deus, Jó é um jovem diferente dos demais.",
        link: "https://www.univervideo.com/pt/serie/a-vida-de-jo/"
    },
    {
        imagem: "./images/Jesus.jpeg",
        titulo: "Jesus",
        texto: "Quando a história dos homens estava perto de cair em desgraça, a história do mundo muda para sempre após a chegada do Salvador.",
        link: "https://www.univervideo.com/pt/serie/novela-jesus/"
    },
    {
        imagem: "./images/ucrania.jpeg",
        titulo: "Uma dia na vida de um Pastor na Ucrânia",
        texto: "Como é fazer uma Obra de Deus em um país em guerra?",
        link: "https://play.univervideo.com/#/home_home/home/mediadetail?mediaId=31e0a9e0-ec68-4681-bdde-d33e8d6ed7a0&mediaType=Title&contentLocation=Em%20alta"
    },
    {
        imagem: "./images/nerfarious.jpeg",
        titulo: "Nefarious",
        texto: "Nefarious é o filme que mostra como o diabo age de maneira invisível no mundo atual.",
        link: "https://www.univervideo.com/blog/post/filme_nefarious"
    },
    {
        imagem: "./images/loveschool.jpeg",
        titulo: "Love School",
        texto: "Um programa que ensina sobre o amor e a importância das relações humanas.",
        link: "https://play.univervideo.com/#/home_home/home/vodcategory?menuSlug=programas/mediadetail?mediaId=d783e396-277b-4a47-9ea4-37b7034436c8&mediaType=Series&contentLocation=Voc%C3%AA%20vai%20gostar"
    }
];

const arca = [
    {
        imagem: "./images/roupas.jpeg",
        titulo: "Roupas",
        texto: "Camisetas Oficiais e muito mais!",
        link: "https://arcacenter.com.br/grupos/fju?srsltid=AfmBOoqbOmgWdvOf0-Ar5e3Jnz3EFj5EUNZlNwH37aVCYhMKVQv56KTL"
    },
    {
        imagem: "./images/livros.jpeg",
        titulo: "Livros",
        texto: "Edições especiais e muito mais!",
        link: "https://arcacenter.com.br/livros?srsltid=AfmBOop7fVsJ46rjSmLcLgNy4z4EDryW4rraxTen7Rs1jVPPun4yMzDP"
    },
    {
        imagem: "./images/colar.jpeg",
        titulo: "Acessórios",
        texto: "Acessórios oficiais e muito mais!",
        link: "https://arcacenter.com.br/acessorios?srsltid=AfmBOoqbOmgWdvOf0-Ar5e3Jnz3EFj5EUNZlNwH37aVCYhMKVQv56KTL"
    }
];
const podcast =
    "https://www.youtube.com/playlist?list=PLnCp082rx5tWKmSI8XiJcfYvY6KPKZibr";

document
.getElementById("PodcastBtn")
.addEventListener("click",()=>{

    window.location.href = podcast;

});
const redes = {

    instagram: "https://www.instagram.com/universalvilamariaoficial?igsh=MThqNzV0dW1qNHJ2YQ==",
    youtube: "https://www.youtube.com/@For%C3%A7aJovemUniversal",
    facebook: "https://www.facebook.com/universalvilamaria",

};

Object.keys(redes).forEach(rede => {

    document.getElementById(rede).addEventListener("click", () => {

        window.open(redes[rede], "_blank");

    });

});


// ===============================
// CRIAR CARROSSEL
// ===============================

function criarCarrossel(nome, banners){

    const track = document.getElementById(`${nome}-track`);
    const dots = document.getElementById(`${nome}-dots`);

    let atual = 0;

    // cria banners

    banners.forEach((banner, indice)=>{

        const slide = document.createElement("div");
        slide.className = "banner";

        slide.innerHTML = `
            <div class="banner-content">

                <img src="${banner.imagem}" alt="${banner.titulo}">

                <div class="banner-texto">

                    <h3>${banner.titulo}</h3>

                    <p>${banner.texto}</p>

                </div>

            </div>
        `;

        track.appendChild(slide);

        const dot = document.createElement("div");

        dot.className = "dot";

        if(indice===0){

            dot.classList.add("active");

        }

        dots.appendChild(dot);

    });

    const listaDots = dots.querySelectorAll(".dot");

    function atualizar(){

        track.style.transform =
            `translateX(-${atual*100}%)`;

        listaDots.forEach(d=>d.classList.remove("active"));

        listaDots[atual].classList.add("active");

    }

    // botão próximo

    document
    .querySelector(`#${nome}-carousel .next`)
    .onclick = ()=>{

        atual++;

        if(atual>=banners.length){

            atual=0;

        }

        atualizar();

    };

    // botão voltar

    document
    .querySelector(`#${nome}-carousel .prev`)
    .onclick = ()=>{

        atual--;

        if(atual<0){

            atual=banners.length-1;

        }

        atualizar();

    };

    // automático

    setInterval(()=>{

        atual++;

        if(atual>=banners.length){

            atual=0;

        }

        atualizar();

    },5000);

}


// ===============================
// INICIAR
// ===============================

criarCarrossel("portal",portal);

criarCarrossel("univer",univer);

criarCarrossel("arca",arca);