let marcadorSelecionado = null;
let map;
let markersLayer;

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, onValue, push } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyABnSnVlJghgdnZO-PL-cyJBVaS9d29iSI",
  authDomain: "mapa-f6979.firebaseapp.com",
  databaseURL: "https://mapa-f6979-default-rtdb.firebaseio.com",
  projectId: "mapa-f6979",
  storageBucket: "mapa-f6979.appspot.com", // corrigido
  messagingSenderId: "71217218892",
  appId: "1:71217218892:web:b75e90375a9c873215fbe9"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const pontos = [
  { coords: [-5.3027, -44.4895], rua: "Av. José Olavo Sampaio", problema: "Problemas relatados", cor: "red", votos: 0 },
  { coords: [-5.2970, -44.4893], rua: "R. Graçaranha", problema: "Problemas relatados", cor: "yellow", votos: 0 },
  { coords: [-5.3063, -44.4896], rua: "R. Pedro Gualter", problema: "Problemas relatados", cor: "blue", votos: 0 },
  { coords: [-5.3130, -44.4918], rua: "Av. Antônio Bom", problema: "Problemas relatados", cor: "red", votos: 0 },
  { coords: [-5.2871, -44.4926], rua: "R. Getúlio Vargas", problema: "Problemas relatados", cor: "yellow", votos: 0 },
  { coords: [-5.2883, -44.4978], rua: "R. Eneas Sampaio", problema: "Problemas relatados", cor: "blue", votos: 0 },
  { coords: [-5.2898, -44.4984], rua: "R. Adalberto de Macedo", problema: "Problemas relatados", cor: "red", votos: 0 }
];

// 🚀 INICIAR
window.addEventListener("load", () => {

  // 🗺️ MAPA
  map = L.map('map', { zoomControl: false })
    .setView([-5.300, -44.490], 14);

  L.control.zoom({ position: 'topright' }).addTo(map);

  const normal = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
  const satelite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');

  L.control.layers({
    "Mapa normal": normal,
    "Satélite": satelite
  }).addTo(map);

  satelite.addTo(map);

  markersLayer = L.layerGroup().addTo(map);

  setTimeout(() => map.invalidateSize(), 500);

  carregarVotosFirebase();
  carregarReclamacoes();

  const form = document.getElementById("formReclamacao");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const problema = form.Problema.value;
      const local = form.Local.value;
      const categoria = form.Categoria.value;

push(ref(db, "reclamacoes"), {
  problema,
  local,
  categoria,
  tipo: categoria, // 🔥 usa categoria como tipo
  data: Date.now()
});

      alert("Reclamação enviada!");
      form.reset();
    });
  }

});

// 👍 VOTAR
window.votar = function(index) {
  const refVoto = ref(db, 'votos/' + index);

  onValue(refVoto, (snapshot) => {
    let valor = snapshot.val() || 0;
    set(refVoto, valor + 1);
  }, { onlyOnce: true });
};

function carregarVotosFirebase() {
  const votosRef = ref(db, 'votos');

  onValue(votosRef, (snapshot) => {

    let dados = snapshot.val() || {};

    pontos.forEach((p, i) => {
      p.votos = dados[i] || 0;
    });

    atualizarMapa();
    atualizarRanking();
    atualizarGrafico();
  });
}

// 🎯 ICONE
function criarIcone(cor) {
  return L.divIcon({
    className: "marker-wrapper",
    html: `
      <div class="marker-pulse marker-${cor}">
        <div class="marker-core"></div>
      </div>
    `
  });
}

function criarIconeTipo(tipo) {

  let emoji = "📍";

  if (tipo === "Segurança") emoji = "🚨";
  if (tipo === "Iluminação") emoji = "💡";
  if (tipo === "Infraestrutura") emoji = "🕳️";
  if (tipo === "Limpeza") emoji = "🧹";

  return L.divIcon({
    className: "marker-wrapper",
    html: `
      <div style="
        font-size: 20px;
        background: #0b1224;
        padding: 6px 10px;
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.1);
      ">
        ${emoji}
      </div>
    `
  });
}


function atualizarMapa() {

  markersLayer.clearLayers();

  let total = pontos.reduce((soma, p) => soma + p.votos, 0);

  pontos.forEach((p) => {

    let porcentagem = total > 0
      ? ((p.votos / total) * 100).toFixed(1)
      : 0;

    L.marker(p.coords, {
      icon: criarIcone(p.cor)
    })
    .addTo(markersLayer)
    .bindPopup(`
      <div class="popup">
        <strong>${p.rua}</strong>
        <p>${p.problema}</p>
        <p><b>${porcentagem}% consideram perigosa</b></p>
        <p>Vote na lista abaixo 👇</p>
      </div>
    `);
  });
}

function atualizarRanking() {

  const container = document.getElementById("listaRuas");
  if (!container) return;

  container.innerHTML = "";

  let total = pontos.reduce((soma, p) => soma + p.votos, 0);

  let ordenado = [...pontos].sort((a, b) => b.votos - a.votos);

  ordenado.forEach((p) => {

    let porcentagem = total > 0
      ? ((p.votos / total) * 100)
      : 0;

    container.innerHTML += `
      <div class="item-rua">
        
        <div class="topo">
          <span>${p.rua}</span>
          <span class="votos">${p.votos} votos</span>
        </div>

        <div class="barra">
          <div class="progresso" style="width: ${porcentagem}%"></div>
        </div>

        <button onclick="votar(${pontos.indexOf(p)})">
          Votar
        </button>

      </div>
    `;
  });
}

function carregarReclamacoes() {

  const lista = document.getElementById("listaReclamacoes");
  if (!lista) return;

  const refReclamacoes = ref(db, "reclamacoes");

  onValue(refReclamacoes, (snapshot) => {

    let dados = snapshot.val();
    if (!dados) {
      lista.innerHTML = "<p>Sem reclamações ainda...</p>";
      return;
    }

    // transforma em array
    let reclamacoes = Object.values(dados);

    // ordena pelas mais recentes (IMPORTANTE)
    reclamacoes.sort((a, b) => {
      return new Date(b.data) - new Date(a.data);
    });

    // pega só as 4 mais recentes
    let ultimas4 = reclamacoes.slice(0, 4);

    lista.innerHTML = "";

    ultimas4.forEach((r) => {

      let cor = "#22c55e";

      if (r.categoria === "Segurança") cor = "#ef4444";
      if (r.categoria === "Iluminação") cor = "#facc15";
      if (r.categoria === "Infraestrutura") cor = "#3b82f6";
      if (r.categoria === "Limpeza") cor = "#10b981";

      lista.innerHTML += `
        <div class="item-reclamacao" style="border-left: 5px solid ${cor}">
          <strong>${r.categoria}</strong>
          <p>${r.problema}</p>
          <span>${r.local}</span>
          <small>${r.data}</small>
        </div>
      `;
    });

  });

}

let grafico;

function atualizarGrafico() {

  const canvas = document.getElementById('graficoVotos');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  const nomes = pontos.map(p => p.rua);
  const votos = pontos.map(p => p.votos);

  if (grafico) {
    grafico.destroy();
  }

  grafico = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: nomes,
      datasets: [{
        label: 'Votos',
        data: votos,
        borderWidth: 1,
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,

      animation: {
        duration: 1200,
        easing: 'easeOutQuart'
      },

      plugins: {
        legend: {
          display: false
        }
      },

      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: "#9ca3af" // cor dos números
          }
        },
        x: {
          ticks: {
            color: "#9ca3af" // nomes das ruas
          }
        }
      }
    }
  });
}