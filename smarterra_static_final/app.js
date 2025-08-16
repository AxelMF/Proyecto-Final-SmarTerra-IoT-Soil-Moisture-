// Inicializar mapa Leaflet
var map = L.map('map').setView([18.5, -69.9], 7);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Marcadores de ejemplo
var stations = {
  "st01": {name: "Estación 1", coords: [18.5, -69.9]},
  "st02": {name: "Estación 2", coords: [19.0, -70.5]}
};
for (let id in stations) {
  let st = stations[id];
  L.marker(st.coords).addTo(map).bindPopup(st.name);
}

// Simulador de datos
function generateData() {
  return {
    temp: (20 + Math.random()*10).toFixed(1),
    hum: (50 + Math.random()*20).toFixed(1),
    soil: (30 + Math.random()*15).toFixed(1),
    ph: (5 + Math.random()*2).toFixed(2),
    ec: (1 + Math.random()*2).toFixed(2),
    n: (10 + Math.random()*5).toFixed(1),
    p: (8 + Math.random()*4).toFixed(1),
    k: (12 + Math.random()*6).toFixed(1)
  };
}

// Charts
var climateChart = new Chart(document.getElementById('climateChart'), {
  type: 'line',
  data: { labels: [], datasets: [
    {label: 'Temperatura (°C)', data: [], borderColor: 'red', fill: false},
    {label: 'Humedad (%)', data: [], borderColor: 'blue', fill: false}
  ]}
});
var soilChart = new Chart(document.getElementById('soilChart'), {
  type: 'line',
  data: { labels: [], datasets: [
    {label: 'Humedad Suelo (%)', data: [], borderColor: 'green', fill: false},
    {label: 'pH', data: [], borderColor: 'purple', fill: false},
    {label: 'EC', data: [], borderColor: 'orange', fill: false}
  ]}
});
var npkChart = new Chart(document.getElementById('npkChart'), {
  type: 'line',
  data: { labels: [], datasets: [
    {label: 'N', data: [], borderColor: 'brown', fill: false},
    {label: 'P', data: [], borderColor: 'pink', fill: false},
    {label: 'K', data: [], borderColor: 'black', fill: false}
  ]}
});

// Actualizar datos cada 5s
setInterval(() => {
  let d = generateData();
  let t = new Date().toLocaleTimeString();
  // Clima
  climateChart.data.labels.push(t);
  climateChart.data.datasets[0].data.push(d.temp);
  climateChart.data.datasets[1].data.push(d.hum);
  // Suelo
  soilChart.data.labels.push(t);
  soilChart.data.datasets[0].data.push(d.soil);
  soilChart.data.datasets[1].data.push(d.ph);
  soilChart.data.datasets[2].data.push(d.ec);
  // NPK
  npkChart.data.labels.push(t);
  npkChart.data.datasets[0].data.push(d.n);
  npkChart.data.datasets[1].data.push(d.p);
  npkChart.data.datasets[2].data.push(d.k);
  climateChart.update();
  soilChart.update();
  npkChart.update();
}, 5000);

// Actuadores (localStorage mock)
function toggleActuator(act) {
  let state = localStorage.getItem(act) === 'on' ? 'off' : 'on';
  localStorage.setItem(act, state);
  alert(act + ' ahora está ' + state);
}

// Reportes PDF
function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("Reporte SmarTerra", 10, 10);
  doc.text("Generado: " + new Date().toLocaleString(), 10, 20);
  doc.save("smarterra_reporte.pdf");
}

// Exportar CSV
function downloadCSV() {
  let rows = [["Tiempo","Temp","Hum","Soil","pH","EC","N","P","K"]];
  for (let i=0;i<climateChart.data.labels.length;i++) {
    rows.push([
      climateChart.data.labels[i],
      climateChart.data.datasets[0].data[i],
      climateChart.data.datasets[1].data[i],
      soilChart.data.datasets[0].data[i],
      soilChart.data.datasets[1].data[i],
      soilChart.data.datasets[2].data[i],
      npkChart.data.datasets[0].data[i],
      npkChart.data.datasets[1].data[i],
      npkChart.data.datasets[2].data[i]
    ]);
  }
  let csv = rows.map(r=>r.join(",")).join("\n");
  let blob = new Blob([csv], {type:"text/csv"});
  let a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "smarterra_datos.csv";
  a.click();
}