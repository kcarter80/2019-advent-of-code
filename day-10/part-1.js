const readline = require('readline');
const fs = require('fs');
const readInterface = readline.createInterface({
	input: fs.createReadStream('./input-1'),
});

let map = new Array;
let y = 0;
let numAsteroids = 0;
readInterface.on('line', function(line) {
	let splitLine = line.split('');
	for (var x = 0; x < splitLine.length; x++) {
		if (!map[x]) map[x] = new Array;
		map[x][y] = splitLine[x];
	}
	y++;
}).on('close', function() {
	// transposing for display
	//console.log(map[0].map((col, i) => map.map(row => row[i])));

	//let visiblePoints = [...Array(map.length)].map(item => Array(map[0].length).fill(true));

	
	let minBlockedAsteroids;
	let minPoint;
	// looping through each point
	for (let thisX = 0; thisX < map.length; thisX++) {
		for (let thisY = 0; thisY < map[0].length; thisY++) {
			// if it's an asteroid, find all visible points
			if (map[thisX][thisY] == '#') {
				numAsteroids++;
				// resetting
				blockedPoints = {};
				for (let blockerX = 0; blockerX < map.length; blockerX++) {
					for (let blockerY = 0; blockerY < map[0].length; blockerY++) {
						if ((blockerX != thisX || blockerY != thisY) && map[blockerX][blockerY] == '#') {
							// this is a blocking asteroid
							// need to do a slope calculation
							let rise = blockerY - thisY;
							let run = blockerX - thisX;
							// if the rise or run are 0, the blocker shares a coordinate, and the ticks need to be magnitude 1
							if (rise == 0) run = ((run < 0) ? -1 : 1);
							else if (run == 0) rise = ((rise < 0) ? -1 : 1);
							else {
								// reduce the fraction, making sure to keep the signs
								let reduced = reduce(Math.abs(rise),Math.abs(run));
								rise = reduced[0] * Math.sign(rise);
								run = reduced[1] * Math.sign(run);
							}
							let i = 1;
							while (blockerY + rise * i < map[0].length && blockerY + rise * i >= 0 && blockerX + run * i < map.length && blockerX + run * i >= 0) {	
								blockedPoints[`${blockerX + run * i},${blockerY + rise * i}`] = true;
								i++;
							}
						}
					}
				}
				let blockedAsteroids = 0;
				Object.keys(blockedPoints).forEach(function(element){
					let splitElement = element.split(',');
					if (map[splitElement[0]][splitElement[1]] == '#') {
						blockedAsteroids++;
					}
				});
				if (minBlockedAsteroids == undefined || blockedAsteroids < minBlockedAsteroids) {
					minBlockedAsteroids = blockedAsteroids;
					minPoint = `${thisX},${thisY}`
				}
			}
			
		}
	}
	console.log(numAsteroids - minBlockedAsteroids - 1, minPoint);

});

// Reduce a fraction by finding the Greatest Common Divisor and dividing by it.
function reduce(numerator,denominator){
	var gcd = function gcd(a,b){
		return b ? gcd(b, a%b) : a;
	};
	gcd = gcd(numerator,denominator);
	return [numerator/gcd, denominator/gcd];
}