// 🔥 FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getDatabase,
  ref,
  push
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyABnSnVlJghgdnZO-PL-cyJBVaS9d29iSI",
  authDomain: "mapa-f6979.firebaseapp.com",
  databaseURL: "https://mapa-f6979-default-rtdb.firebaseio.com",
  projectId: "mapa-f6979",
  storageBucket: "mapa-f6979.appspot.com",
  messagingSenderId: "71217218892",
  appId: "1:71217218892:web:b75e90375a9c873215fbe9"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// =========================
// 🧠 QUIZ MELHORADO
// =========================

const perguntas = [

  {
    pergunta: "O que deve ser feito ao encontrar lixo na rua?",
    respostas: [
      "Ignorar",
      "Jogar em outro lugar",
      "Descartar corretamente"
    ],
    correta: 2
  },

  {
    pergunta: "Qual atitude ajuda a melhorar a cidade?",
    respostas: [
      "Denunciar problemas urbanos",
      "Espalhar lixo",
      "Destruir espaços públicos"
    ],
    correta: 0
  },

  {
    pergunta: "O descarte irregular pode causar:",
    respostas: [
      "Alagamentos",
      "Melhoria das ruas",
      "Mais limpeza"
    ],
    correta: 0
  },

  {
    pergunta: "Como ajudar sua comunidade?",
    respostas: [
      "Participando de ações sociais",
      "Ignorando problemas",
      "Danificando patrimônio"
    ],
    correta: 0
  },

  {
    pergunta: "O que significa conscientização?",
    respostas: [
      "Ter responsabilidade com a cidade",
      "Não cuidar do espaço público",
      "Fazer vandalismo"
    ],
    correta: 0
  }

];

// =========================
// VARIÁVEIS
// =========================

let perguntaAtual = 0;
let pontos = 0;
let respondeu = false;

// ELEMENTOS
const perguntaEl = document.getElementById("pergunta");
const respostasEl = document.getElementById("respostas");
const proximoBtn = document.getElementById("proximo");
const resultadoEl = document.getElementById("resultado");

// =========================
// MOSTRAR PERGUNTA
// =========================

function mostrarPergunta() {

  respondeu = false;

  proximoBtn.style.display = "none";

  respostasEl.innerHTML = "";

  const pergunta = perguntas[perguntaAtual];

  perguntaEl.innerHTML = `
    <span>
      ${perguntaAtual + 1}/${perguntas.length}
    </span>

    <h3>${pergunta.pergunta}</h3>
  `;

  pergunta.respostas.forEach((resposta, index) => {

    const button = document.createElement("button");

    button.innerText = resposta;

    button.classList.add("resposta-btn");

    button.onclick = () => selecionarResposta(button, index);

    respostasEl.appendChild(button);

  });

}

// =========================
// SELECIONAR RESPOSTA
// =========================

function selecionarResposta(button, index) {

  if (respondeu) return;

  respondeu = true;

  const correta = perguntas[perguntaAtual].correta;

  const botoes = document.querySelectorAll(".resposta-btn");

  botoes.forEach((btn, i) => {

    btn.disabled = true;

    if (i === correta) {
      btn.style.background = "#16a34a";
    }

    if (i === index && i !== correta) {
      btn.style.background = "#dc2626";
    }

  });

  if (index === correta) {
    pontos++;
  }

  proximoBtn.style.display = "block";

}

// =========================
// PRÓXIMA
// =========================

proximoBtn.onclick = () => {

  perguntaAtual++;

  if (perguntaAtual < perguntas.length) {

    mostrarPergunta();

  } else {

    finalizarQuiz();

  }

};

// =========================
// FINALIZAR
// =========================

function finalizarQuiz() {

  perguntaEl.style.display = "none";
  respostasEl.style.display = "none";
  proximoBtn.style.display = "none";

  resultadoEl.style.display = "block";

  let mensagem = "";
  let emoji = "";

  if (pontos === 5) {

    emoji = "🏆";
    mensagem = "Excelente! Você realmente se preocupa com sua cidade.";

  } else if (pontos >= 3) {

    emoji = "👏";
    mensagem = "Muito bem! Você está no caminho certo.";

  } else {

    emoji = "⚠️";
    mensagem = "Você pode melhorar sua conscientização.";

  }

  resultadoEl.innerHTML = `

    <div class="resultado-final">

      <h2>${emoji}</h2>

      <h3>
        Você acertou ${pontos} de ${perguntas.length}
      </h3>

      <p>${mensagem}</p>

    </div>

  `;

  // 🔥 SALVAR FIREBASE

  const quizRef = ref(db, "quizResultados");

  push(quizRef, {

    pontos: pontos,
    total: perguntas.length,
    porcentagem: ((pontos / perguntas.length) * 100).toFixed(0) + "%",

    data: new Date().toLocaleString("pt-BR")

  });

  // REINICIAR

  document
    .getElementById("reiniciarQuiz")
    .onclick = reiniciarQuiz;

}


// INICIAR
mostrarPergunta();