// ============================
// INISIALISASI PETA
// ============================
const map = L.map('map').setView([-6.903, 107.6510], 13);

// Basemap: OpenStreetMap Standar
const basemapOSM = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

// Basemap: OSM HOT
const osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'
});

// Basemap: Google Maps
const baseMapGoogle = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
  maxZoom: 20,
  attribution: 'Map by <a href="https://maps.google.com/">Google</a>',
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

// Tambahkan basemap default ke peta
basemapOSM.addTo(map);

// ============================
// KONTROL LAYER (dideklarasikan di awal, ditambahkan ke map di akhir)
// ============================
const baseMaps = {
  "OpenStreetMap": basemapOSM,
  "OSM HOT": osmHOT,
  "Google Maps": baseMapGoogle
};

const overlayMaps = {};

// ============================
// FULLSCREEN & BUTTONS
// ============================
map.addControl(new L.Control.Fullscreen({ position: 'topleft' }));

const home = { lat: -6.903, lng: 107.6510, zoom: 12 };
L.easyButton('fa-home', (btn, map) => {
  map.setView([home.lat, home.lng], home.zoom);
}, 'Kembali ke Home').addTo(map);

L.control.locate({
  position: 'topleft',
  setView: 'once',
  flyTo: true,
  keepCurrentZoomLevel: false,
  showPopup: false,
  locateOptions: { enableHighAccuracy: true }
}).addTo(map);

// ============================
// PANE (ATUR URUTAN LAYER)
// ============================
map.createPane('landcoverPane').style.zIndex = 400;
map.createPane('adminPane').style.zIndex = 600;
map.createPane('jembatanPane').style.zIndex = 1000; // paling atas!

// ============================
// LAYER: TUTUPAN LAHAN
// ============================
const landcover = new L.LayerGroup();
$.getJSON("./Asset/data-spasial/data-spasial/landcover_ar.geojson", function (data) {
  L.geoJson(data, {
    pane: 'landcoverPane',
    style: function (feature) {
      const warna = {
        'Danau/Situ': "#97DBF2",
        'Empang': "#97DBF2",
        'Hutan Rimba': "#38A800",
        'Perkebunan/Kebun': "#E9FFBE",
        'Permukiman dan Tempat Kegiatan': "#FFBEBE",
        'Sawah': "#01FBBB",
        'Semak Belukar': "#FDFDFD",
        'Sungai': "#97DBF2",
        'Tanah Kosong/Gundul': "#c19b03",
        'Tegalan/Ladang': "#EDFF85",
        'Vegetasi Non Budidaya Lainnya': "#000000"
      };
      return {
        fillColor: warna[feature.properties.REMARK] || "#FFFFFF",
        fillOpacity: 0.8,
        weight: 0.5,
        color: warna[feature.properties.REMARK] || "#000"
      };
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup('<b>Tutupan Lahan: </b>' + feature.properties.REMARK);
    }
  }).addTo(landcover);
});
landcover.addTo(map);
overlayMaps["Tutupan Lahan"] = landcover;

// ============================
// LAYER: BATAS ADMINISTRASI
// ============================
const adminKelurahanAR = new L.LayerGroup();
$.getJSON("./Asset/data-spasial/data-spasial/admin_kelurahan_ln.geojson", function (data) {
  L.geoJson(data, {
    pane: 'adminPane',
    style: {
      color: "black",
      weight: 2,
      opacity: 1,
      dashArray: '10 1 1 1 1 1 1 1 1 1',
      lineJoin: 'round'
    }
  }).addTo(adminKelurahanAR);
});
adminKelurahanAR.addTo(map);
overlayMaps["Batas Administrasi"] = adminKelurahanAR;

// ============================
// LAYER: JEMBATAN
// ============================
const symbologyPoint = {
  radius: 5,
  fillColor: "#9dfc03",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 1
};

const jembatanPT = new L.LayerGroup();
$.getJSON("./Asset/data-spasial/data-spasial/jembatan_pt.geojson", function (data) {
  L.geoJson(data, {
    pane: 'jembatanPane',
    pointToLayer: (feature, latlng) => L.circleMarker(latlng, symbologyPoint)
  }).addTo(jembatanPT);
});
jembatanPT.addTo(map);
overlayMaps["Jembatan"] = jembatanPT;

// ============================
// KONTROL LAYER (DIPANGGIL SEKALI SAJA DI SINI)
// ============================
L.control.layers(baseMaps, overlayMaps).addTo(map);

// ============================
// LEGENDA
// ============================
let legend = L.control({ position: "topright" });

legend.onAdd = function () {
  let div = L.DomUtil.create("div", "legend");
  div.innerHTML =
    '<p style="font-size: 18px; font-weight: bold; margin: 10px 0 5px;">Legenda</p>' +

    '<p style="font-size: 12px; font-weight: bold; margin: 10px 0 5px;">Infrastruktur</p>' +
    '<div><svg style="display:block;margin:auto;text-align:center;stroke-width:1;stroke:rgb(0,0,0);"><circle cx="15" cy="8" r="5" fill="#9dfc03" /></svg></div>Jembatan<br>' +

    '<p style="font-size: 12px; font-weight: bold; margin: 10px 0 5px;">Batas Administrasi</p>' +
    '<div><svg><line x1="0" y1="11" x2="23" y2="11" style="stroke-width:2;stroke:rgb(0,0,0);stroke-dasharray:10 1 1 1 1 1 1 1 1 1"/></svg></div>Batas Desa/Kelurahan<br>' +

    '<p style="font-size: 12px; font-weight: bold; margin: 10px 0 5px;">Tutupan Lahan</p>' +
    '<div style="background-color: #97DBF2; width:20px; height:10px; display:inline-block;"></div> Danau/Situ<br>' +
    '<div style="background-color: #97DBF2; width:20px; height:10px; display:inline-block;"></div> Empang<br>' +
    '<div style="background-color: #38A800; width:20px; height:10px; display:inline-block;"></div> Hutan Rimba<br>' +
    '<div style="background-color: #E9FFBE; width:20px; height:10px; display:inline-block;"></div> Perkebunan/Kebun<br>' +
    '<div style="background-color: #FFBEBE; width:20px; height:10px; display:inline-block;"></div> Permukiman dan Tempat Kegiatan<br>' +
    '<div style="background-color: #01FBBB; width:20px; height:10px; display:inline-block;"></div> Sawah<br>' +
    '<div style="background-color: #FDFDFD; width:20px; height:10px; display:inline-block;"></div> Semak Belukar<br>' +
    '<div style="background-color: #97DBF2; width:20px; height:10px; display:inline-block;"></div> Sungai<br>' +
    '<div style="background-color: #c19b03; width:20px; height:10px; display:inline-block;"></div> Tanah Kosong/Gundul<br>' +
    '<div style="background-color: #EDFF85; width:20px; height:10px; display:inline-block;"></div> Tegalan/Ladang<br>' +
    '<div style="background-color: #000000; width:20px; height:10px; display:inline-block;"></div> Vegetasi Non Budidaya Lainnya<br>';
  return div;
};
legend.addTo(map);
