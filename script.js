let marcadorSelecionado = null;
let map;
let markersLayer;

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, onValue, push } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// 🔑 FIREBASE
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "mapa-f6979.firebaseapp.com",
  databaseURL: "https://mapa-f6979-default-rtdb.firebaseio.com",
  projectId: "mapa-f6979",
  storageBucket: "mapa-f6979.appspot.com",
  messagingSenderId: "71217218892",
  appId: "1:71217218892:web:b75e90375a9c873215fbe9"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 📍 PONTOS
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

  // 📝 FORM
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
        data: new Date().toLocaleString()
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

// 🔄 CARREGAR VOTOS
function carregarVotosFirebase() {
  const votosRef = ref(db, 'votos');

  onValue(votosRef, (snapshot) => {

    let dados = snapshot.val() || {};

    pontos.forEach((p, i) => {
      p.votos = dados[i] || 0;
    });

    atualizarMapa();
    atualizarRanking();
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

// 🗺️ ATUALIZAR MAPA
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

// 🏆 RANKING
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