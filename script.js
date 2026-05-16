let marcadorSelecionado = null;
let map;
let markersLayer;
let markersUsuarios;
let markersFixos;


Chart.defaults.font.family = "'Inter', 'Poppins', sans-serif";

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

  // 🔴 AVENIDAS / BRs
  {
    coords: [-5.295101262486362, -44.49662850346243],
    rua: "Av. Tancredo Neves",
    problema: "⚠️ Fluxo intenso e pouca sinalização. Redobre a atenção.",
    cor: "red",
    votos: 0
  },
  {
    coords: [-5.2913331723096215, -44.49343273945068],
    rua: "Av.  Olavo Sampaio",
    problema: "🚨 Alto movimento de veículos e pedestres. Risco de acidentes.",
    cor: "red",
    votos: 0
  },
  {
    coords: [-5.304294217064379, -44.48944383231806],
    rua: "Av.  Campo Dantas",
    problema: "⚠️ Buracos e pouca iluminação. Trafegue com cuidado.",
    cor: "red",
    votos: 0
  },
  {
    coords: [-5.303800519564994, -44.49618541697438],
    rua: "Av.  Costa e Silva",
    problema: "🚨 Via com buracos e grande movimentação. Atenção redobrada.",
    cor: "red",
    votos: 0
  },
  {
    coords: [-5.282648829807214, -44.49116045930247],
    rua: "Av.  Alderico Guimarães",
    problema: "⚠️ Pista irregular e sem sinalização adequada.",
    cor: "red",
    votos: 0
  },
  {
    coords: [-5.281997574034968, -44.49611622592999],
    rua: "Av.Idalgo Martins Silveira (rotatória)",
    problema: "🚨 Rotatória com fluxo intenso. Dirija com cautela.",
    cor: "red",
    votos: 0
  },
  {
    coords: [-5.317850386907172, -44.48316844287506],
    rua: "BR-135",
    problema: "⛔ Tráfego intenso e sinalização precária. Alto risco.",
    cor: "red",
    votos: 0
  },
  {
    coords: [-5.296697229972227, -44.47739374304615],
    rua: "BR-226",
    problema: "🚨 Semáforos ausentes e grande movimentação. Atenção máxima.",
    cor: "red",
    votos: 0
  },

 {
  coords: [-5.289550882324903, -44.49256064766194],
  rua: "R. Vitorino Lucena",
  problema: "⚠️ Problemas urbanos relatados. Atenção ao trafegar.",
  cor: "#facc15", // 🟡 leve
  votos: 0
},
{
  coords: [-5.286589075106344, -44.48855911884127],
  rua: "R. Ladislau Moreira",
  problema: "⚠️ Problemas urbanos relatados. Atenção ao trafegar.",
  cor: "#f97316", // 🟠 médio
  votos: 0
},
{
  coords: [-5.289627116071776, -44.490863618825784],
  rua: "R. Adalto Cruz",
  problema: "⚠️ Problemas urbanos relatados. Atenção ao trafegar.",
  cor: "#fb923c", // 🟠 médio suave
  votos: 0
},
{
  coords: [-5.28285774664263, -44.49288348813834],
  rua: "R. Magalhães de Almeida",
  problema: "⚠️ Problemas urbanos relatados. Atenção ao trafegar.",
  cor: "#38bdf8", // 🔵 neutro
  votos: 0
},
{
  coords: [-5.29705513242832, -44.49214391512271],
  rua: "R. Mário Pereira",
  problema: "⚠️ Problemas urbanos relatados. Atenção ao trafegar.",
  cor: "#facc15", // 🟡 leve
  votos: 0
},
{
  coords: [-5.30077511178637, -44.48714210275003],
  rua: "R. Raimundo França (Campo Dantas)",
  problema: "⚠️ Problemas urbanos relatados. Atenção ao trafegar.",
  cor: "#4ade80", // 🟢 tranquilo
  votos: 0
}

];
// 🚀 INICIAR
window.addEventListener("load", () => {

  const limites = [
  [-5.2828, -44.4928], // canto superior
  [-5.3007, -44.4871]  // canto inferior
];
  
  // 🗺️ MAPA
// 🗺️ MAPA
map = L.map('map', {
  zoomControl: false,
  maxZoom: 25,
  minZoom: 3,
  zoomSnap: 0.25,
  zoomDelta: 0.25
});

// 🔥 calcula limites baseado nas ruas
const bounds = L.latLngBounds(pontos.map(p => p.coords));

// 🔥 aplica o zoom automático
map.fitBounds(bounds, {
  padding: [30, 30] // espaço nas bordas (fica bonito)
});
    function criarIcone(problema) {
  let cor = "#16a34a";
  let emoji = "📍";

  if (problema === "buraco") {
    cor = "#dc2626";
    emoji = "🚧";
  }

  if (problema === "luz") {
    cor = "#eab308";
    emoji = "💡";
  }

  if (problema === "lixo") {
    cor = "#2563eb";
    emoji = "🗑️";
  }

  return L.divIcon({
    className: '',
    html: `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        background: ${cor};
        border-radius: 50%;
        color: white;
        font-size: 16px;
        box-shadow: 0 0 6px rgba(0,0,0,0.3);
      ">
        ${emoji}
      </div>
    `,
    iconSize: [28, 28]
  });
}

map.on("click", function(e) {

  const lat = e.latlng.lat;
  const lng = e.latlng.lng;

  L.popup()
    .setLatLng([lat, lng])
.setContent(`
  <div class="popup-form">

    <label>Tipo do problema</label>
    <select id="tipoProblema">
      <option>Segurança</option>
      <option>Iluminação</option>
      <option>Infraestrutura</option>
    </select>

    <label>Descrição</label>
    <textarea id="descricaoProblema" placeholder="Descreva o problema"></textarea>

    <button onclick="salvarPonto(${lat}, ${lng})">
      Salvar
    </button>

  </div>
`)
    .openOn(map);
});


  L.control.zoom({ position: 'topright' }).addTo(map);

  const normal = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
const satelite = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  {
    maxZoom: 22,
    maxNativeZoom: 19
  }
);

  L.control.layers({
    "Mapa normal": normal,
    "Satélite": satelite
  }).addTo(map);

  normal.addTo(map);

  markersUsuarios = L.layerGroup().addTo(map);
  markersFixos = L.layerGroup().addTo(map);

  carregarPontosUsuarios(); 

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

window.salvarPonto = function(lat, lng) {

  const tipo = document.getElementById("tipoProblema").value;
  const descricao = document.getElementById("descricaoProblema").value;

  // cria marcador NA HORA
  L.marker([lat, lng], {
    icon: criarIconeTipo(tipo)
  })
    .addTo(markersUsuarios) // ✅ CORRIGIDO
    .bindPopup(tipo + " - " + descricao);

  // salva no firebase
  push(ref(db, "pontosUsuarios"), {
    lat: lat,
    lng: lng,
    tipo: tipo,
    descricao: descricao
  });

  alert("Salvo!");
};

function carregarPontosUsuarios() {

  const pontosRef = ref(db, "pontosUsuarios");

  onValue(pontosRef, (snapshot) => {
    console.log("dados:", snapshot.val());
    markersUsuarios.clearLayers();

    const dados = snapshot.val();

    if (!dados) {
      console.log("Nenhum ponto encontrado");
      return;
    }

    Object.values(dados).forEach((p) => {

      const marker = L.marker([p.lat, p.lng], {
        icon: criarIconeTipo(p.tipo)
      });

      marker
        .addTo(markersUsuarios)
        .bindPopup(p.tipo + " - " + p.descricao);

    });

  }, (erro) => {
    console.error("Erro Firebase:", erro);
  });

}

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
    className: '',
    html: `
      <div style="
        position: relative;
        width: 10px;
        height: 10px;
      ">
        <!-- núcleo -->
        <div style="
          width: 12px;
          height: 12px;
          background: ${cor};
          border-radius: 50%;
          position: absolute;
          top: 1px;
          left: 1px;
          border: 2px solid white;
        "></div>

        <!-- halo discreto -->
        <div style="
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: ${cor};
          opacity: 0.15;
          position: absolute;
          top: -2px;
          left: -2px;
        "></div>
      </div>
    `,
    iconSize: [14, 14]
  });
}
function criarIconeTipo(tipo) {

  let cor = "#22c55e";

  if (tipo === "Segurança") cor = "#ef4444";
  if (tipo === "Iluminação") cor = "#facc15";
  if (tipo === "Infraestrutura") cor = "#3b82f6";

  return L.divIcon({
    className: '',
    html: `
      <div style="position: relative; width: 10px; height: 10px;">
        
        <div style="
          position: absolute;
          width: 10px;
          height: 10px;
          background: ${cor};
          border-radius: 50%;
          z-index: 2;
        "></div>

        <div style="
          position: absolute;
          width: 20px;
          height: 20px;
          background: ${cor};
          border-radius: 50%;
          opacity: 0.3;
          top: -5px;
          left: -5px;
          animation: pulse 1.5s infinite;
        "></div>

      </div>
    `,
    iconSize: [20, 20]
  });
}

function atualizarMapa() {

  markersFixos.clearLayers();

  let total = pontos.reduce((soma, p) => soma + p.votos, 0);

  pontos.forEach((p) => {

    let porcentagem = total > 0
      ? ((p.votos / total) * 100).toFixed(1)
      : 0;

    L.marker(p.coords, {
      icon: criarIcone(p.cor)
    })
    .addTo(markersFixos)
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

  let dadosOrdenados = [...pontos]
    .sort((a, b) => b.votos - a.votos)


  const nomes = dadosOrdenados.map(p => p.rua);
  const votos = dadosOrdenados.map(p => p.votos);

const altura = window.innerWidth < 600
  ? nomes.length * 45   // 📱 mais espaço no celular
  : nomes.length * 42;
canvas.parentElement.style.height = altura + "px";  

  if (grafico) {
    grafico.destroy();
  }

  grafico = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: nomes,
    datasets: [{
      data: votos,

      backgroundColor: "rgba(37, 99, 235, 0.9)",
      borderRadius: 12,

      barThickness: window.innerWidth < 600 ? 14 : 18,

      borderSkipped: false
    }]
    },

options: {
  responsive: true,
  maintainAspectRatio: false,

   layout: {
  padding: {
    left: 45,
    right: 15
  }
},

  indexAxis: 'y',

  plugins: {
    legend: { display: false },
tooltip: {
  callbacks: {
    title: function(context) {
      return context[0].label; // 🔥 nome completo aqui
    },
    label: function(context) {
      return "Votos: " + context.raw;
    }
  }
},
    title: {
      display: true,
      text: "Evolução das ocorrências",
      color: "#111",
      font: {
        size: 15,
        weight: "600"
      },
      padding: {
        bottom: 8
      }
    }
  },

  
scales: {
  x: {
    beginAtZero: true,

    ticks: {
      color: "#6b7280",
      font: {
        size: window.innerWidth < 600 ? 10 : 12
      }
    },

    grid: {
      color: "rgba(0,0,0,0.06)"
    }
  },

  y: {
    grid: {
      display: false
    },

    ticks: {
      autoSkip: false,
      color: "#111827",
      padding: 6,

      font: {
        size: window.innerWidth < 600 ? 10 : 13,
        weight: "600"
      },

      callback: function(value, index) {
        let label = this.chart.data.labels[index];
        if (!label) return "";

        const limite = window.innerWidth < 600 ? 16 : 26;

        return label.length > limite
          ? label.slice(0, limite) + "..."
          : label;
      }
    }
  }
},

  animation: false // 🔥 estilo escolar NÃO usa animação
}
  });
}