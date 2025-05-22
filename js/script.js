// Inisialisasi peta
const map = L.map('map').setView([-6.903, 107.6510], 13);

// Basemap: OpenStreetMap Standar
const basemapOSM = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

// Basemap: OSM Humanitarian (HOT)
const basemapHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'
});

// Basemap: Google Maps
const basemapGoogle = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
  maxZoom: 20,
  attribution: 'Map by <a href="https://maps.google.com/">Google</a>',
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

// Tambahkan basemap default ke peta
basemapOSM.addTo(map);

// Layer kontrol untuk memilih basemap
const baseMaps = {
  "OpenStreetMap": basemapOSM,
  "OSM HOT": basemapHOT,
  "Google Maps": basemapGoogle
};


// Tambahkan kontrol fullscreen
map.addControl(new L.Control.Fullscreen());

// Lokasi awal (home)
const home = {
  lat: -6.903,
  lng: 107.6510,
  zoom: 13
};

// Tambahkan kontrol lokasi (geolocation)
map.addControl(
  L.control.locate({
    locateOptions: {
      enableHighAccuracy: true
    }
  })
);


// Simbologi untuk point
const symbologyPoint = {
  radius: 5,
  fillColor: "#9dfc03",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
};

// LayerGroup untuk Jembatan PT
const jembatanPT = L.layerGroup().addTo(map);

// Memuat data GeoJSON untuk Jembatan PT
$.getJSON("./Asset/data-spasial/jembatan_pt.geojson", function (data) {
  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, symbologyPoint);
    }
  }).addTo(jembatanPT);
});

const adminKelurahanAR = new L.LayerGroup(); 
$.getJSON("./Asset/data-spasial/admin_kelurahan_ln.geojson", function (OBJECTID) { 
L.geoJSON(OBJECTID, { 
style: { 
color : "black", 
weight : 2, 
opacity : 1, 
dashArray: '3,3,20,3,20,3,20,3,20,3,20', 
lineJoin: 'round' 
} 
}).addTo(adminKelurahanAR); 
}); 
adminKelurahanAR.addTo(map); 

const landcover = new L.LayerGroup(); 
$.getJSON("./Asset/data-spasial/landcover_ar.geojson", function (REMARK) { 
L.geoJson(REMARK, { 
style: function(feature) { 
switch (feature.properties.REMARK) { 
case 'Danau/Situ': return {fillColor:"#97DBF2", fillOpacity: 0.8, weight: 
0.5, color: "#4065EB"}; 
case 'Empang':   return {fillColor:"#97DBF2", fillOpacity: 0.8, weight: 
0.5, color: "#4065EB"}; 
case 'Hutan Rimba': return {fillColor:"#38A800", fillOpacity: 0.8, color: 
"#38A800"}; 
case 'Perkebunan/Kebun':   
return {fillColor:"#E9FFBE", fillOpacity: 0.8, 
color: "#E9FFBE"}; 
case 'Permukiman dan Tempat Kegiatan': return {fillColor:"#FFBEBE", 
fillOpacity: 0.8, weight: 0.5, color: "#FB0101"}; 
case 'Sawah':   return {fillColor:"#01FBBB", fillOpacity: 0.8, weight: 
0.5, color: "#4065EB"}; 
case 'Semak Belukar': return {fillColor:"#FDFDFD", fillOpacity: 0.8, 
weight: 0.5, color: "#00A52F"}; 
case 'Sungai':   return {fillColor:"#97DBF2", fillOpacity: 0.8, weight: 
0.5, color: "#4065EB"}; 
case 'Tanah Kosong/Gundul': return {fillColor:"#FDFDFD", fillOpacity: 0.8, 
weight: 0.5, color: "#000000"}; 
case 'Tegalan/Ladang':   return {fillColor:"#EDFF85", fillOpacity: 0.8, 
color: "#EDFF85"}; 
case 'Vegetasi Non Budidaya Lainnya':   return {fillColor:"#000000", 
fillOpacity: 0.8, weight: 0.5, color: "#000000"}; 
} 
}, 
onEachFeature: function (feature, layer) { 
layer.bindPopup('<b>Tutupan Lahan: </b>'+ feature.properties.REMARK) 
} 
}).addTo(landcover); 
}); 
landcover.addTo(map); 

// control panel shp
const shapefile = {
"Jembatan" : jembatanPT,
"Batas Administrasi" : adminKelurahanAR,
"Penggunaan Lahan" : landcover
};

// Tambahkan kontrol layer ke peta
L.control.layers(baseMaps, shapefile).addTo(map);

let legend = L.control({ position: "topright" });

legend.onAdd = function () { 
    let div = L.DomUtil.create("div", "legend"); 
    div.innerHTML = 
        // Judul Legenda 
        '<p style="font-size: 18px; font-weight: bold; margin-bottom: 5px; margin-top: 10px;">Legenda</p>' + 
        '<p style="font-size: 12px; font-weight: bold; margin-bottom: 5px; margin-top: 10px;">Infrastruktur</p>' + 
        '<div><svg style="display:block;margin:auto;text-align:center;stroke-width:1;stroke:rgb(0,0,0);"><circle cx="15" cy="8" r="5" fill="#9dfc03" /></svg></div>Jembatan<br>' + 
        // Legenda Layer Batas Administrasi 
        '<p style="font-size: 12px; font-weight: bold; margin-bottom: 5px; margin-top: 10px;">Batas Administrasi</p>' + 
        '<div><svg><line x1="0" y1="11" x2="23" y2="11" style="stroke-width:2;stroke:rgb(0,0,0);stroke-dasharray:10 1 1 1 1 1 1 1 1 1"/></svg></div>Batas Desa/Kelurahan<br>' + 
        // Legenda Layer Tutupan Lahan 
        '<p style="font-size: 12px; font-weight: bold; margin-bottom: 5px; margin-top: 10px;">Tutupan Lahan</p>' + 
        '<div style="background-color: #97DBF2; height: 10px;"></div>Danau/Situ<br>' + 
        '<div style="background-color: #97DBF2; height: 10px;"></div>Empang<br>' + 
        '<div style="background-color: #38A800; height: 10px;"></div>Hutan Rimba<br>' + 
        '<div style="background-color: #E9FFBE; height: 10px;"></div>Perkebunan/Kebun<br>' + 
        '<div style="background-color: #FFBEBE; height: 10px;"></div>Permukiman dan Tempat Kegiatan<br>' + 
        '<div style="background-color: #01FBBB; height: 10px;"></div>Sawah<br>' + 
        '<div style="background-color:rgb(164, 250, 160); height: 10px;"></div>Semak Belukar<br>' + 
        '<div style="background-color: #97DBF2; height: 10px;"></div>Sungai<br>' + 
        '<div style="background-color:#D3D3D3; height: 10px;"></div>Tanah Kosong/Gundul<br>' + 
        '<div style="background-color: #EDFF85; height: 10px;"></div>Tegalan/Ladang<br>' + 
        '<div style="background-color: #000000; height: 10px;"></div>Vegetasi Non Budidaya Lainnya<br>'; 
    return div; 
}; 

legend.addTo(map);
