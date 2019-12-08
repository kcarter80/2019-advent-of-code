// Start: 12:11p
// * @ 1:37p
// ** @ 

const prompt = require('prompt-sync')();

// input: the intcodes
// prompt_inputs: prespecified user inputs
function intcodeComputer(input,prompt_inputs) {
	let i = 0;
	let prompt_inputs_i = 0;
	let last_output;
	while ( input[i] != 99 ) {
		let inputString = input[i].toString().split('').reverse().join('');
		let opcode = parseInt(inputString[0]);
		let mode1 = inputString[2] != undefined ? parseInt(inputString[2]) : 0;
		let mode2 = inputString[3] != undefined ? parseInt(inputString[3]) : 0;
		let mode3 = inputString[4] != undefined ? parseInt(inputString[4]) : 0;

		if ( opcode == 1 ) {
			let operand1 = mode1 ? input[ i+1 ] : input[input[ i+1 ]];
			let operand2 = mode2 ? input[ i+2 ] : input[input[ i+2 ]];
			let storeLocation = mode3 ? i+3 : input[i+3];
			input[storeLocation] = operand1 + operand2;
			i += 4;
		} else if ( opcode == 2 ) {
			let operand1 = mode1 ? input[ i+1 ] : input[input[ i+1 ]];
			let operand2 = mode2 ? input[ i+2 ] : input[input[ i+2 ]];
			let storeLocation = mode3 ? i+3 : input[i+3];
			input[storeLocation] = operand1 * operand2;
			i += 4;
		} else if ( opcode == 3 ) {
			// Opcode 3 takes a single integer as input and saves it to the position given by its only parameter.
			// For example, the instruction 3,50 would take an input value and store it at address 50.
			input[ input[ i+1 ] ] = (prompt_inputs && prompt_inputs[prompt_inputs_i] != undefined) ? prompt_inputs[prompt_inputs_i++] : parseInt(prompt('Input:'));
			i += 2;
		} else if ( opcode == 4 ) {
			// Opcode 4 outputs the value of its only parameter. For example, the instruction 4,50 
			// would output the value at address 50.
			if (mode1) {
				console.log(`outputting value at location ${i+1}: ${input[ i+1 ]}`);
				last_output = input[ i+1 ]; 
			} else {
				console.log(`outputting value at location ${input[ i+1 ]}: ${input[ input[ i+1 ] ]}`)
				last_output = input[ input[ i+1 ] ];
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
			input[storeLocation] = (param1 == param2 ? 1 : 0);
			i += 4;
		} else {
			console.log(`Something went wrong. At i = ${i}.`);
			break;
		}
	}
	return last_output;
}

var usedChars = new Array;
var permArr = new Array;
function permute(input) {
	var i, ch;

	for (i = 0; i < input.length; i++) {
		ch = input.splice(i, 1)[0];
		usedChars.push(ch);
		if (input.length == 0) {
			permArr.push(usedChars.slice());
		}
		permute(input);
		input.splice(i, 0, ch);
		usedChars.pop();
	}
	return permArr
};

let permutations = permute([0,1,2,3,4]);
let max_output = null;
for (let j = 0; j < permutations.length; j++) {
	let phase_setting_sequence = permutations[j];
	let next_input = 0;
	for (let i = 0; i < phase_setting_sequence.length; i++) {
		next_input = intcodeComputer(
			[3,8,1001,8,10,8,105,1,0,0,21,38,47,64,89,110,191,272,353,434,99999,3,9,101,4,9,9,102,3,9,9,101,5,9,9,4,9,99,3,9,1002,9,5,9,4,9,99,3,9,101,2,9,9,102,5,9,9,1001,9,5,9,4,9,99,3,9,1001,9,5,9,102,4,9,9,1001,9,5,9,1002,9,2,9,1001,9,3,9,4,9,99,3,9,102,2,9,9,101,4,9,9,1002,9,4,9,1001,9,4,9,4,9,99,3,9,101,1,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,99,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,99,3,9,1001,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,101,1,9,9,4,9,99,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,99,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,99],
			[phase_setting_sequence[i],next_input]);
	}
	if (!max_output || max_output < next_input) max_output = next_input;
}

console.log(max_output);