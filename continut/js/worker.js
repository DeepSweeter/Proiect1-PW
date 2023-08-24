onmessage = function(e) {
    console.log('Message received from main script');
    var workerResult = 'Filosof: ' + e.data[0] + ' Carte: ' +  e.data[1];
    console.log('Posting message back to main script');
    postMessage(workerResult);
  }