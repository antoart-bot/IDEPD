let marcadorSelecionado = null;

window.onload = function () {

  // 🌍 MAPA
  var map = L.map('map').setView([-5.300, -44.490], 14);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);

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

  // 🎨 ÍCONES
  function criarIcone(cor) {
    return L.divIcon({
      className: "",
      html: `<div style="
        background:${cor};
        width:14px;
        height:14px;
        border-radius:50%;
        box-shadow:0 0 10px ${cor};
      "></div>`
    });
  }

  // 🚀 ADICIONAR PONTOS
  pontos.forEach(p => {
    L.marker(p.coords, {
      icon: criarIcone(p.cor)
    })
    .addTo(map)
    .bindPopup(`<b>${p.rua}</b><br>${p.problema}`);
  });

  // 📍 LOCALIZAÇÃO DO USUÁRIO
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      map.setView([position.coords.latitude, position.coords.longitude], 15);
    });
  }

  // 🖱️ CLIQUE NO MAPA (opcional - pode remover se quiser)
  map.on('click', function(e) {

    if (marcadorSelecionado) {
      map.removeLayer(marcadorSelecionado);
    }

    marcadorSelecionado = L.marker([e.latlng.lat, e.latlng.lng])
      .addTo(map)
      .bindPopup("Novo problema")
      .openPopup();
  });

  // ✅ VALIDAÇÃO DO FORM (AGORA COM FORMSUBMIT)
  const form = document.querySelector("form");

  form.addEventListener("submit", function(e) {
    const problema = document.querySelector('[name="Problema"]').value;
    const local = document.querySelector('[name="Local"]').value;
    const categoria = document.querySelector('[name="Categoria"]').value;

    if (!problema || !local || !categoria) {
      e.preventDefault(); // ❌ impede envio
      alert("Preencha todos os campos!");
    }
  });

};