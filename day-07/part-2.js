// Start: 12:11p
// * @ 1:37p
// ** @ 

const prompt = require('prompt-sync')();

class intcodeComputer {
	constructor(name,program,promptInputs) {
		this.name = name;
		this.currentInstructionIndex = 0;
		this.program = program;
		this.promptInputs = promptInputs;
		this.promptInputsIndex = 0;
		this.lastOutput = undefined;
	}

	// Method
	runProgram() {  
		while ( this.program[this.currentInstructionIndex] != 99 ) {
			let currentInstruction = this.program[this.currentInstructionIndex].toString().split('').reverse().join('');
			let opcode = parseInt(currentInstruction[0]);
			let mode1 = currentInstruction[2] != undefined ? parseInt(currentInstruction[2]) : 0;
			let mode2 = currentInstruction[3] != undefined ? parseInt(currentInstruction[3]) : 0;
			let mode3 = currentInstruction[4] != undefined ? parseInt(currentInstruction[4]) : 0;
			//console.log(`${this.name} inputs: ${this.promptInputs} inputsIndex: ${this.promptInputsIndex} this.currentInstructionIndex: ${this.currentInstructionIndex} currentInstruction: ${this.program[this.currentInstructionIndex]}`);
			//console.log(this.program);
			if ( opcode == 1 ) {
				let operand1 = mode1 ? this.program[ this.currentInstructionIndex+1 ] : this.program[this.program[ this.currentInstructionIndex+1 ]];
				let operand2 = mode2 ? this.program[ this.currentInstructionIndex+2 ] : this.program[this.program[ this.currentInstructionIndex+2 ]];
				let storeLocation = mode3 ? this.currentInstructionIndex+3 : this.program[this.currentInstructionIndex+3];
				this.program[storeLocation] = operand1 + operand2;
				this.currentInstructionIndex += 4;
			} else if ( opcode == 2 ) {
				let operand1 = mode1 ? this.program[ this.currentInstructionIndex+1 ] : this.program[this.program[ this.currentInstructionIndex+1 ]];
				let operand2 = mode2 ? this.program[ this.currentInstructionIndex+2 ] : this.program[this.program[ this.currentInstructionIndex+2 ]];
				let storeLocation = mode3 ? this.currentInstructionIndex+3 : this.program[this.currentInstructionIndex+3];
				this.program[storeLocation] = operand1 * operand2;
				this.currentInstructionIndex += 4;
			} else if ( opcode == 3 ) {
				// Opcode 3 takes a single integer as input and saves it to the position given by its only parameter.
				// For example, the instruction 3,50 would take an input value and store it at address 50.
				this.program[ this.program[ this.currentInstructionIndex+1 ] ] = (this.promptInputs && this.promptInputs[this.promptInputsIndex] != undefined) ? this.promptInputs[this.promptInputsIndex++] : parseInt(prompt(`Input:`));
				this.currentInstructionIndex += 2;
			} else if ( opcode == 4 ) {
				// Opcode 4 outputs the value of its only parameter. For example, the instruction 4,50 
				// would output the value at address 50.
				if (mode1) {
					console.log(`outputting value at location ${this.currentInstructionIndex+1}: ${this.program[ this.currentInstructionIndex+1 ]}`);
					this.lastOutput = this.program[ this.currentInstructionIndex+1 ]; 
				} else {
					console.log(`outputting value at location ${this.program[ this.currentInstructionIndex+1 ]}: ${this.program[ this.program[ this.currentInstructionIndex+1 ] ]}`)
					this.lastOutput = this.program[ this.program[ this.currentInstructionIndex+1 ] ];
				}
				this.currentInstructionIndex += 2;
				if (this.connectedComputer) {
					this.connectedComputer.promptInputs.push(this.lastOutput);
					this.connectedComputer.runProgram();
				}
			} else if ( opcode == 5 ) {
				// Opcode 5 is jump-if-true: if the first parameter is non-zero, it sets the instruction pointer
				// to the value from the second parameter. Otherwise, it does nothing.
				let param1 = mode1 ? this.program[ this.currentInstructionIndex+1 ] : this.program[this.program[ this.currentInstructionIndex+1 ]];
				if ( param1 ) {
					this.currentInstructionIndex = mode2 ? this.program[ this.currentInstructionIndex+2 ] : this.program[this.program[ this.currentInstructionIndex+2 ]];
				} else {
					this.currentInstructionIndex += 3;
				}
			} else if ( opcode == 6 ) {
				// Opcode 6 is jump-if-false: if the first parameter is zero, it sets the instruction pointer 
				// to the value from the second parameter. Otherwise, it does nothing.
				let param1 = mode1 ? this.program[ this.currentInstructionIndex+1 ] : this.program[this.program[ this.currentInstructionIndex+1 ]];
				if ( !param1 ) {
					this.currentInstructionIndex = mode2 ? this.program[ this.currentInstructionIndex+2 ] : this.program[this.program[ this.currentInstructionIndex+2 ]];
				} else {
					this.currentInstructionIndex += 3;
				}
				console.log(`setting this.currentInstructionIndex: ${this.currentInstructionIndex}`)
			} else if ( opcode == 7 ) {
				// Opcode 7 is less than: if the first parameter is less than the second parameter, it stores 1
				// in the position given by the third parameter. Otherwise, it stores 0.
				let param1 = mode1 ? this.program[ this.currentInstructionIndex+1 ] : this.program[this.program[ this.currentInstructionIndex+1 ]];
				let param2 = mode2 ? this.program[ this.currentInstructionIndex+2 ] : this.program[this.program[ this.currentInstructionIndex+2 ]];
				let storeLocation = mode3 ? this.currentInstructionIndex+3 : this.program[this.currentInstructionIndex+3];
				this.program[storeLocation] = (param1 < param2 ? 1 : 0);
				this.currentInstructionIndex += 4;
			} else if ( opcode == 8 ) {
				// Opcode 8 is equals: if the first parameter is equal to the second parameter, it stores 1 in the
				// position given by the third parameter. Otherwise, it stores 0.
				let param1 = mode1 ? this.program[ this.currentInstructionIndex+1 ] : this.program[this.program[ this.currentInstructionIndex+1 ]];
				let param2 = mode2 ? this.program[ this.currentInstructionIndex+2 ] : this.program[this.program[ this.currentInstructionIndex+2 ]];
				let storeLocation = mode3 ? this.currentInstructionIndex+3 : this.program[this.currentInstructionIndex+3];
				this.program[storeLocation] = (param1 == param2 ? 1 : 0);
				this.currentInstructionIndex += 4;
			} else {
				console.log(`Something went wrong. At this.currentInstructionIndex = ${this.currentInstructionIndex}.`);
				break;
			}
		}
	}
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

//let theProgram = [3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10];
let theProgram = [3,8,1001,8,10,8,105,1,0,0,21,38,47,64,89,110,191,272,353,434,99999,3,9,101,4,9,9,102,3,9,9,101,5,9,9,4,9,99,3,9,1002,9,5,9,4,9,99,3,9,101,2,9,9,102,5,9,9,1001,9,5,9,4,9,99,3,9,1001,9,5,9,102,4,9,9,1001,9,5,9,1002,9,2,9,1001,9,3,9,4,9,99,3,9,102,2,9,9,101,4,9,9,1002,9,4,9,1001,9,4,9,4,9,99,3,9,101,1,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,99,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,99,3,9,1001,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,101,1,9,9,4,9,99,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,99,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,99];
let permutations = permute([5,6,7,8,9]);
let output, max_output, best_permutation;
for (let j = 0; j < permutations.length; j++) {
	let ampA = new intcodeComputer('A',[...theProgram],[permutations[j][0],0]);
	let ampB = new intcodeComputer('B',[...theProgram],[permutations[j][1]]);
	let ampC = new intcodeComputer('C',[...theProgram],[permutations[j][2]]);
	let ampD = new intcodeComputer('D',[...theProgram],[permutations[j][3]]);
	let ampE = new intcodeComputer('E',[...theProgram],[permutations[j][4]]);
	ampA.connectedComputer = ampB;
	ampB.connectedComputer = ampC;
	ampC.connectedComputer = ampD;
	ampD.connectedComputer = ampE;
	ampE.connectedComputer = ampA;
	ampA.runProgram();
	output = ampE.lastOutput;
	if (!max_output || max_output < output) {
		max_output = output;
		best_permutation = permutations[j];
	}
}

console.log(max_output,best_permutation);