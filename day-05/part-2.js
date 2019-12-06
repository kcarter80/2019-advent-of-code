// Start: 7:04a
// * @ 12:08a next day
// ** @ 1:03a

const prompt = require('prompt-sync')();

/*
ABCDE
 1002

DE - two-digit opcode,      02 == opcode 2
 C - mode of 1st parameter,  0 == position mode
 B - mode of 2nd parameter,  1 == immediate mode
 A - mode of 3rd parameter,  0 == position mode,
                                  omitted due to being a leading zero
*/

let input = [3,225,1,225,6,6,1100,1,238,225,104,0,1002,114,46,224,1001,224,-736,224,4,224,1002,223,8,223,1001,224,3,224,1,223,224,223,1,166,195,224,1001,224,-137,224,4,224,102,8,223,223,101,5,224,224,1,223,224,223,1001,169,83,224,1001,224,-90,224,4,224,102,8,223,223,1001,224,2,224,1,224,223,223,101,44,117,224,101,-131,224,224,4,224,1002,223,8,223,101,5,224,224,1,224,223,223,1101,80,17,225,1101,56,51,225,1101,78,89,225,1102,48,16,225,1101,87,78,225,1102,34,33,224,101,-1122,224,224,4,224,1002,223,8,223,101,7,224,224,1,223,224,223,1101,66,53,224,101,-119,224,224,4,224,102,8,223,223,1001,224,5,224,1,223,224,223,1102,51,49,225,1101,7,15,225,2,110,106,224,1001,224,-4539,224,4,224,102,8,223,223,101,3,224,224,1,223,224,223,1102,88,78,225,102,78,101,224,101,-6240,224,224,4,224,1002,223,8,223,101,5,224,224,1,224,223,223,4,223,99,0,0,0,677,0,0,0,0,0,0,0,0,0,0,0,1105,0,99999,1105,227,247,1105,1,99999,1005,227,99999,1005,0,256,1105,1,99999,1106,227,99999,1106,0,265,1105,1,99999,1006,0,99999,1006,227,274,1105,1,99999,1105,1,280,1105,1,99999,1,225,225,225,1101,294,0,0,105,1,0,1105,1,99999,1106,0,300,1105,1,99999,1,225,225,225,1101,314,0,0,106,0,0,1105,1,99999,1107,226,677,224,102,2,223,223,1006,224,329,101,1,223,223,1108,226,677,224,1002,223,2,223,1005,224,344,101,1,223,223,8,226,677,224,102,2,223,223,1006,224,359,1001,223,1,223,1007,226,677,224,1002,223,2,223,1005,224,374,101,1,223,223,1008,677,677,224,1002,223,2,223,1005,224,389,1001,223,1,223,1108,677,226,224,1002,223,2,223,1006,224,404,1001,223,1,223,1007,226,226,224,1002,223,2,223,1005,224,419,1001,223,1,223,1107,677,226,224,1002,223,2,223,1006,224,434,101,1,223,223,108,677,677,224,1002,223,2,223,1005,224,449,1001,223,1,223,1107,677,677,224,102,2,223,223,1005,224,464,1001,223,1,223,108,226,226,224,1002,223,2,223,1006,224,479,1001,223,1,223,1008,226,226,224,102,2,223,223,1005,224,494,101,1,223,223,108,677,226,224,102,2,223,223,1005,224,509,1001,223,1,223,8,677,226,224,1002,223,2,223,1006,224,524,101,1,223,223,7,226,677,224,1002,223,2,223,1006,224,539,101,1,223,223,7,677,226,224,102,2,223,223,1006,224,554,1001,223,1,223,7,226,226,224,1002,223,2,223,1006,224,569,101,1,223,223,107,677,677,224,102,2,223,223,1006,224,584,101,1,223,223,1108,677,677,224,102,2,223,223,1006,224,599,1001,223,1,223,1008,677,226,224,1002,223,2,223,1005,224,614,1001,223,1,223,8,677,677,224,1002,223,2,223,1006,224,629,1001,223,1,223,107,226,677,224,1002,223,2,223,1006,224,644,101,1,223,223,1007,677,677,224,102,2,223,223,1006,224,659,101,1,223,223,107,226,226,224,1002,223,2,223,1006,224,674,1001,223,1,223,4,223,99,226];
//input = [3,3,1105,-1,9,1101,0,0,12,4,12,99,1];
let i = 0;
while ( input[i] != 99 ) {
	let inputString = input[i].toString().split('').reverse().join('');
	let opcode = parseInt(inputString[0]);
	let mode1 = inputString[2] != undefined ? parseInt(inputString[2]) : 0;
	let mode2 = inputString[3] != undefined ? parseInt(inputString[3]) : 0;
	let mode3 = inputString[4] != undefined ? parseInt(inputString[4]) : 0;
	
	//console.log(`i:${i} opcode:${opcode} mode1:${mode1} mode2:${mode2} mode3:${mode3}`);

	if ( opcode == 1 ) {
		console.log(`mode1: ${mode1} mode2: ${mode2} mode3: ${mode3}`);
		let operand1 = mode1 ? input[ i+1 ] : input[input[ i+1 ]];
		let operand2 = mode2 ? input[ i+2 ] : input[input[ i+2 ]];
		let storeLocation = mode3 ? i+3 : input[i+3];
		input[storeLocation] = operand1 + operand2;
		i += 4;
	} else if ( opcode == 2 ) {
		console.log(`mode1: ${mode1} mode2: ${mode2} mode3: ${mode3}`);
		let operand1 = mode1 ? input[ i+1 ] : input[input[ i+1 ]];
		let operand2 = mode2 ? input[ i+2 ] : input[input[ i+2 ]];
		let storeLocation = mode3 ? i+3 : input[i+3];
		input[storeLocation] = operand1 * operand2;
		i += 4;
	} else if ( opcode == 3 ) {
		// Opcode 3 takes a single integer as input and saves it to the position given by its only parameter.
		// For example, the instruction 3,50 would take an input value and store it at address 50.
		input[ input[ i+1 ] ] = parseInt(prompt('Input:'));
		i += 2;
	} else if ( opcode == 4 ) {
		// Opcode 4 outputs the value of its only parameter. For example, the instruction 4,50 
		// would output the value at address 50.
		if (mode1) {
			console.log(`outputting value at location ${i+1}: ${input[ i+1 ]}`)
		} else {
			console.log(`outputting value at location ${input[ i+1 ]}: ${input[ input[ i+1 ] ]}`)
		}
		i += 2;
	} else if ( opcode == 5 ) {
		// Opcode 5 is jump-if-true: if the first parameter is non-zero, it sets the instruction pointer
		// to the value from the second parameter. Otherwise, it does nothing.
		let param1 = mode1 ? input[ i+1 ] : input[input[ i+1 ]];
		if ( param1 ) {
			i = mode2 ? input[ i+2 ] : input[input[ i+2 ]];
		} else {
			i += 3;
		}
	} else if ( opcode == 6 ) {
		// Opcode 6 is jump-if-false: if the first parameter is zero, it sets the instruction pointer 
		// to the value from the second parameter. Otherwise, it does nothing.
		let param1 = mode1 ? input[ i+1 ] : input[input[ i+1 ]];
		if ( !param1 ) {
			i = mode2 ? input[ i+2 ] : input[input[ i+2 ]];
		} else {
			i += 3;
		}
		console.log(`setting i: ${i}`)
	} else if ( opcode == 7 ) {
		// Opcode 7 is less than: if the first parameter is less than the second parameter, it stores 1
		// in the position given by the third parameter. Otherwise, it stores 0.
		let param1 = mode1 ? input[ i+1 ] : input[input[ i+1 ]];
		let param2 = mode2 ? input[ i+2 ] : input[input[ i+2 ]];
		let storeLocation = mode3 ? i+3 : input[i+3];
		input[storeLocation] = (param1 < param2 ? 1 : 0);
		i += 4;
	} else if ( opcode == 8 ) {
		// Opcode 8 is equals: if the first parameter is equal to the second parameter, it stores 1 in the
		// position given by the third parameter. Otherwise, it stores 0.
		let param1 = mode1 ? input[ i+1 ] : input[input[ i+1 ]];
		let param2 = mode2 ? input[ i+2 ] : input[input[ i+2 ]];
		let storeLocation = mode3 ? i+3 : input[i+3];
		console.log(`p1:${param1} p2:${param2}`);
		input[storeLocation] = (param1 == param2 ? 1 : 0);
		i += 4;
	} else {
		console.log(`Something went wrong. At i = ${i}.`);
		break;
	}
	console.log(input);
	console.log();
}