// start 7:35a
// * @ 7:48a


const low = 264360;
const high = 746325;

let count = 0;

for (let i = low; i <= high; i++) {
	let x = i.toString();
	if (x[0] == x[1] || x[1] == x[2] || x[2] == x[3] || x[3] == x[4] || x[4] == x[5]) {
		if (x[5] >= x[4] && x[4] >= x[3] && x[3] >= x[2] && x[2] >= x[1] && x[1] >= x[0]) {
			count += 1;
		}
	}
}

console.log(count);