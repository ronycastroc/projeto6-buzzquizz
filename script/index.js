let quizz;
let idQuizz;
let perguntas;
let questions;
let arrayPerguntas = []
let caixaQuestion;

const objQuizz = {
    id: "",
    key: ""
}


let allQuizz = document.querySelector('.quizz-publico')
let perguntasHidden = document.querySelector('.perguntas')
let caixaUsuario = document.querySelector('.caixa-usuario')
let todosQuizz = document.querySelector('.todos-quizz')
let quizzPublico = document.querySelector('.quizz-publico')

function minhasQuizz() {
    let aux = [{ id: 100, key: 1 },
    { id: 101, key: 1 },
    { id: 102, key: 1 },
    { id: 103, key: 1 }
    ];



    // localStorage.getItem("quizz")
    // if (aux) {
        // aux = JSON.parse(localStorage.getItem("quizz"));

        // caixaUsuario.innerHTML += `
        // <section class="quizz-criada">
                
        //     <div class="suas-quizz">
        //         <h2>Suas quizz</h2>
        //         <ion-icon name="add-circle" onclick="criarQuizz()"></ion-icon>
        //     </div>

        //     <ul class='quizz-usuario'>
                           
        //     </ul>
        // </section>
        // `

        // let quizzUsuario = document.querySelector('.quizz-usuario')

        // aux.forEach(x => {
        //     quizzUsuario.innerHTML += `
        //     <li onclick="perguntaQuizz(${x.id})">
        //         <img src="imgteste/one-punch-man.webp" alt="">
        //         <p>Acerte os personagens corretos do one punch man e prove seu amor!</p>
        //         <span></span>
        //     </li>`
        // })


//     } else {

      caixaUsuario.innerHTML += `
        <section class="quizz-nao-criada">
            <div class="info">
                <p>Você não criou nenhum quizz ainda :(</p>
            </div>
                
            <div class="criar" onclick="criarQuizz()">
                <p>Criar Quizz</p>
            </div>
        </section>
`
//     }
}

minhasQuizz();

function buscarQuizz() {
    const promise = axios.get('https://mock-api.driven.com.br/api/v7/buzzquizz/quizzes')

    promise.then(rendereizarQuizz)
}
buscarQuizz()

function rendereizarQuizz(resposta) {
    quizz = resposta.data
    allQuizz.innerHTML = ''

    for (let i = 0; i < quizz.length; i++) {

        allQuizz.innerHTML += `
            <li onclick="perguntaQuizz(this)">
                <img src="${quizz[i].image}" alt="">
                <p>${quizz[i].title}</p>
                <span>${quizz[i].id}</span>
            </li>
            `
    }

}

function criarQuizz() {
    location.assign("quiz.html");

}

function perguntaQuizz(elemento) {
    idQuizz = elemento.querySelector('li span').innerHTML
    caixaUsuario.innerHTML = ''
    todosQuizz.innerHTML = ''
    quizzPublico.innerHTML = ''

    buscarPerguntas()
}

function buscarPerguntas() {
    let promise = axios.get(`https://mock-api.driven.com.br/api/v7/buzzquizz/quizzes/${idQuizz}`)

    promise.then(renderizarPerguntas)
}

function renderizarPerguntas(resposta) {
    perguntasHidden.classList.remove('escondido')
    perguntas = resposta.data
    questions = perguntas.questions
    console.log(perguntas)

    perguntasHidden.innerHTML += `
                <div class="topo-perguntas">
                    <img src="${perguntas.image}" alt="">
                    <h2>${perguntas.title}</h2>
                </div>
            `

    for (let i = 0; i < perguntas.questions.length; i++) {

        perguntasHidden.innerHTML += `
                    <ul class="caixa-perguntas">
                
                        <div class="question">
                            <div class="topo-question">
                                <h3>${questions[i].title}</h3>
                            </div>                      
                            
                            <div class="img-question">

                            </div>
                        </div>
                    
                    </ul> 
                    `
        let cor = document.querySelectorAll('.topo-question')[i]
        cor.style.background = `${questions[i].color}`

        for (let c = 0; c < questions[i].answers.length; c++) {

            caixaQuestion = document.querySelectorAll('.img-question')[i]

            let perguntaTamplate = `
                        
                            <div class="img" onclick="clickResposta(this)">
                                <img src="${questions[i].answers[c].image}" alt="">
                                <p>${questions[i].answers[c].text}</p>
                                <span>${questions[i].answers[c].isCorrectAnswer}</span>
                            </div>   
                            
                            
                        `

            arrayPerguntas.sort(comparador)
            function comparador() {
                return Math.random() - 0.5;
            }
            arrayPerguntas.push(perguntaTamplate)
            caixaQuestion.innerHTML = arrayPerguntas.join('')

        }
        arrayPerguntas = []
    }

}


let acerto = 0
let click = 0
function clickResposta(elemento) {
    let allQuestion;
    let trueFalse;

    allQuestion = elemento.parentNode
    trueFalse = elemento.querySelector('span').innerHTML
    click++

    console.log(trueFalse)
    if (trueFalse === 'true') {
        acerto++
    }
    console.log(acerto)
    console.log(click)

    for (let i = 0; i < perguntas.questions.length; i++) {
        for (let c = 0; c < questions[i].answers.length; c++) {
            allQuestion.querySelectorAll('.img')[c].removeAttribute('onclick')
            allQuestion.querySelectorAll('.img')[c].classList.add('opacity')

            if (allQuestion.querySelectorAll('.img span')[c].innerHTML === 'true') {
                allQuestion.querySelectorAll('.img p')[c].classList.add('verde')
            }

            else {
                allQuestion.querySelectorAll('.img p')[c].classList.add('vermelho')
            }
        }
    }

    elemento.classList.remove('opacity')

    if (click === perguntas.questions.length) {
        resultado()
    }

    let scroll = document.querySelectorAll('.question')[click]

    setTimeout(function () {
        scroll.scrollIntoView()
    }, 2000)
}

function resultado() {
    let porcentagem = perguntas.questions.length - acerto
    porcentagem *= 100
    porcentagem /= perguntas.questions.length
    porcentagem = 100 - porcentagem
    porcentagem = Math.round(porcentagem)

    console.log(porcentagem)

    perguntasHidden.innerHTML += `
        <div class="caixa-final">

        </div>
        `

    for (let i = 0; i < perguntas.levels.length; i++) {
        if (porcentagem >= perguntas.levels[i].minValue) {

            let caixaFinal = document.querySelector('.caixa-final')
            caixaFinal.innerHTML = `
                
                    <div class="res-question">
                        <div class="topo-res-question">
                            <h3>${porcentagem}% de acerto: ${perguntas.levels[i].title}</h3>
                        </div>

                        
                        <div class="img-res-question">
                            <div class="img">
                                <img src="${perguntas.levels[i].image}" alt="">                            
                            </div>

                            <div class="txt-final">
                                <p>${perguntas.levels[i].text}</p>
                            </div>
                        </div>                    
                    </div>
                    
                    <div class="reiniciar-voltar">
                        <div class="reiniciar" onclick='reiniciarQuizz()'>
                            <p>Reiniciar Quizz</p>
                        </div>

                        <div class="voltar" onclick='voltarHome()'>
                            <p>Voltar para home</p>
                        </div>
                    </div>
                
                `

        }
    }

    let scroll = document.querySelector('.res-question')
    setTimeout(function () {
        scroll.scrollIntoView()
    }, 2000)
}

function reiniciarQuizz() {
    perguntasHidden.innerHTML = ''
    acerto = 0
    click = 0

    perguntasHidden.innerHTML += `
                <div class="topo-perguntas">
                    <img src="${perguntas.image}" alt="">
                    <h2>${perguntas.title}</h2>
                </div>
            `

    for (let i = 0; i < perguntas.questions.length; i++) {

        perguntasHidden.innerHTML += `
                    <ul class="caixa-perguntas">
                
                        <div class="question">
                            <div class="topo-question">
                                <h3>${questions[i].title}</h3>
                            </div>                      
                            
                            <div class="img-question">

                            </div>
                        </div>
                    
                    </ul> 
                    `
        let cor = document.querySelectorAll('.topo-question')[i]
        cor.style.background = `${questions[i].color}`

        for (let c = 0; c < questions[i].answers.length; c++) {

            caixaQuestion = document.querySelectorAll('.img-question')[i]

            let perguntaTamplate = `
                        
                            <div class="img" onclick="clickResposta(this)">
                                <img src="${questions[i].answers[c].image}" alt="">
                                <p>${questions[i].answers[c].text}</p>
                                <span>${questions[i].answers[c].isCorrectAnswer}</span>
                            </div>   
                            
                            
                        `

            arrayPerguntas.sort(comparador)
            function comparador() {
                return Math.random() - 0.5;
            }
            arrayPerguntas.push(perguntaTamplate)
            caixaQuestion.innerHTML = arrayPerguntas.join('')

        }
        arrayPerguntas = []
    }

    const scroll = document.querySelector('.topo-perguntas')
    scroll.scrollIntoView()
}

function voltarHome() {
    window.location.reload()
}
