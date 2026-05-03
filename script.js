let marcadorSelecionado = null;

window.onload = function () {

var map = L.map('map', {
  zoomControl: false
}).setView([-5.300, -44.490], 14);

L.control.zoom({
  position: 'topright'
}).addTo(map);

var normal = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

var satelite = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
  subdomains: ['mt0','mt1','mt2','mt3']
});

satelite.addTo(map);

L.control.layers({
  "Mapa": normal,
  "Satélite": satelite
}).addTo(map);

satelite.addTo(map);

  // 📍 PONTOS FIXOS
  const pontos = [
    {
      coords: [-5.302706039452708, -44.489558664933824],
      rua: "Av. José Olavo Sampaio",
      problema: "Buraco grande na via",
      cor: "red"
    },
    {
      coords: [-5.2970694674183125, -44.489331582041274],
      rua: "R. Graçaranha",
      problema: "Falta de iluminação",
      cor: "yellow"
    },
    {
      coords: [-5.30632529256416, -44.48967666797174],
      rua: "R. Pedro Gualter",
      problema: "Acúmulo de lixo",
      cor: "blue"
    },
    {
      coords: [-5.313018654760882, -44.49189830826043],
      rua: "Av. Antônio Bom",
      problema: "Rua alagada",
      cor: "red"
    },
    {
      coords: [-5.287151531562105, -44.49266770775032],
      rua: "R. Getúlio Vargas",
      problema: "Iluminação fraca",
      cor: "yellow"
    },
    {
      coords: [-5.288337269718407, -44.49784921722642],
      rua: "R. Eneas Sampaio",
      problema: "Lixo acumulado",
      cor: "blue"
    },
    {
      coords: [-5.28986445233192, -44.49845368048334],
      rua: "R. Adalberto de Macedo",
      problema: "Buracos na rua",
      cor: "red"
    }
  ];

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

  pontos.forEach(p => {
    L.marker(p.coords, {
      icon: criarIcone(p.cor)
    })
    .addTo(map)
    .bindPopup(`
  <div class="popup">
    <strong>${p.rua}</strong>
    <p>${p.problema}</p>
  </div>
`);
  }); 

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      map.setView([position.coords.latitude, position.coords.longitude], 15);
    });
  }
document.querySelector("form").addEventListener("submit", function(e) {
  e.preventDefault();

  const problema = document.querySelector('[name="Problema"]').value;
  const local = document.querySelector('[name="Local"]').value;
  const categoria = document.querySelector('[name="Categoria"]').value;

  if (!problema || !local || !categoria) {
    alert("Preencha todos os campos!");
    return;
  }

  emailjs.send("SEU_SERVICE_ID", "SEU_TEMPLATE_ID", {
    problema: problema,
    local: local,
    categoria: categoria
  })
  .then(function() {
    alert("Reclamação enviada com sucesso!");
  }, function(error) {
    alert("Erro ao enviar.");
    console.log(error);
  });
})