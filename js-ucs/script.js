function initMap() {
  var map = L.map('map').setView([-0.8868029, 119.8755227], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 180
  }).addTo(map);

  
  // Data nodes dan edges
  var nodes = [
    { id: 1, name: 'STMIK Bina Mulia Palu', lat: -0.8868029, lng: 119.8755227 },
    { id: 2, name: 'Node 2', lat: -0.88161, lng: 119.87656 },
    { id: 3, name: 'Node 3', lat: -0.87068, lng: 119.87777 },
    { id: 4, name: 'Node 4', lat: -0.87075, lng: 119.88689 },
    { id: 5, name: 'Node 5', lat: -0.88793, lng: 119.88535 },
    { id: 6, name: 'Node 6', lat: -0.85849, lng: 119.88318 },
    { id: 7, name: 'Node 7', lat: -0.86147, lng: 119.88999 },
    { id: 8, name: 'Node 8', lat: -0.85218, lng: 119.89203 },
    { id: 9, name: 'Node 9', lat: -0.85373, lng: 119.90046 },
    { id: 10, name: 'Gong Perdamaian', lat: -0.8557644, lng: 119.9117222 }
  ];

  var edges = [
    { from: 1, to: 2, cost: 0.6 },
    { from: 2, to: 3, cost: 1.2 },
    { from: 2, to: 5, cost: 1.2 },
    { from: 3, to: 4, cost: 0.75 },
    { from: 3, to: 6, cost: 1 },
    { from: 4, to: 7, cost: 1.04 },
    { from: 5, to: 4, cost: 1.96 },
    { from: 5, to: 9, cost: 7 },
    { from: 6, to: 7, cost: 0.91 },
    { from: 6, to: 8, cost: 3.9 },
    { from: 7, to: 8, cost: 1.1 },
    { from: 8, to: 9, cost: 0.95 },
    { from: 9, to: 10, cost: 1.68 }
  ];

  // Tampilkan nodes pada peta
  nodes.forEach(function (node) {
    L.marker([node.lat, node.lng]).addTo(map).bindPopup(node.name);
  });

  // Fungsi untuk mencari jalur terpendek dengan Uniform Cost Search
  function uniformCostSearch(startNodeId, endNodeId) {
    var visited = new Set();
    var queue = [{ node: startNodeId, cost: 0, path: [] }];

    while (queue.length > 0) {
        queue.sort((a, b) => a.cost - b.cost);
        var current = queue.shift();

        if (current.node === endNodeId) {
          return { path: current.path.concat(current.node), totalCost: current.cost };
          }
      

            if (visited.has(current.node)) {
                continue;
            }

              visited.add(current.node);

              edges.filter(e => e.from === current.node).forEach(function (edge) {
                  queue.push({
                      node: edge.to,
                      cost: current.cost + edge.cost,
                      path: current.path.concat(current.node)
                  });
              });
          }

          return null;
      }

       // Fungsi untuk menjalankan rute 1 ketika tombol ditekan
       document.getElementById("btnUCS").addEventListener("click", function () {
        var startNodeId = 1;
        var endNodeId = 10;
        var result = uniformCostSearch(startNodeId, endNodeId);
        var shortestPath = result ? result.path : null;
        var totalCost = result ? result.totalCost : null;

        if (shortestPath !== null) {
          // Menampilkan hasil di elemen "resultucs"
          resultucs.value = "Jalur Terpendek: " + shortestPath + "\nTotal Biaya: " + totalCost;
          displayRoute(shortestPath, 'blue');
      } else {
          resultucs.value = "Tidak ditemukan jalur.";
      }
    });

    // Fungsi untuk menampilkan jalur tanpa menggunakan algoritma pencarian
  function showPath(path) {
      if (path.length === 0) {
          console.log("Jalur kosong.");
          return;
      }

      var color = 'blue'; // Warna jalur bisa disesuaikan
      displayRoute(path, color);
  }

  // Fungsi untuk menjalankan rute berdasarkan jalur yang dipilih
  function runPath(pathNumber) {
      // Daftar jalur yang telah ditentukan
      var paths = [
          [1, 2, 3, 4, 7, 8, 9, 10], // Jalur 1
          [1, 2, 5, 9, 10], // Jalur 2
          [1, 2, 3, 6, 8, 9, 10], // Jalur 3
          [1, 2, 5, 4, 7, 8, 9, 10], // Jalur 4
          [1, 2, 3, 6, 7, 8, 9, 10], // Jalur 5
      ];

      if (pathNumber < 1 || pathNumber > paths.length) {
          console.log("Jalur tidak valid.");
          return;
      }

      var selectedPath = paths[pathNumber - 1];

      // Hapus semua polyline dari peta sebelum menampilkan jalur baru
      map.eachLayer(function (layer) {
          if (layer instanceof L.Polyline) {
              map.removeLayer(layer);
          }
      });

      // Menampilkan jalur sesuai dengan nomor jalur yang dipilih
      showPath(selectedPath);
  }

  // Menambahkan event listener untuk tombol-tombol jalur
  document.getElementById("btnPath1").addEventListener("click", function () {
      runPath(1);
  });

  document.getElementById("btnPath2").addEventListener("click", function () {
      runPath(2);
  });

  document.getElementById("btnPath3").addEventListener("click", function () {
      runPath(3);
  });

  document.getElementById("btnPath4").addEventListener("click", function () {
      runPath(4);
  });

  document.getElementById("btnPath5").addEventListener("click", function () {
      runPath(5);
  });


      // Select the reset button by its id
      var btnReset = document.getElementById("Reset");

      // Add an event listener to the reset button
      btnReset.addEventListener("click", function () {
        // Hapus semua polyline dari peta
        map.eachLayer(function (layer) {
          if (layer instanceof L.Polyline) {
            map.removeLayer(layer);
          }
          var resultucs = document.getElementById("resultucs");
          resultucs.value = "";
        });
      });

    // Fungsi untuk menampilkan rute di peta dengan warna tertentu
    function displayRoute(route, color) {
      var routeCoordinates = route.map(nodeId => {
          var node = nodes.find(n => n.id === nodeId);
          return [node.lat, node.lng];
      });

      var routeLine = L.polyline(routeCoordinates, { color: color }).addTo(map);
      map.fitBounds(routeLine.getBounds());
  }

}

window.onload = initMap;
