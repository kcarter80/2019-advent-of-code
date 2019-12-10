// Start: 7:30a
// * @ 11:12a the next day
// ** @ 11:28a (got confused, was working immediately)

const prompt = require('prompt-sync')();

class intcodeComputer {
	constructor(name,program,promptInputs) {
		this.name = name;
		this.currentInstructionIndex = 0;
		this.program = program;
		this.promptInputs = promptInputs;
		this.promptInputsIndex = 0;
		this.lastOutput = undefined;
		this.relativeBase = 0;
		//this.debug = false;
	}

	// Method
	runProgram() {  
		while ( this.program[this.currentInstructionIndex] != 99 ) {
			let currentInstruction = this.program[this.currentInstructionIndex].toString().split('').reverse().join('');
			let opcode = parseInt(currentInstruction[0]);
			//console.log(this.program,this.program.length);
			//modes:
			// 0 - position mode: the parameter is interpreted as a position.
			// 1 - immediate mode: the parameter is interpreted by value.
			// 2 - relative mode: the parameter is interpreted as a position counting from the relative base.
			let param1,param2,param3;
			let writeLocation1, writeLocation2, writeLocation3;
			let mode1 = currentInstruction[2] != undefined ? parseInt(currentInstruction[2]) : 0;
			let mode2 = currentInstruction[3] != undefined ? parseInt(currentInstruction[3]) : 0;
			let mode3 = currentInstruction[4] != undefined ? parseInt(currentInstruction[4]) : 0;

			if (mode1==0) { 
				param1 = this.program[this.program[ this.currentInstructionIndex+1 ]];
				writeLocation1 = this.program[this.currentInstructionIndex+1];
			} else if (mode1==1) {
				param1 = this.program[ this.currentInstructionIndex+1 ];
				writeLocation1 = this.currentInstructionIndex+1;
			} else if (mode1==2) {
				param1 = this.program[ this.relativeBase + this.program[ this.currentInstructionIndex+1 ]];
				writeLocation1 = this.relativeBase + this.program[this.currentInstructionIndex+1];
			}
			if (mode2==0) { 
				param2 = this.program[this.program[ this.currentInstructionIndex+2 ]];
				writeLocation2 = this.program[this.currentInstructionIndex+2];
			} else if (mode2==1) {
				param2 = this.program[ this.currentInstructionIndex+2 ];
				writeLocation2 = this.currentInstructionIndex+2;
			} else if (mode2==2) {
				param2 = this.program[this.relativeBase + this.program[ this.currentInstructionIndex+2 ]];
				writeLocation2 = this.relativeBase + this.program[this.currentInstructionIndex+2];
			}
			if (mode3==0) { 
				param3 = this.program[this.program[ this.currentInstructionIndex+3 ]];
				writeLocation3 = this.program[this.currentInstructionIndex+3];
			} else if (mode3==1) {
				param3 = this.program[ this.currentInstructionIndex+3 ];
				writeLocation3 = this.currentInstructionIndex+3;
			} else if (mode3==2) {
				param3 = this.program[this.relativeBase + this.program[ this.currentInstructionIndex+3 ]];
				writeLocation3 = this.relativeBase + this.program[this.currentInstructionIndex+3];
			}

			// The computer's available memory should be much larger than the initial program.
			// Memory beyond the initial program starts with the value 0 and can be read or written like any other memory.
			// (It is invalid to try to access memory at a negative address, though.)
			if (param1 == undefined) param1 = 0;
			if (param1 == undefined) param2 = 0;
			if (param1 == undefined) param3 = 0;

			if ( opcode == 1 ) {
				this.program[writeLocation3] = param1 + param2;
				this.currentInstructionIndex += 4;
			} else if ( opcode == 2 ) {
				//let storeLocation = mode3 ? this.currentInstructionIndex+3 : this.program[this.currentInstructionIndex+3];
				this.program[writeLocation3] = param1 * param2;
				this.currentInstructionIndex += 4;
			} else if ( opcode == 3 ) {
				// Opcode 3 takes a single integer as input and saves it to the position given by its only parameter.
				// For example, the instruction 3,50 would take an input value and store it at address 50.
				this.program[ writeLocation1 ] = (this.promptInputs && this.promptInputs[this.promptInputsIndex] != undefined) ? this.promptInputs[this.promptInputsIndex++] : parseInt(prompt(`Input:`));
				this.currentInstructionIndex += 2;
			} else if ( opcode == 4 ) {
				// Opcode 4 outputs the value of its only parameter. For example, the instruction 4,50 
				// would output the value at address 50.
				console.log(`outputting value at location ${writeLocation1}: ${this.program[ writeLocation1 ]}`);
				this.lastOutput = this.program[ writeLocation1 ];
				this.currentInstructionIndex += 2;
				if (this.connectedComputer) {
					this.connectedComputer.promptInputs.push(this.lastOutput);
					this.connectedComputer.runProgram();
				}
			} else if ( opcode == 5 ) {
				// Opcode 5 is jump-if-true: if the first parameter is non-zero, it sets the instruction pointer
				// to the value from the second parameter. Otherwise, it does nothing.
				if ( param1 ) {
					this.currentInstructionIndex = param2;
				} else {
					this.currentInstructionIndex += 3;
				}
			} else if ( opcode == 6 ) {
				// Opcode 6 is jump-if-false: if the first parameter is zero, it sets the instruction pointer 
				// to the value from the second parameter. Otherwise, it does nothing.
				if ( !param1 ) {
					this.currentInstructionIndex = param2;
				} else {
					this.currentInstructionIndex += 3;
				}
			} else if ( opcode == 7 ) {
				// Opcode 7 is less than: if the first parameter is less than the second parameter, it stores 1
				// in the position given by the third parameter. Otherwise, it stores 0.
				this.program[writeLocation3] = (param1 < param2 ? 1 : 0);
				this.currentInstructionIndex += 4;
			} else if ( opcode == 8 ) {
				// Opcode 8 is equals: if the first parameter is equal to the second parameter, it stores 1 in the
				// position given by the third parameter. Otherwise, it stores 0.
				this.program[writeLocation3] = (param1 == param2 ? 1 : 0);
				this.currentInstructionIndex += 4;
			} else if ( opcode == 9 ) {
				// Opcode 9 adjusts the relative base by the value of its only parameter. 
				// The relative base increases (or decreases, if the value is negative) by the value of the parameter
				this.relativeBase += param1;
				this.currentInstructionIndex += 2;
			} else {
				console.log(`Something went wrong. At this.currentInstructionIndex = ${this.currentInstructionIndex}.`);
				break;
			}
		}
	}
}

//let theProgram = [109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99];
//let theProgram = [1102,34915192,34915192,7,4,7,99,0];
//let theProgram = [104,1125899906842624,99];
let theProgram = [1102,34463338,34463338,63,1007,63,34463338,63,1005,63,53,1101,3,0,1000,109,988,209,12,9,1000,209,6,209,3,203,0,1008,1000,1,63,1005,63,65,1008,1000,2,63,1005,63,904,1008,1000,0,63,1005,63,58,4,25,104,0,99,4,0,104,0,99,4,17,104,0,99,0,0,1101,34,0,1013,1101,20,0,1012,1101,536,0,1023,1101,0,23,1006,1102,1,543,1022,1102,1,27,1003,1102,25,1,1014,1102,1,29,1009,1101,0,686,1025,1101,0,30,1004,1102,1,28,1017,1102,1,35,1016,1101,765,0,1028,1102,1,33,1002,1102,1,26,1000,1102,1,822,1027,1102,1,21,1001,1102,1,1,1021,1101,31,0,1007,1101,0,39,1010,1102,36,1,1019,1101,0,32,1015,1101,0,38,1018,1101,0,24,1005,1101,22,0,1011,1101,756,0,1029,1102,1,0,1020,1102,829,1,1026,1102,1,37,1008,1101,0,695,1024,109,19,1205,2,195,4,187,1105,1,199,1001,64,1,64,1002,64,2,64,109,7,1205,-6,215,1001,64,1,64,1105,1,217,4,205,1002,64,2,64,109,-16,21108,40,42,5,1005,1015,233,1106,0,239,4,223,1001,64,1,64,1002,64,2,64,109,-13,2102,1,5,63,1008,63,33,63,1005,63,261,4,245,1105,1,265,1001,64,1,64,1002,64,2,64,109,29,21101,41,0,-9,1008,1017,41,63,1005,63,291,4,271,1001,64,1,64,1105,1,291,1002,64,2,64,109,-22,2107,27,-4,63,1005,63,307,1105,1,313,4,297,1001,64,1,64,1002,64,2,64,109,7,1207,-4,30,63,1005,63,333,1001,64,1,64,1106,0,335,4,319,1002,64,2,64,109,1,21108,42,42,6,1005,1018,353,4,341,1105,1,357,1001,64,1,64,1002,64,2,64,109,14,21101,43,0,-7,1008,1019,41,63,1005,63,377,1106,0,383,4,363,1001,64,1,64,1002,64,2,64,109,-8,21102,44,1,-1,1008,1017,47,63,1005,63,407,1001,64,1,64,1105,1,409,4,389,1002,64,2,64,109,-15,2101,0,2,63,1008,63,25,63,1005,63,433,1001,64,1,64,1105,1,435,4,415,1002,64,2,64,109,7,1201,-8,0,63,1008,63,30,63,1005,63,455,1105,1,461,4,441,1001,64,1,64,1002,64,2,64,109,-12,2108,37,10,63,1005,63,483,4,467,1001,64,1,64,1106,0,483,1002,64,2,64,109,13,21107,45,44,0,1005,1011,499,1105,1,505,4,489,1001,64,1,64,1002,64,2,64,109,-2,2107,20,-8,63,1005,63,523,4,511,1106,0,527,1001,64,1,64,1002,64,2,64,109,20,2105,1,-6,1001,64,1,64,1105,1,545,4,533,1002,64,2,64,109,-28,2102,1,1,63,1008,63,30,63,1005,63,565,1105,1,571,4,551,1001,64,1,64,1002,64,2,64,109,20,1206,0,583,1105,1,589,4,577,1001,64,1,64,1002,64,2,64,109,-7,1206,6,603,4,595,1106,0,607,1001,64,1,64,1002,64,2,64,109,-14,2101,0,2,63,1008,63,33,63,1005,63,629,4,613,1105,1,633,1001,64,1,64,1002,64,2,64,109,-4,1208,8,30,63,1005,63,655,4,639,1001,64,1,64,1105,1,655,1002,64,2,64,109,23,21107,46,47,0,1005,1019,673,4,661,1105,1,677,1001,64,1,64,1002,64,2,64,109,-2,2105,1,7,4,683,1001,64,1,64,1106,0,695,1002,64,2,64,109,3,21102,47,1,-7,1008,1013,47,63,1005,63,717,4,701,1105,1,721,1001,64,1,64,1002,64,2,64,109,-11,1202,-7,1,63,1008,63,32,63,1005,63,745,1001,64,1,64,1105,1,747,4,727,1002,64,2,64,109,10,2106,0,9,4,753,1001,64,1,64,1105,1,765,1002,64,2,64,109,-24,1207,8,28,63,1005,63,783,4,771,1106,0,787,1001,64,1,64,1002,64,2,64,109,5,1201,0,0,63,1008,63,26,63,1005,63,813,4,793,1001,64,1,64,1105,1,813,1002,64,2,64,109,28,2106,0,-1,1001,64,1,64,1105,1,831,4,819,1002,64,2,64,109,-22,1202,-1,1,63,1008,63,24,63,1005,63,857,4,837,1001,64,1,64,1106,0,857,1002,64,2,64,109,-9,2108,30,6,63,1005,63,873,1106,0,879,4,863,1001,64,1,64,1002,64,2,64,109,-2,1208,10,26,63,1005,63,899,1001,64,1,64,1106,0,901,4,885,4,64,99,21102,1,27,1,21101,0,915,0,1105,1,922,21201,1,25948,1,204,1,99,109,3,1207,-2,3,63,1005,63,964,21201,-2,-1,1,21101,942,0,0,1106,0,922,22101,0,1,-1,21201,-2,-3,1,21102,957,1,0,1105,1,922,22201,1,-1,-2,1106,0,968,21201,-2,0,-2,109,-3,2106,0,0];
theComputer = new intcodeComputer('A',[...theProgram]);
theComputer.runProgram();