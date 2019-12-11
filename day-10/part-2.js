const readline = require('readline');
const fs = require('fs');
const readInterface = readline.createInterface({
	input: fs.createReadStream('./input-1'),
});

let map = new Array;
let anglesAndDistances = new Array;
let stationX = 20;
let stationY = 20;
let y = 0;
let numAsteroids = 0;
readInterface.on('line', function(line) {
	let splitLine = line.split('');
	for (var x = 0; x < splitLine.length; x++) {
		if (!map[x]) {
			map[x] = new Array;
		}
		map[x][y] = splitLine[x];
let rise = stationY - y;
let run = x - stationX;
let distance = Math.sqrt(Math.pow(rise,2) + Math.pow(run,2));
let angle = Math.atan(rise / run) * 180 / Math.PI;
if (run >= 0) angle = Math.abs(angle-90);
else angle = 270 - angle;
		
		if (distance != 0 && map[x][y] == '#') {
			anglesAndDistances.push( [ angle,distance,[ `${x},${y}` ] ] );
		}
	}
	y++;
}).on('close', function() {
	console.log(map[0].map((col, i) => map.map(row => row[i])));
	
	var sorted = anglesAndDistances.sort(
		function(a,b) {
			// sort by angle first, then distance
			if (a[0] != b[0])
				return a[0] - b[0];
			else
				return a[1] - b[1];
		}
	);			

	let currentIndex = 0;
	let lastAngleRemoved;
	let totalRemoved = 0;
	while (sorted.length > 0) {
		//console.log(sorted);
		if (currentIndex > sorted.length - 1) currentIndex = 0;
		else if (lastAngleRemoved == sorted[currentIndex][0] && !sorted.every( (val, i, arr) => val[0] == arr[0][0] )) currentIndex++;
		else {
			lastAngleRemoved = sorted[currentIndex][0];
			console.log(`removed #${++totalRemoved} ${sorted.splice(currentIndex,1)} currentIndex: ${currentIndex}`);
		}
	}

});

// Reduce a fraction by finding the Greatest Common Divisor and dividing by it.
function reduce(numerator,denominator){
	var gcd = function gcd(a,b){
		return b ? gcd(b, a%b) : a;
	};
	gcd = gcd(numerator,denominator);
	return [numerator/gcd, denominator/gcd];
}