// 🔥 Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

// 🧠 Perguntas
const perguntas = [
  {
    pergunta: "Você descarta o lixo corretamente?",
    respostas: ["Sempre", "Às vezes", "Nunca"],
    correta: 0
  },
  {
    pergunta: "Você denuncia problemas da sua cidade?",
    respostas: ["Sim", "Às vezes", "Nunca"],
    correta: 0
  },
  {
    pergunta: "Você ajuda a manter sua rua limpa?",
    respostas: ["Sim", "Mais ou menos", "Não"],
    correta: 0
  },
  {
    pergunta: "Você já participou de alguma ação comunitária?",
    respostas: ["Sim", "Não"],
    correta: 0
  },
  {
    pergunta: "Você acredita que pode melhorar sua cidade?",
    respostas: ["Sim", "Talvez", "Não"],
    correta: 0
  }
];

let atual = 0;
let pontos = 0;

// Elementos
const perguntaEl = document.getElementById("pergunta");
const respostasEl = document.getElementById("respostas");
const proximoBtn = document.getElementById("proximo");
const resultadoEl = document.getElementById("resultado");

// Mostrar pergunta
function mostrarPergunta() {
  respostasEl.innerHTML = "";
  perguntaEl.innerText = perguntas[atual].pergunta;

  perguntas[atual].respostas.forEach((resposta, i) => {
    const btn = document.createElement("button");
    btn.innerText = resposta;

    btn.onclick = () => {
      if (i === perguntas[atual].correta) {
        pontos++;
      }
      proximoBtn.style.display = "block";
    };

    respostasEl.appendChild(btn);
  });
}

// Próxima pergunta
proximoBtn.onclick = () => {
  atual++;

  if (atual < perguntas.length) {
    mostrarPergunta();
    proximoBtn.style.display = "none";
  } else {
    finalizarQuiz();
  }
};

// Finalizar
function finalizarQuiz() {
  perguntaEl.style.display = "none";
  respostasEl.style.display = "none";
  proximoBtn.style.display = "none";

  resultadoEl.style.display = "block";

  let mensagem = "";

  if (pontos >= 4) {
    mensagem = "👏 Você é muito consciente!";
  } else if (pontos >= 2) {
    mensagem = "👍 Você está no caminho certo!";
  } else {
    mensagem = "⚠️ Você pode melhorar sua conscientização!";
  }

  resultadoEl.innerHTML = `
    <h3>Você fez ${pontos} de ${perguntas.length} pontos</h3>
    <p>${mensagem}</p>
  `;

  // salvar no Firebase
  const quizRef = ref(db, "quizResultados");

  push(quizRef, {
    pontos: pontos,
    total: perguntas.length,
    data: new Date().toLocaleString()
  });
}

// iniciar
mostrarPergunta();