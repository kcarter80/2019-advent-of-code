const readline = require('readline');
const fs = require('fs');
const readInterface = readline.createInterface({
	input: fs.createReadStream('./input-1'),
//	output: process.stdout,
	//console: false
});

var modules = new Array;

readInterface.on('line', function(line) {
    modules.push(line);
}).on('close', function() {
	let fuelNeeded = 0;
	for (var i = 0; i < modules.length; i++) {
		fuelNeeded += Math.floor( modules[i] / 3 ) - 2;
	}
	console.log(fuelNeeded);
});

