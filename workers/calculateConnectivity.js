self.addEventListener("message", onMessageReceive);

function onMessageReceive(e) {
  console.log(`Parsing connections...`);
  console.log(e.data);
  // const res = heavyProcessing();
  const connections = calcConnectivity(e.data);
  self.postMessage(connections);
}

function calcConnectivity(connectivity) {
  let connections = [];
  for (let i = 0; i < connectivity.length; i++){
    for (let j = i + 1; j < connectivity.length; j++) {
      if (connectivity[i][j] !== 0 && connectivity[i][j] > 0) {
        connections.push({ region1: i, region2: j, strength: connectivity[i][j] });     
      }
    }
  }

  return connections.sort((a, b) => b.strength - a.strength)
    // let keep = Math.floor(connections.length * this.computedThreshold);
  
}

// function heavyProcessing() {
//   const endTime = Date.now() + 2000;
//   while (Date.now() < endTime) {}
//   return 'CUBE MADE BY A WORKER';
// }