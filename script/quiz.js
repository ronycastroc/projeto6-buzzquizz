let titulo = 0;
let url_image = 0;
let qtd_perguntas = 0;
let qtd_niveis = 0;

const url_api = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";
const objeto_post = {
    title: "",
    image: "",
    questions: [],
    levels: []
}

const obejto_pessoa = {
    quizzs: []
}
let pessoa = obejto_pessoa;
let objeto_post_Storage = objeto_post;




function expande(element) {
    const pergunta = element.parentElement.parentElement;
    const filhos = pergunta.childElementCount;

    if (!pergunta.classList.contains("expandir")) {
        pergunta.classList.add("expandir");
        element.querySelector("ion-icon").style.color = "#FFFFFF";
        if (filhos === 1) {
            pergunta.style.height = "480px"
        } else {
            pergunta.style.height = "740px";
        }

    } else {
        pergunta.classList.remove("expandir");
        pergunta.style.height = "90px"
        element.querySelector("ion-icon").style.color = "#000000";
    }
}



function chamarPeguntas(content) {

    titulo = content.titulo.value;
    url_image = content.url_image.value;
    qtd_perguntas = content.qtd_perguntas.value;
    qtd_niveis = content.qtd_niveis.value;

    localStorage.removeItem("qtd_pergunta");
    localStorage.removeItem("qtd_niveis");

    localStorage.setItem("qtd_pergunta", qtd_perguntas);
    localStorage.setItem("qtd_niveis", qtd_niveis);


    objeto_post_Storage.title = titulo;
    objeto_post_Storage.image = url_image;
    

    objeto_post_Storage = JSON.stringify(objeto_post_Storage);

    localStorage.removeItem("post");

    localStorage.setItem("post", objeto_post_Storage)






    // console.log("titulo: " + titulo);
    // console.log("url: " + url_image);
    // console.log("qtd perguntas: " + qtd_perguntas);
    // console.log("qtd niveis: " + qtd_niveis);

    return false;

}

function criarPeguntas() {
    const content_quiz = document.querySelector(".content-quiz");
    qtd_perguntas = localStorage.getItem("qtd_pergunta")
    qtd_perguntas = parseInt(qtd_perguntas);


    for (let i = 0; i < qtd_perguntas; i++) {

        content_quiz.innerHTML += `
                        <div class="pergunta">
                                    <div>
                                        <div onclick="expande(this)">
                                            <p>Pergunta</p>
                                            <ion-icon name="create-outline"></ion-icon>
                                        </div>
                                        <input name="pergunta${i}" placeholder="Texto da pergunta: no mínimo 20 caracteres" minlength="20" type="text" required>
                                        <input name="cor${i}" placeholder="Cor de Fundos da Pergunta:" type="text"
                                        minlength="7" maxlength="7"  pattern="^#([A-Fa-f0-9]{6})$" required>
                                    </div>
                                    <div>
                                        <p>Reposta correta</p>
                                        <input name="resposta${i}_0" placeholder="Resposta correta" type="text" required>
                                        <input name="url_reposta${i}_0" placeholder="URL da imagem" type="url" required>
                                    </div>
                                    <div>
                                        <p>Reposta incorretas</p>
                                        <input name="resposta${i}_1" placeholder="Resposta incorreta 1" type="text" required>
                                        <input name="url_reposta${i}_1" placeholder="URL da imagem" type="url" required>
                                        <input name="resposta${i}_2" placeholder="Resposta incorreta 2" type="text">
                                        <input name="url_reposta${i}_2" placeholder="URL da imagem" type="url">
                                        <input name="resposta${i}_3" placeholder="Resposta incorreta 3" type="text">
                                        <input name="url_reposta${i}_3" placeholder="URL da imagem" type="url">
                                    </div>
                        </div>`
    }
    content_quiz.innerHTML += `<input class="button-quiz" type="submit" value="Prosseguir pra cria níveis">    `
}

function guardaPerguntas() {


    objeto_post_Storage = JSON.parse(localStorage.getItem("post"))



    for (let i = 0; i < qtd_perguntas; i++) {

        objeto_post_Storage.questions.push({
            title: document.querySelector(`[name="pergunta${i}"]`).value,
            color: document.querySelector(`[name="cor${i}"]`).value,
            answers: []
        })
    }

    for (let y = 0; y < qtd_perguntas; y++) {

        for (let i = 0; i < 4; i++) {

            if (i === 0) {
                objeto_post_Storage.questions[y].answers.push({

                    text: document.querySelector(`[name="resposta${y}_${i}"]`).value,
                    image: document.querySelector(`[name="url_reposta${y}_${i}"]`).value,
                    isCorrectAnswer: true

                })

            } else if (document.querySelector(`[name="resposta${y}_${i}"]`).value && document.querySelector(`[name="resposta${y}_${i}"]`).value) {
                objeto_post_Storage.questions[y].answers.push({

                    text: document.querySelector(`[name="resposta${y}_${i}"]`).value,
                    image: document.querySelector(`[name="resposta${y}_${i}"]`).value,
                    isCorrectAnswer: false

                })
            }

        }
    }

    localStorage.removeItem("post");
    objeto_post_Storage = JSON.stringify(objeto_post_Storage);
    localStorage.setItem("post", objeto_post_Storage);




    return false;
}

function criarNiveis() {
    const content_quiz = document.querySelector(".content-quiz");
    qtd_niveis = localStorage.getItem("qtd_niveis")
    qtd_niveis = parseInt(qtd_niveis);

    for (let i = 0; i < qtd_niveis; i++) {


        if (i === qtd_niveis - 1) {
            // trabalhei primeiro a excessão
            content_quiz.innerHTML += `<div class="pergunta">
            <div>
                <div onclick="expande(this)">
                    <p>Nivel ${i + 1}</p>
                    <ion-icon name="create-outline"></ion-icon>
                </div>
                <input name="titulo_nivel_${i}" placeholder="Título do nível" minlength="10" type="text" required>
                <input name="porcetagem${i}" placeholder="% de acerto mínima" min="0" max="0" type="number" required>
                <input name="url_porcetagem${i}" placeholder="URL da imagem do nível"  type="url" required>
                <textarea name="textarea${i}" placeholder="Descrição do nível" minlength="30" required></textarea>
            </div>
        </div>`
        } else {
            content_quiz.innerHTML += `<div class="pergunta">
                                            <div>
                                            <div onclick="expande(this)">
                                            <p>Nivel ${i + 1}</p>
                                            <ion-icon name="create-outline"></ion-icon>
                                            </div>
                                            <input name="titulo_nivel_${i}" placeholder="Título do nível" minlength="10" type="text" required>
                                            <input name="porcetagem${i}" placeholder="% de acerto mínima" min="0" max="100" type="number" required>
                                            <input name="url_porcetagem${i}" placeholder="URL da imagem do nível"  type="url" required>
                                            <textarea name="textarea${i}" placeholder="Descrição do nível" minlength="30" required></textarea>
                                            </div>
                                        </div>`
        }


    }

    content_quiz.innerHTML += ` <input class="button-quiz" type="submit" value="Prosseguir pra cria níveis">`
}

function guardarNiveis() {

    objeto_post_Storage = JSON.parse(localStorage.getItem("post"))

    for (let i = 0; i < qtd_niveis; i++) {

        objeto_post_Storage.levels.push({
            title: document.querySelector(`[name="titulo_nivel_${i}"]`).value,
            image: document.querySelector(`[name="url_porcetagem${i}"]`).value,
            text: document.querySelector(`[name="textarea${i}"]`).value,
            minValue: parseInt(document.querySelector(`[name="porcetagem${i}"]`).value)
        })
    }

    localStorage.removeItem("post");
    objeto_post_Storage = JSON.stringify(objeto_post_Storage);
    localStorage.setItem("post", objeto_post_Storage);


    return false;

}

function criarPagePronto() {
    const content_quiz = document.querySelector(".content-quiz");
    let aux = JSON.parse(localStorage.getItem("quizz"));

    objeto_post_Storage = JSON.parse(localStorage.getItem("post"));

    localStorage.removeItem("qtd_pergunta");
    localStorage.removeItem("qtd_niveis");
    

    content_quiz.innerHTML += `<div class="quiz-img">
                                 <img src="${objeto_post_Storage.image}" alt="">
                                    <p>${objeto_post_Storage.title}</p>
                                </div>`
                               




    const post = axios.post(url_api, objeto_post_Storage);

    post.then(x => {
        localStorage.setItem("pessoa", JSON.stringify({ id: x.data.id, key: x.data.key}));
        content_quiz.innerHTML += `<input class="button-quiz" onclick="rederizarQuiz(${x.data.id})" type="submit" value="Acessar  Quizz">

        <div onclick="home()" class="button-volta">
            <span>Voltar pra home</span>
        </div>
        </div>`
    });
    pessoa.quizzs.push(aux.quizzs);
    pessoa.quizzs.push(JSON.parse(localStorage.getItem("pessoa")));
    localStorage.removeItem("quizz");
    localStorage.setItem("quizz", JSON.stringify(pessoa));

}




function home() {
    location.assign("index.html");
}

function rederizarQuiz(id){
    alert("ID: " + id)
}


function form(content) {
    alert("deucerto " + content.titulo.value);
    return false;
}

//post.then(x => x.data)

//Objeto post
// {
// 	title: "Título do quizz",
// 	image: "https://http.cat/411.jpg",
// 	questions: [
// 		{
// 			title: "Título da pergunta 1",
// 			color: "#123456",
// 			answers: [
// 				{
// 					text: "Texto da resposta 1",
// 					image: "https://http.cat/411.jpg",
// 					isCorrectAnswer: true
// 				},
// 				{
// 					text: "Texto da resposta 2",
// 					image: "https://http.cat/412.jpg",
// 					isCorrectAnswer: false
// 				}
// 			]
// 		},
// 		{
// 			title: "Título da pergunta 2",
// 			color: "#123456",
// 			answers: [
// 				{
// 					text: "Texto da resposta 1",
// 					image: "https://http.cat/411.jpg",
// 					isCorrectAnswer: true
// 				},
// 				{
// 					text: "Texto da resposta 2",
// 					image: "https://http.cat/412.jpg",
// 					isCorrectAnswer: false
// 				}
// 			]
// 		},
// 		{
// 			title: "Título da pergunta 3",
// 			color: "#123456",
// 			answers: [
// 				{
// 					text: "Texto da resposta 1",
// 					image: "https://http.cat/411.jpg",
// 					isCorrectAnswer: true
// 				},
// 				{
// 					text: "Texto da resposta 2",
// 					image: "https://http.cat/412.jpg",
// 					isCorrectAnswer: false
// 				}
// 			]
// 		}
// 	],
// 	levels: [
// 		{
// 			title: "Título do nível 1",
// 			image: "https://http.cat/411.jpg",
// 			text: "Descrição do nível 1",
// 			minValue: 0
// 		},
// 		{
// 			title: "Título do nível 2",
// 			image: "https://http.cat/412.jpg",
// 			text: "Descrição do nível 2",
// 			minValue: 50
// 		}
// 	]
// }

