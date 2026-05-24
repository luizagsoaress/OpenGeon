var notyf = new Notyf({position:{x:'right', y:'bottom'}});

const dadosExibidos = {
    latitude: "",
    longitude: "",
    anteriorLatitude: "",
    anteriorLongitude: "",
    verificador: false,
    totalMercados: "",
    totalPostos: "",
    postos: [],
    mercados: []
};

const mobileToggle = document.querySelector('.mobile-toggle');
if(mobileToggle) {
mobileToggle.addEventListener("click", function() {
    const display = window.getComputedStyle(mobileMenu).display;
    if(display === 'none') {
        document.querySelector('.mobile-menu').mobileMenu.classList.remove('d-none');
        document.querySelector('.mobile-menu').mobileMenu.classList.add('d-flex');
        document.querySelector('.aside-mobile').style.height = "290px";
        document.querySelector('.map').style.height = "calc(100vh - 290px)";
    } else if(display === 'flex') {
        document.querySelector('.mobile-menu').mobileMenu.classList.remove('d-flex');
        document.querySelector('.mobile-menu').mobileMenu.classList.add('d-none');
        document.querySelector('.aside-mobile').style.height = "30px";
        document.querySelector('.map').style.height = "100vh";
    }
});
}

function desenharAlertaX(mensagem) {
    const notificacao = notyf.error(mensagem);
    setTimeout(() => {
        notyf.dismiss(notificacao);
    }, 3000);
}

function desenharalertaV(mensagem) {
    const notificacao = notyf.success(mensagem);
    setTimeout(() => {
        notyf.dismiss(notificacao);
    }, 3000);
}

async function buscarPostosDeGasolina(latitude, longitude) {
    try {
        dadosExibidos.postos = [];
        dadosExibidos.totalPostos = "";
        const query = `[out:json];
        (
            node["amenity"="fuel"](around:10000,${latitude},${longitude});
            way["amenity"="fuel"](around:10000,${latitude},${longitude});
        );
        out center;
        `;

        const res = await fetch("https://overpass-api.de/api/interpreter", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `data=${encodeURIComponent(query)}`,
        });

        const data = await res.json();

        dadosExibidos.totalPostos = data.elements.length;

        for(let i = 0; i < dadosExibidos.totalPostos; i++) dadosExibidos.postos.push(data.elements[i]);
    } catch(error) {
        dadosExibidos.totalPostos = 0;
        return;
    };
}

async function buscarMercados(latitude, longitude) {
    try {
        dadosExibidos.mercados = [];
        dadosExibidos.totalMercados = "";
        const query = `[out:json];
        (
            node["shop"="supermarket"](around:10000,${latitude},${longitude});
            node["shop"="convenience"](around:10000,${latitude},${longitude});
            node["shop"="grocery"](around:10000,${latitude},${longitude});
            node["shop"="mini_supermarket"](around:10000,${latitude},${longitude});
            node["shop"="department_store"](around:10000,${latitude},${longitude});
            node["shop"="wholesale"](around:10000,${latitude},${longitude});
            node["shop"="bakery"](around:10000,${latitude},${longitude});
            node["shop"="butcher"](around:10000,${latitude},${longitude});
            node["shop"="greengrocer"](around:10000,${latitude},${longitude});
            node["shop"="deli"](around:10000,${latitude},${longitude});
            way["shop"="supermarket"](around:10000,${latitude},${longitude});
            way["shop"="convenience"](around:10000,${latitude},${longitude});
            way["shop"="grocery"](around:10000,${latitude},${longitude});
            way["shop"="mini_supermarket"](around:10000,${latitude},${longitude});
            way["shop"="department_store"](around:10000,${latitude},${longitude});
            way["shop"="wholesale"](around:10000,${latitude},${longitude});
            way["shop"="bakery"](around:10000,${latitude},${longitude});
            way["shop"="butcher"](around:10000,${latitude},${longitude});
            way["shop"="greengrocer"](around:10000,${latitude},${longitude});
            way["shop"="deli"](around:10000,${latitude},${longitude});
        );
        out center;
        `;

        const res = await fetch("https://overpass-api.de/api/interpreter", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `data=${encodeURIComponent(query)}`,
        });

        const data = await res.json();

        dadosExibidos.totalMercados = data.elements.length;

        for(let i = 0; i < dadosExibidos.totalMercados; i++) dadosExibidos.mercados.push(data.elements[i]);
        
    } catch(error) {
        dadosExibidos.totalMercados = 0;
        return;
    };
}

let mapa = null;

function criarIconPostos(mapa, latitude, longitude) {
    const icon = L.icon({
        iconUrl: 'src/imagens/pin-postos.png',
        iconSize: [35, 35],
        iconAnchor: [24, 48],
        popupAnchor: [0, -48]
    });
    L.marker([latitude, longitude], { icon }).bindPopup(latitude + ", " + longitude).addTo(mapa);
}

function criarIconMercados(mapa, latitude, longitude) {
    const icon = L.icon({
        iconUrl: 'src/imagens/pin-mercados.png',
        iconSize: [35, 35],
        iconAnchor: [24, 48],
        popupAnchor: [0, -48]
    });
    L.marker([latitude, longitude], { icon }).bindPopup(latitude + ", " + longitude).addTo(mapa);
}

async function desenharMapaMundi(latitude, longitude) {
    if (mapa) {
        mapa.remove();
        mapa = null;
    }

    const mapDiv = document.getElementById("map");

    mapa = L.map(mapDiv).setView([latitude, longitude], 2);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(mapa);

    mapa.invalidateSize();

    document.querySelector('.label-map-container').classList.remove('d-flex');
    document.querySelector('.label-map-container').classList.add('d-none');

    mapa.on('moveend', async function() {
        const center = mapa.getCenter();
        dadosExibidos.latitude = center.lat;
        dadosExibidos.longitude = center.lng;
        await atualizarMarcadores();
    });

    await atualizarMarcadores();
}

async function desenharMapaCidade(latitude, longitude) {
    if (mapa) {
        mapa.remove();
        mapa = null;
    }

    if(!dadosExibidos.verificador) {
        await buscarMercados(latitude, longitude);
        await buscarPostosDeGasolina(latitude, longitude);
        dadosExibidos.anteriorLatitude = latitude;  
        dadosExibidos.anteriorLongitude = longitude;
        dadosExibidos.verificador = true;
    }

    const mapDiv = document.getElementById("map");

    mapa = L.map(mapDiv).setView([latitude, longitude], 16);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(mapa);

    mapa.invalidateSize();

    document.querySelector('.label-map-container').classList.remove('d-none');
    document.querySelector('.label-map-container').classList.add('d-flex');

    mapa.on('moveend', async function() {
        const center = mapa.getCenter();
        dadosExibidos.latitude = center.lat;
        dadosExibidos.longitude = center.lng;
        await atualizarMarcadores();
    });

    await atualizarMarcadores();
}

async function atualizarAbaLateral() {
    document.querySelectorAll('.lat-dat').forEach((elemento, index) => {
        elemento.textContent = dadosExibidos.latitude;
    });
    document.querySelectorAll('.lon-dat').forEach((elemento, index) => {
        elemento.textContent = dadosExibidos.longitude;
    });
    document.querySelectorAll('.Tpostos-dat').forEach((elemento, index) => {
        elemento.textContent = dadosExibidos.totalPostos;
    });
    document.querySelectorAll('.Tmercados-dat').forEach((elemento, index) => {
        elemento.textContent = dadosExibidos.totalMercados;

    });
}

function verificarKm(latitude1, longitude1, latitude2, longitude2) {
    const RaioTerra = 6371; 
    const diferencaLat = (latitude2 - latitude1) * Math.PI / 180;
    const diferencaLon = (longitude2 - longitude1) * Math.PI / 180;
    const a = Math.sin(diferencaLat/2) * Math.sin(diferencaLat/2) + Math.cos(latitude1 * Math.PI / 180) * Math.cos(latitude2 * Math.PI / 180) * Math.sin(diferencaLon/2) * Math.sin(diferencaLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return RaioTerra * c;
}

async function atualizarMarcadores() {
    const resultadoKm = verificarKm(dadosExibidos.latitude, dadosExibidos.longitude, dadosExibidos.anteriorLatitude, dadosExibidos.anteriorLongitude);
    if(resultadoKm > 10) {
        await buscarMercados(dadosExibidos.latitude, dadosExibidos.longitude);
        await buscarPostosDeGasolina(dadosExibidos.latitude, dadosExibidos.longitude);
        dadosExibidos.anteriorLatitude = dadosExibidos.latitude;
        dadosExibidos.anteriorLongitude = dadosExibidos.longitude;  
        dadosExibidos.verificador = false;
    } 

    if(dadosExibidos.totalPostos === "" || dadosExibidos.totalPostos === null) dadosExibidos.totalPostos = 0;
    if(dadosExibidos.totalMercados === "" || dadosExibidos.totalMercados === null) dadosExibidos.totalMercados = 0; 

    for(let i = 0; i < dadosExibidos.totalPostos; i++) {
        const postos = dadosExibidos.postos[i];
        const latitude = postos.lat ?? postos.center?.lat;
        const longitude = postos.lon ?? postos.center?.lon;
        if (latitude != null && longitude != null) criarIconPostos(mapa, latitude, longitude);
    }

    for(let i = 0; i < dadosExibidos.totalMercados; i++) {
        const mercado = dadosExibidos.mercados[i];
        const latitude = mercado.lat ?? mercado.center?.lat;
        const longitude = mercado.lon ?? mercado.center?.lon;
        if (latitude != null && longitude != null) criarIconMercados(mapa, latitude, longitude);
    }

    await atualizarAbaLateral();
}

async function chamadaPosicao(cep) {
    try {
        const res = await fetch(`https://viacep.com.br/ws/${encodeURIComponent(cep)}/json/`);
        const data = await res.json();

        const query = `${data.logradouro},${data.localidade}`
        const resEndereco = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=jsonv2`);
        const dataEndereco = await resEndereco.json();

        const latitude = dataEndereco[0].lat;
        const longitude = dataEndereco[0].lon;

        dadosExibidos.latitude = latitude;
        dadosExibidos.longitude = longitude;

        await desenharMapaCidade(dadosExibidos.latitude, dadosExibidos.longitude);
        await atualizarMarcadores();
        desenharalertaV("Localização encontrada com sucesso.");
    } catch(error) {
        desenharAlertaX('Erro ao buscar posição.');
        return;
    }
}

const searchCepBtn = document.querySelector(".search-btn");
if(searchCepBtn) {
searchCepBtn.addEventListener("click", async function() {
    const cep = document.querySelector(".dropdown-search-input").value.trim();
    if(cep) {
        await chamadaPosicao(cep);
        document.querySelector(".dropdown-search-input").value = "";
    } else desenharAlertaX('Por favor, insira um CEP válido.');
});
}

const mundiBtn = document.querySelector(".mapa-btn");
if(mundiBtn) {
 mundiBtn.addEventListener("click", function() {
    desenharMapaMundi(-15.7801, -47.9292);
    dadosExibidos.latitude = -15.7801;
    dadosExibidos.longitude = -47.9292;
});
}

const searchLateralBtn = document.querySelectorAll(".lateral-search-btn");
searchLateralBtn.forEach((btn, index) => {
    btn.addEventListener("click", async function() {
        const lat = parseFloat(document.querySelectorAll(".search-input-lat")[index].value.trim());
        const lon = parseFloat(document.querySelectorAll(".search-input-lon")[index].value.trim());

        document.querySelectorAll(".search-input-lat")[index].value = "";
        document.querySelectorAll(".search-input-lon")[index].value = "";

        if(Number.isNaN(lat) || Number.isNaN(lon) || lat < -90.0 || lat > 90.0 || lon < -180.0 || lon > 180.0 || lat === "" || lon === "") {
            const fallbackLat = -15.7801;
            const fallbackLon = -47.9292;
            dadosExibidos.latitude = fallbackLat;
            dadosExibidos.longitude = fallbackLon;
            await desenharMapaCidade(dadosExibidos.latitude, dadosExibidos.longitude);
            await atualizarMarcadores();
            desenharAlertaX('Por favor, insira coordenadas válidas. Modo padrão ativado.');
            return;
        }

        dadosExibidos.latitude = lat;
        dadosExibidos.longitude = lon;
        await desenharMapaCidade(dadosExibidos.latitude, dadosExibidos.longitude);
        await atualizarMarcadores();
    });
});
    
document.addEventListener("DOMContentLoaded", async function() {
    const fallbackLat = -15.7801;
    const fallbackLon = -47.9292;

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            dadosExibidos.latitude = position.coords.latitude;
            dadosExibidos.longitude = position.coords.longitude;
            await desenharMapaCidade(dadosExibidos.latitude, dadosExibidos.longitude);
            await atualizarMarcadores();
            desenharalertaV('Localização obtida com sucesso.');
        },
        async (error) =>{
            dadosExibidos.latitude = fallbackLat;
            dadosExibidos.longitude = fallbackLon;
            await desenharMapaCidade(dadosExibidos.latitude, dadosExibidos.longitude);
            await atualizarMarcadores();
            desenharAlertaX('Erro ao obter localização, usando padrão.');
        }
    );

});



